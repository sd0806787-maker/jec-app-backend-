import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';
import { useStudent } from '../context/StudentContext';

import { ATTENDANCE_API_URL, CONTENT_BASE_URL } from '../services/api';

const STUDENTS_JSON_URL = `${CONTENT_BASE_URL}/students.json`;

interface LeaderboardStudent {
  roll: string;
  name: string;
  averageCie: number;
  attendance: number;
}

export default function ToppersScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { studentData } = useStudent();
  
  const [topCie, setTopCie] = useState<LeaderboardStudent[]>([]);
  const [topAttendance, setTopAttendance] = useState<LeaderboardStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [hasData, setHasData] = useState(false);
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const isCancelledRef = useRef(false);
  const [activeTab, setActiveTab] = useState<'cie' | 'attendance'>('cie');

  const getCacheKey = () => {
    if (!studentData) return '@toppers_cache_unknown';
    const branch = studentData.branchKey || 'OTHER';
    const sem = studentData.semester.replace('Sem ', '');
    return `@toppers_cache_${branch}_${sem}`;
  };

  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const key = getCacheKey();
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          const { topCie, topAttendance } = JSON.parse(cached);
          setTopCie(topCie || []);
          setTopAttendance(topAttendance || []);
          setHasData(true);
        } else {
          setTopCie([]);
          setTopAttendance([]);
          setHasData(false);
        }
      } catch {
        console.log("Cache read error");
      } finally {
        setIsLoading(false);
      }
    };
    loadCachedData();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [studentData]);

  const syncLeaderboard = async () => {
    if (!studentData) return;
    setIsSyncing(true);
    setSyncProgress(0);
    setElapsedTime(0);
    isCancelledRef.current = false;

    // 👇 CLEAR OLD CACHE so we don't load broken data again
    await AsyncStorage.removeItem(getCacheKey());

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    
    try {
      const branchKey = studentData.branchKey || 'OTHER';
      const sem = studentData.semester.replace('Sem ', '');
      const jsonKey = `${branchKey}_${sem}`;

      const res = await fetch(`${STUDENTS_JSON_URL}?t=${new Date().getTime()}`);
      if (!res.ok) throw new Error("Failed to load students.json");
      const rollData = await res.json();
      
      const branchRolls = rollData[jsonKey];

      if (!branchRolls || branchRolls.length === 0) {
        Alert.alert("No Data", `No roll numbers found for ${jsonKey} in the JSON file.`);
        setIsSyncing(false);
        return;
      }

      let studentsData: LeaderboardStudent[] = [];
      const BATCH_SIZE = 10; 

      for (let i = 0; i < branchRolls.length; i += BATCH_SIZE) {
        if (isCancelledRef.current) break;

        const batch = branchRolls.slice(i, i + BATCH_SIZE);
        
        const promises = batch.map((roll: string) => 
          fetch(`${ATTENDANCE_API_URL}/api/action?action=studentReport&roll=${roll}`)
            .then(res => res.json())
            .catch(() => null)
        );

        const results = await Promise.all(promises);
        if (isCancelledRef.current) break; 

        let newFoundCount = 0;

        results.forEach(data => {
          if (data && data.student && data.subjects) {
            if (String(data.student.semester) === String(sem)) {
              
              let totalCie = 0;
              let countCie = 0;

              // 👇 ROBUST CIE PARSING
              if (Array.isArray(data.subjects)) {
                data.subjects.forEach((sub: any) => {
                  // Sometimes it's called 'cie', 'cie_marks', or 'marks'
                  const cieData = sub.cie || sub.cie_marks || sub.marks;
                  
                  if (cieData) {
                    let marksArray: any[] = [];
                    if (typeof cieData === 'string') {
                      marksArray = cieData.split(',').map((s: string) => s.trim());
                    } else if (Array.isArray(cieData)) {
                      marksArray = cieData;
                    } else if (typeof cieData === 'number') {
                      marksArray = [cieData];
                    }

                    marksArray.forEach((mark: any) => {
                      // Handle objects inside arrays, e.g. { marks: 18 }
                      const val = typeof mark === 'object' && mark !== null 
                        ? (mark.marks || mark.score || mark.value || mark.cie_marks || mark.mark) 
                        : mark;

                      // Ignore null, undefined, empty strings, or "-"
                      if (val !== null && val !== undefined && val !== "" && val !== "-" && val !== "null") {
                        const num = Number(val);
                        if (!isNaN(num)) {
                          totalCie += num;
                          countCie++;
                        }
                      }
                    });
                  }
                });
              }

              // Calculate average safely
              let avg = countCie > 0 ? (totalCie / countCie) : 0;
              if (isNaN(avg)) avg = 0;
              const averageCie = parseFloat(avg.toFixed(2));
              
              if (!studentsData.find(s => s.roll === data.student.roll)) {
                studentsData.push({
                  roll: data.student.roll,
                  name: data.student.name,
                  averageCie: averageCie,
                  attendance: data.overall?.percentage || 0,
                });
                newFoundCount++;
              }
            }
          }
        });

        setSyncProgress(prev => prev + newFoundCount);
      }

      if (isCancelledRef.current) return; 

      const newTopCie = [...studentsData].filter(s => s.averageCie > 0).sort((a, b) => b.averageCie - a.averageCie).slice(0, 5);
      const newTopAttendance = [...studentsData].filter(s => s.attendance > 0).sort((a, b) => b.attendance - a.attendance).slice(0, 5);

      setTopCie(newTopCie);
      setTopAttendance(newTopAttendance);
      setHasData(true);

      await AsyncStorage.setItem(getCacheKey(), JSON.stringify({ topCie: newTopCie, topAttendance: newTopAttendance }));
      
      if (studentsData.length === 0) {
        Alert.alert("No Data", `Could not find any marks for students in ${jsonKey}.`);
      } else {
        Alert.alert("Success", `Found ${studentsData.length} students in just ${elapsedTime} seconds!`);
      }

    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", "Failed to sync leaderboard. Check your internet.");
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsSyncing(false);
    }
  };

  const handleCancel = () => {
    isCancelledRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSyncing(false);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return 'trophy';
    if (index === 1) return 'medal';
    if (index === 2) return 'ribbon';
    return null;
  };

  const renderTopperCard = (student: LeaderboardStudent, index: number, type: 'cie' | 'attendance') => {
    const isFirst = index === 0;
    const rankIcon = getRankIcon(index);

    return (
      <View 
        key={student.roll} 
        style={[
          styles.topperCard, 
          { 
            backgroundColor: theme.card,
            borderWidth: isFirst ? 2 : 1,
            borderColor: isFirst ? '#FFD700' : theme.border,
            marginTop: index === 0 ? 0 : 8, 
          }
        ]}
      >
        {isFirst && <View style={styles.goldGlow} />}

        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={isFirst ? ['#FFD700', '#FFA500'] : index === 1 ? ['#E5E7EB', '#9CA3AF'] : index === 2 ? ['#D97706', '#B45309'] : [theme.cardDarker, theme.cardDarker]}
            style={styles.avatarGradient}
          >
            {rankIcon ? (
              <Ionicons name={rankIcon as any} size={28} color="#FFF" />
            ) : (
              <Text style={[styles.rankNumber, { color: theme.text }]}>{index + 1}</Text>
            )}
          </LinearGradient>
          {isFirst && (
            <View style={styles.crownBadge}>
              <Ionicons name="star" size={12} color="#FFF" />
            </View>
          )}
        </View>

        <View style={styles.topperInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.topperName, { color: theme.text }]} numberOfLines={1}>
              {student.name}
            </Text>
            {isFirst && <Text style={{ marginLeft: 6, fontSize: 16 }}>👑</Text>}
          </View>
          <Text style={[styles.topperRoll, { color: theme.textSecondary }]}>
            Roll: {student.roll}
          </Text>
        </View>

        <View style={styles.scoreContainer}>
          <LinearGradient
            colors={type === 'cie' ? ['#34D399', '#059669'] : ['#60A5FA', '#2563EB']}
            style={styles.scoreBadge}
          >
            <Text style={styles.scoreValue}>
              {type === 'cie' ? student.averageCie : `${student.attendance}%`}
            </Text>
            <Text style={styles.scoreSubtext}>
              {type === 'cie' ? 'CIE' : 'ATT'}
            </Text>
          </LinearGradient>
        </View>

      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goHome(navigation)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Leaderboard</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {studentData?.branchKey} · {studentData?.semester}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : !hasData ? (
        
        <View style={styles.startContainer}>
          <View style={[styles.startIconBg, { backgroundColor: theme.cardDarker }]}>
            <Ionicons name="trophy" size={48} color={theme.primary} />
          </View>
          <Text style={[styles.startTitle, { color: theme.text }]}>Find Your Class Toppers</Text>
          <Text style={[styles.startSubtitle, { color: theme.textSecondary }]}>
            Scan your branch and semester to discover the top CIE scorers and highest attendance holders.
          </Text>
          
          <TouchableOpacity 
            style={[styles.startBtn, { backgroundColor: theme.primary }]} 
            onPress={syncLeaderboard}
          >
            <Text style={styles.startBtnText}>Start Finding</Text>
            <Ionicons name="search" size={20} color="#FFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

      ) : (
        
        <>
          <View style={[styles.tabContainer, { backgroundColor: theme.cardDarker }]}>
            <TouchableOpacity style={[styles.tabButton, activeTab === 'cie' && { backgroundColor: theme.card }]} onPress={() => setActiveTab('cie')}>
              <Text style={[styles.tabText, { color: activeTab === 'cie' ? theme.text : theme.textSecondary }]}>Top CIE Scorers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabButton, activeTab === 'attendance' && { backgroundColor: theme.card }]} onPress={() => setActiveTab('attendance')}>
              <Text style={[styles.tabText, { color: activeTab === 'attendance' ? theme.text : theme.textSecondary }]}>Top Attendance</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.podiumContainer}>
              {/* 👇 Added empty states so it doesn't look broken if data is missing */}
              {activeTab === 'cie' ? (
                topCie.length > 0 ? (
                  topCie.map((student, index) => renderTopperCard(student, index, 'cie'))
                ) : (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="document-text-outline" size={48} color={theme.textSecondary} />
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No CIE scores found for this batch.</Text>
                  </View>
                )
              ) : (
                topAttendance.length > 0 ? (
                  topAttendance.map((student, index) => renderTopperCard(student, index, 'attendance'))
                ) : (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="calendar-outline" size={48} color={theme.textSecondary} />
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No attendance data found for this batch.</Text>
                  </View>
                )
              )}
            </View>
            
            <View style={styles.bottomRefreshContainer}>
              <TouchableOpacity 
                style={styles.bottomRefreshBtn} 
                onPress={syncLeaderboard}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#6D28D9']}
                  style={styles.bottomRefreshGradient}
                >
                  <Ionicons name="refresh" size={20} color="#FFF" />
                  <Text style={styles.bottomRefreshText}>Reload to refresh</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </>
      )}

      <Modal visible={isSyncing} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingBox, { backgroundColor: theme.card }]}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingTitle, { color: theme.text }]}>Calculating Ranks...</Text>
            <Text style={[styles.loadingSubtitle, { color: theme.textSecondary }]}>
              Scanning your branch to find the top 5 students.
            </Text>
            
            <View style={styles.statsRow}>
              <View style={[styles.progressPill, { backgroundColor: theme.cardDarker }]}>
                <Ionicons name="people" size={16} color={theme.primary} />
                <Text style={[styles.progressText, { color: theme.text }]}>
                  {syncProgress} Found
                </Text>
              </View>

              <View style={[styles.progressPill, { backgroundColor: theme.cardDarker }]}>
                <Ionicons name="time" size={16} color={theme.primary} />
                <Text style={[styles.progressText, { color: theme.text }]}>
                  {elapsedTime}s
                </Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.cancelBtn, { borderColor: theme.danger }]} onPress={handleCancel}>
              <Ionicons name="close-circle-outline" size={18} color={theme.danger} />
              <Text style={[styles.cancelText, { color: theme.danger }]}>Cancel Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backBtn: { marginRight: 15, padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 13, marginTop: 4 },
  
  tabContainer: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 14, padding: 4, marginBottom: 20 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  tabText: { fontSize: 14, fontWeight: '600' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },

  startContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, marginTop: -50 },
  startIconBg: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  startTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  startSubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingVertical: 16, borderRadius: 16 },
  startBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  podiumContainer: { marginTop: 10, minHeight: 200 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { marginTop: 12, fontSize: 14, textAlign: 'center' },

  topperCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 24, 
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  goldGlow: {
    position: 'absolute',
    top: -5, left: -5, right: -5, bottom: -5,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    zIndex: -1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  crownBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#F59E0B',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0A0A0A',
  },
  topperInfo: {
    flex: 1,
    paddingRight: 10,
  },
  topperName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  topperRoll: {
    fontSize: 12,
    fontWeight: '500',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 2,
  },

  bottomRefreshContainer: { marginTop: 20, alignItems: 'center' },
  bottomRefreshBtn: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  bottomRefreshGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 10 },
  bottomRefreshText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  loadingOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingBox: { width: '100%', borderRadius: 24, padding: 30, alignItems: 'center' },
  loadingTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  loadingSubtitle: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 24, paddingHorizontal: 10 },
  statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 24, width: '100%' },
  progressPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 8 },
  progressText: { fontSize: 14, fontWeight: '600' },
  cancelBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1, gap: 6 },
  cancelText: { fontSize: 14, fontWeight: 'bold' },
});