import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
// 1. IMPORT SAFE AREA FROM THE CORRECT LIBRARY
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';

import { CONTENT_BASE_URL } from '../services/api';

const ANNOUNCEMENTS_URL = `${CONTENT_BASE_URL}/announcements.json`;

interface Announcement {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
  isImportant: boolean;
}

export default function AnnouncementsScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${ANNOUNCEMENTS_URL}?t=${new Date().getTime()}`);
      if (response.ok) {
        const data = await response.json();
        if (data.announcements) {
          setAnnouncements(data.announcements);
          await AsyncStorage.setItem('@announcements_cache', JSON.stringify(data.announcements));
        }
      }
    } catch {
      console.log("Failed to fetch announcements");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const cached = await AsyncStorage.getItem('@announcements_cache');
        if (cached && !cancelled) {
          setAnnouncements(JSON.parse(cached));
        }
      } catch {
        console.log('Cache read error');
      } finally {
        if (!cancelled) setIsLoading(false);
      }

      try {
        const response = await fetch(
          `${ANNOUNCEMENTS_URL}?t=${new Date().getTime()}`,
        );
        if (response.ok) {
          const data = await response.json();
          if (data.announcements && !cancelled) {
            setAnnouncements(data.announcements);
            await AsyncStorage.setItem(
              '@announcements_cache',
              JSON.stringify(data.announcements),
            );
          }
        }
      } catch {
        console.log('Failed to fetch announcements');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchAnnouncements();
  };

  const getCategoryStyle = (category: string) => {
    switch (category.toLowerCase()) {
      case 'exam': return { color: '#F87171', bg: 'rgba(248, 113, 113, 0.15)', icon: 'document-text' };
      case 'event': return { color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)', icon: 'calendar' };
      case 'general': return { color: '#34D399', bg: 'rgba(52, 211, 153, 0.15)', icon: 'information-circle' };
      default: return { color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.15)', icon: 'megaphone' };
    }
  };

  return (
    // 2. APPLY THE SAFE AREA EDGES
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goHome(navigation)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Announcements</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Latest updates from JEC</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={theme.primary} />
          }
        >
          {announcements.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="megaphone-outline" size={48} color={theme.textSecondary} />
              <Text style={{ color: theme.textSecondary, marginTop: 16 }}>No announcements yet.</Text>
            </View>
          ) : (
            announcements.map((item) => {
              const catStyle = getCategoryStyle(item.category);
              
              return (
                <View 
                  key={item.id} 
                  style={[
                    styles.card, 
                    { 
                      backgroundColor: theme.card,
                      borderWidth: item.isImportant ? 1 : 0,
                      borderColor: item.isImportant ? catStyle.color : 'transparent'
                    }
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.categoryBadge, { backgroundColor: catStyle.bg }]}>
                      <Ionicons name={catStyle.icon as any} size={14} color={catStyle.color} />
                      <Text style={[styles.categoryText, { color: catStyle.color }]}>{item.category}</Text>
                    </View>
                    <Text style={[styles.dateText, { color: theme.textSecondary }]}>{item.date}</Text>
                  </View>

                  <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                    {item.isImportant && (
                      <View style={styles.importantBadge}>
                        <Ionicons name="alert-circle" size={18} color="#F87171" />
                      </View>
                    )}
                  </View>

                  <Text style={[styles.content, { color: theme.textSecondary }]}>
                    {item.content}
                  </Text>
                </View>
              );
            })
          )}
          <View style={{ height: 120 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backBtn: { marginRight: 15, padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 13, marginTop: 4 },
  
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20 },
  
  card: { 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6 },
  categoryText: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  dateText: { fontSize: 12, fontWeight: '500' },
  
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  title: { fontSize: 17, fontWeight: 'bold', flex: 1, lineHeight: 24, paddingRight: 10 },
  importantBadge: { padding: 2 },
  
  content: { fontSize: 14, lineHeight: 22 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
});