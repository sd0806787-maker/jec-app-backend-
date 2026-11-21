import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';
import { useStudent } from '../context/StudentContext';
import { LostFoundItem, lostFoundApi } from '../services/api';
import { isAdminRoll } from '../config/roles';

export default function LostFoundDetailsScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const { studentData } = useStudent();
  const { itemId } = route.params;

  const [item, setItem] = useState<LostFoundItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roll = studentData?.rollNo?.trim() ?? '';
  const isAdmin = isAdminRoll(roll);
  const canDelete =
    !!item &&
    (isAdmin || (!!roll && String(item.reportedBy).trim() === roll));

  useEffect(() => {
    let cancelled = false;

    lostFoundApi
      .get(itemId)
      .then((data) => {
        if (cancelled) return;
        setItem(data);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : 'Could not load this post',
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [itemId]);

  const retryLoad = async () => {
    setIsLoading(true);
    try {
      const data = await lostFoundApi.get(itemId);
      setItem(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    goHome(navigation);
  };

  const deleteItem = async () => {
    if (!item) return;
    if (!roll) {
      Alert.alert('Not signed in', 'Please log in again to delete this post.');
      return;
    }

    setIsDeleting(true);
    try {
      await lostFoundApi.remove(item._id, roll);
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        'Delete failed',
        err instanceof Error ? err.message : 'Could not delete this post.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    if (!item) return;
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
          onPress: deleteItem,
        },
      ],
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: theme.text }]}>
        Item Details
      </Text>
      {canDelete && (
        <TouchableOpacity
          style={[
            styles.deleteHeaderBtn,
            {
              backgroundColor: theme.danger + '18',
              borderColor: theme.danger + '40',
            },
          ]}
          onPress={confirmDelete}
          disabled={isDeleting}
          accessibilityLabel="Delete post"
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color={theme.danger} />
          ) : (
            <Ionicons name="trash-outline" size={19} color={theme.danger} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={['top', 'left', 'right']}
      >
        {renderHeader()}
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.stateText, { color: theme.textSecondary }]}>
            Loading post…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !item) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={['top', 'left', 'right']}
      >
        {renderHeader()}
        <View style={styles.center}>
          <Ionicons
            name="cloud-offline-outline"
            size={52}
            color={theme.textSecondary}
          />
          <Text style={[styles.stateTitle, { color: theme.text }]}>
            Could not load this post
          </Text>
          <Text style={[styles.stateText, { color: theme.textSecondary }]}>
            {error ?? 'This post may have been deleted.'}
          </Text>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: theme.primary }]}
            onPress={retryLoad}
            activeOpacity={0.85}
          >
            <Ionicons name="refresh" size={16} color="#FFF" />
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isLost = item.type === 'Lost';

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      {renderHeader()}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {item.imageBase64 ? (
          <Image
            source={{ uri: item.imageBase64 }}
            style={styles.itemImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.noImageBox, { backgroundColor: theme.card }]}>
            <Ionicons
              name="image-outline"
              size={40}
              color={theme.textSecondary}
            />
            <Text style={[styles.noImageText, { color: theme.textSecondary }]}>
              No photo attached
            </Text>
          </View>
        )}

        <View style={styles.contentBody}>
          <View style={styles.metaRow}>
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
            <Text style={[styles.date, { color: theme.textSecondary }]}>
              {new Date(item.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            {item.itemName}
          </Text>

          <View style={[styles.infoBox, { backgroundColor: theme.card }]}>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={18} color={theme.primary} />
              <View style={styles.infoTextContainer}>
                <Text
                  style={[styles.infoLabel, { color: theme.textSecondary }]}
                >
                  Location
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {item.location}
                </Text>
              </View>
            </View>

            <View
              style={[styles.divider, { backgroundColor: theme.cardDarker }]}
            />

            <View style={styles.infoRow}>
              <Ionicons name="person" size={18} color={theme.primary} />
              <View style={styles.infoTextContainer}>
                <Text
                  style={[styles.infoLabel, { color: theme.textSecondary }]}
                >
                  Reported By
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {item.reportedBy}
                  {isAdmin && String(item.reportedBy).trim() !== roll
                    ? '  ·  Admin can delete'
                    : ''}
                </Text>
              </View>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Description
          </Text>
          <View style={[styles.descriptionBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
              {item.description}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.contactBtnWrapper}
            onPress={() => {
              const phoneRegex = /^\+?[0-9\s-]{10,}$/;
              if (phoneRegex.test(item.contact)) {
                Linking.openURL(`tel:${item.contact}`);
              } else {
                Alert.alert('Contact Info', item.contact);
              }
            }}
          >
            <LinearGradient
              colors={['#8B5CF6', '#6D28D9']}
              style={styles.contactBtn}
            >
              <Ionicons name="call" size={20} color="#FFF" />
              <Text style={styles.contactBtnText}>Contact: {item.contact}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: 20,
  },
  backBtn: { marginRight: 15, padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', flex: 1 },
  deleteHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  scrollContent: { paddingBottom: 50 },
  itemImage: { width: '100%', height: 300, backgroundColor: '#1A1A1A' },
  noImageBox: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  noImageText: { fontSize: 14, fontWeight: '500' },
  contentBody: { padding: 20 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  date: { fontSize: 13, fontWeight: '500' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, lineHeight: 32 },
  infoBox: { borderRadius: 16, padding: 16, marginBottom: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoTextContainer: { flex: 1 },
  infoLabel: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '500' },
  divider: { height: 1, marginVertical: 12, marginLeft: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  descriptionBox: { borderRadius: 16, padding: 16, marginBottom: 24 },
  descriptionText: { fontSize: 15, lineHeight: 24 },
  contactBtnWrapper: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  contactBtn: {
    height: 60,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  contactBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
