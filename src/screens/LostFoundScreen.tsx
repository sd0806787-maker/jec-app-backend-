import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';
import { useStudent } from '../context/StudentContext';
import { LostFoundItem, lostFoundApi } from '../services/api';
import { isAdminRoll } from '../config/roles';

type LoadMode = 'initial' | 'refresh' | 'silent';
type Filter = 'All' | 'Lost' | 'Found';

export default function LostFoundScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { studentData } = useStudent();

  const roll = studentData?.rollNo?.trim() ?? '';
  const isAdmin = isAdminRoll(roll);

  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const hasLoadedRef = useRef(false);

  const loadItems = useCallback(async (mode: LoadMode) => {
    if (mode === 'initial') setIsLoading(true);
    if (mode === 'refresh') setIsRefreshing(true);

    try {
      const list = await lostFoundApi.list();
      setItems(list);
      setError(null);
      hasLoadedRef.current = true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not load lost & found posts',
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadItems(hasLoadedRef.current ? 'silent' : 'initial');
    }, [loadItems]),
  );

  const canDelete = (item: LostFoundItem) =>
    isAdmin || (!!roll && String(item.reportedBy).trim() === roll);

  const confirmDelete = async (item: LostFoundItem) => {
    if (!roll) {
      Alert.alert('Not signed in', 'Please log in again to delete this post.');
      return;
    }

    setDeletingId(item._id);
    try {
      await lostFoundApi.remove(item._id, roll);
      setItems((prev) => prev.filter((entry) => entry._id !== item._id));
    } catch (err) {
      Alert.alert(
        'Delete failed',
        err instanceof Error ? err.message : 'Could not delete this post.',
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = (item: LostFoundItem) => {
    const deletingSomeoneElse =
      isAdmin && String(item.reportedBy).trim() !== roll;

    Alert.alert(
      `Delete ${item.type.toLowerCase()} post?`,
      deletingSomeoneElse
        ? `This post was created by ${item.reportedBy}. As an admin you can remove it permanently.`
        : 'This post will be removed permanently.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDelete(item),
        },
      ],
    );
  };

  const handleBack = () => {
    goHome(navigation);
  };

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.type === activeFilter;
  });

  const renderItem = ({ item }: { item: LostFoundItem }) => {
    const isLost = item.type === 'Lost';
    const isDeleting = deletingId === item._id;
    const showDelete = canDelete(item);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card }]}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('LostFoundDetails', { itemId: item._id })
        }
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isLost
                  ? 'rgba(239,68,68,0.1)'
                  : 'rgba(52,211,153,0.1)',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: isLost ? '#EF4444' : '#34D399' },
              ]}
            >
              {item.type.toUpperCase()}
            </Text>
          </View>

          <View style={styles.cardHeaderRight}>
            <Text style={[styles.date, { color: theme.textSecondary }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            {showDelete && (
              <TouchableOpacity
                style={[
                  styles.deleteBtn,
                  {
                    backgroundColor: theme.danger + '18',
                    borderColor: theme.danger + '40',
                  },
                ]}
                onPress={(event) => {
                  event.stopPropagation();
                  handleDelete(item);
                }}
                disabled={isDeleting}
                hitSlop={6}
                accessibilityLabel="Delete post"
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color={theme.danger} />
                ) : (
                  <Ionicons name="trash-outline" size={15} color={theme.danger} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          {item.itemName}
        </Text>
        <Text
          style={[styles.desc, { color: theme.textSecondary }]}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={theme.primary} />
            <Text
              style={[styles.locationText, { color: theme.primary }]}
              numberOfLines={1}
            >
              {item.location}
            </Text>
          </View>
          <Text
            style={[styles.reportedBy, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            By: {item.reportedBy}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.stateWrap}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.stateTitle, { color: theme.text }]}>
            Loading posts…
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateWrap}>
          <Ionicons
            name="cloud-offline-outline"
            size={52}
            color={theme.textSecondary}
          />
          <Text style={[styles.stateTitle, { color: theme.text }]}>
            Could not load posts
          </Text>
          <Text style={[styles.stateText, { color: theme.textSecondary }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: theme.primary }]}
            onPress={() => loadItems('initial')}
            activeOpacity={0.85}
          >
            <Ionicons name="refresh" size={16} color="#FFF" />
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (items.length > 0) {
      return (
        <View style={styles.stateWrap}>
          <Ionicons
            name="funnel-outline"
            size={52}
            color={theme.textSecondary}
          />
          <Text style={[styles.stateTitle, { color: theme.text }]}>
            No {activeFilter.toLowerCase()} items
          </Text>
          <Text style={[styles.stateText, { color: theme.textSecondary }]}>
            Switch to All to see every post.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.stateWrap}>
        <Ionicons name="search-outline" size={52} color={theme.textSecondary} />
        <Text style={[styles.stateTitle, { color: theme.text }]}>
          Nothing posted yet
        </Text>
        <Text style={[styles.stateText, { color: theme.textSecondary }]}>
          Lost something or found something on campus? Post it here.
        </Text>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('ReportLostItem')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={18} color="#FFF" />
          <Text style={styles.retryText}>Create a post</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Lost &amp; Found
        </Text>
        {isAdmin && (
          <View
            style={[
              styles.adminBadge,
              {
                backgroundColor: theme.primary + '1F',
                borderColor: theme.primary + '55',
              },
            ]}
          >
            <Ionicons name="shield-checkmark" size={13} color={theme.primary} />
            <Text style={[styles.adminText, { color: theme.primary }]}>
              Admin
            </Text>
          </View>
        )}
      </View>

      <View style={styles.filterRow}>
        {(['All', 'Lost', 'Found'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterBtn,
              { backgroundColor: theme.card },
              activeFilter === f && { backgroundColor: theme.primary },
            ]}
            onPress={() => setActiveFilter(f)}
          >
            <Text
              style={{
                color: activeFilter === f ? '#FFF' : theme.textSecondary,
                fontWeight: 'bold',
              }}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {!!error && items.length > 0 && (
        <View
          style={[styles.errorBanner, { backgroundColor: theme.danger + '18' }]}
        >
          <Ionicons name="warning-outline" size={16} color={theme.danger} />
          <Text style={[styles.errorBannerText, { color: theme.danger }]}>
            Showing saved data — pull to refresh.
          </Text>
        </View>
      )}

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          filteredItems.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadItems('refresh')}
            tintColor={theme.primary}
          />
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('ReportLostItem')}
      >
        <Ionicons name="add" size={24} color="#FFF" />
        <Text style={styles.fabText}>Post</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backBtn: { marginRight: 15, padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', flex: 1 },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  adminText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 15,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  errorBannerText: { fontSize: 12, fontWeight: '600', flex: 1 },

  listContent: { paddingHorizontal: 20, paddingBottom: 120 },
  listContentEmpty: { flexGrow: 1 },
  card: { borderRadius: 20, padding: 16, marginBottom: 16 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  date: { fontSize: 12 },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  desc: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 12,
    gap: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  locationText: { fontSize: 12, fontWeight: '600', flexShrink: 1 },
  reportedBy: { fontSize: 12 },

  stateWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 60,
    gap: 8,
  },
  stateTitle: { fontSize: 18, fontWeight: '700', marginTop: 12, textAlign: 'center' },
  stateText: { fontSize: 13.5, lineHeight: 20, textAlign: 'center' },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 16,
  },
  retryText: { color: '#FFF', fontSize: 14, fontWeight: '700' },

  // FAB Styles
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 28,
    gap: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  fabText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
