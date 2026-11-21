import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';
import { useStudent } from '../context/StudentContext';
import { DaySchedule, ClassSlot } from '../data/timetableData';

import { CONTENT_BASE_URL } from '../services/api';

const GITHUB_TIMETABLE_URL = `${CONTENT_BASE_URL}/timetable.json`;
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getSlotVisuals = (cls: ClassSlot) => {
  if (cls.type === 'Break' || cls.subject.toLowerCase().includes('no class')) {
    return { icon: 'bed-outline', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.15)' };
  }
  if (cls.type === 'Lab' || cls.subject.toLowerCase().includes('lab')) {
    return { icon: 'flask-outline', color: cls.color, bg: `${cls.color}20` };
  }
  if (cls.subject.toLowerCase().includes('minor')) {
    return { icon: 'book-outline', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.15)' };
  }

  let iconName: keyof typeof Ionicons.glyphMap = 'book';
  switch (cls.color) {
    case '#60A5FA': iconName = 'git-network'; break;
    case '#34D399': iconName = 'hardware-chip'; break;
    case '#F472B6': iconName = 'code-slash'; break;
    case '#A78BFA': iconName = 'server'; break;
    case '#FBBF24': iconName = 'calculator'; break;
    case '#F87171': iconName = 'shield-checkmark'; break;
    case '#22D3EE': iconName = 'globe'; break;
    case '#FB923C': iconName = 'rocket'; break;
    default: iconName = 'document-text'; break;
  }
  return { icon: iconName, color: cls.color, bg: `${cls.color}20` };
};

export default function TimetableScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { studentData } = useStudent();
  const [activeDay, setActiveDay] = useState('Monday');
  
  const [timetableData, setTimetableData] = useState<any>({}); 
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      
      const loadTimetable = async () => {
        setIsFetching(true);
        setFetchError(false);

        // STEP 1: Load cached data instantly (so it's never blank)
        try {
          const cachedData = await AsyncStorage.getItem('@cached_timetable');
          if (cachedData && isActive) {
            setTimetableData(JSON.parse(cachedData));
          }
        } catch {
          console.log("Cache read error");
        }

        // STEP 2: Fetch fresh data from GitHub in the background
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          // Using Cloudflare DNS for faster GitHub access
          const response = await fetch(`${GITHUB_TIMETABLE_URL}?t=${new Date().getTime()}`, {
            signal: controller.signal,
            headers: { 'User-Agent': 'JEC-App' } 
          });
          
          if (response.ok) {
            const freshData = await response.json();
            if (isActive) {
              setTimetableData(freshData);
              // Save fresh data to cache for next time
              await AsyncStorage.setItem('@cached_timetable', JSON.stringify(freshData));
              console.log("✅ Timetable updated from GitHub");
            }
          } else {
            if (isActive) setFetchError(true);
          }
        } catch (error: any) {
          console.log("❌ Fetch failed:", error.message);
          if (isActive) setFetchError(true);
        } finally {
          clearTimeout(timeoutId);
          if (isActive) setIsFetching(false);
        }
      };

      loadTimetable();

      return () => { isActive = false; };
    }, [])
  );

  if (!studentData) return null;

  const branchKey = studentData.branchKey || 'OTHER';
  const semesterKey = studentData.semester.replace('Sem ', '');

  const studentTimetable = timetableData[branchKey]?.[semesterKey] || [];
  const currentDayData = studentTimetable.find((d: DaySchedule) => d.day === activeDay) || { day: activeDay, classes: [] };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goHome(navigation)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Timetable</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              {branchKey} · {studentData.semester}
            </Text>
          </View>
          {isFetching && <ActivityIndicator size="small" color={theme.primary} />}
        </View>
      </View>

      {/* Error Banner */}
      {fetchError && (
        <View style={styles.errorBanner}>
          <Ionicons name="cloud-offline" size={16} color="#F87171" />
          <Text style={styles.errorText}>Network slow. Showing saved timetable.</Text>
        </View>
      )}

      {/* Day Selector */}
      <View style={styles.daySelectorWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroll}>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayPill, { backgroundColor: activeDay === day ? theme.primary : theme.card }]}
              onPress={() => setActiveDay(day)}
            >
              <Text style={[styles.dayText, { color: activeDay === day ? '#FFF' : theme.textSecondary }]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Class List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {currentDayData.classes.length > 0 ? (
          currentDayData.classes.map((cls: ClassSlot, index: number) => {
            const { icon, color, bg } = getSlotVisuals(cls);

            return (
              <View key={index} style={[styles.simpleCard, { backgroundColor: theme.card }]}>
                
                <View style={[styles.timeBadge, { backgroundColor: theme.cardDarker }]}>
                  <Text style={[styles.timeText, { color: theme.text }]}>
                    {cls.time.split(' - ')[0]}
                  </Text>
                  <Text style={[styles.timeTextSmall, { color: theme.textSecondary }]}>
                    {cls.time.split(' - ')[1]}
                  </Text>
                </View>

                <View style={styles.classInfo}>
                  <View style={styles.subjectRow}>
                    <View style={[styles.iconCircle, { backgroundColor: bg }]}>
                      <Ionicons name={icon as any} size={18} color={color} />
                    </View>
                    <Text style={[styles.subjectName, { color: theme.text }]} numberOfLines={2}>
                      {cls.subject}
                    </Text>
                  </View>
                </View>

                <View style={[styles.typeBadge, { backgroundColor: `${color}20` }]}>
                  <Text style={[styles.typeText, { color: color }]}>{cls.type}</Text>
                </View>

              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconBg, { backgroundColor: theme.cardDarker }]}>
              <Ionicons name="bed-outline" size={40} color="#6B7280" />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {isFetching ? 'Loading Timetable...' : 'No Classes Today!'}
            </Text>
            {!isFetching && (
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {fetchError ? 'Please check your internet connection.' : 'Take a break, catch up on sleep, or study for upcoming exams.'}
              </Text>
            )}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  backBtn: { marginRight: 15, padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 13, marginTop: 4 },
  
  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 10, marginHorizontal: 20, borderRadius: 8, marginBottom: 10, gap: 8 },
  errorText: { color: '#F87171', fontSize: 12, flex: 1 },

  daySelectorWrapper: { marginBottom: 20 },
  dayScroll: { paddingHorizontal: 20, gap: 10 },
  dayPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  dayText: { fontSize: 14, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20 },
  simpleCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 12 },
  timeBadge: { width: 70, paddingVertical: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  timeText: { fontSize: 14, fontWeight: 'bold' },
  timeTextSmall: { fontSize: 11, marginTop: 2 },
  classInfo: { flex: 1, paddingRight: 10 },
  subjectRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  subjectName: { fontSize: 14, fontWeight: '600', flex: 1 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  typeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 20 },
  emptyIconBg: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});