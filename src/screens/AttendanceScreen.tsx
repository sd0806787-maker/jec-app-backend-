import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';
import { useStudent } from '../context/StudentContext';

const getSubjectIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('data structure') || n.includes('algorithm')) 
    return { icon: 'git-network-outline', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)' }; 
  if (n.includes('object oriented') || n.includes('programming')) 
    return { icon: 'code-slash-outline', color: '#F472B6', bg: 'rgba(244, 114, 182, 0.15)' }; 
  if (n.includes('digital') || n.includes('system')) 
    return { icon: 'hardware-chip-outline', color: '#34D399', bg: 'rgba(52, 211, 153, 0.15)' }; 
  if (n.includes('math')) 
    return { icon: 'calculator-outline', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.15)' }; 
  if (n.includes('python')) 
    return { icon: 'logo-python', color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.15)' }; 
  if (n.includes('indian knowledge')) 
    return { icon: 'book-outline', color: '#F87171', bg: 'rgba(248, 113, 113, 0.15)' }; 
  return { icon: 'document-text-outline', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.15)' }; 
};

const getActionText = (attended: number, total: number, target: number = 75) => {
  if (total === 0) return "No classes conducted yet";
  const currentPerc = (attended / total) * 100;
  if (currentPerc < target) {
    const needed = Math.ceil((target * total - 100 * attended) / (100 - target));
    return `Attend next ${needed} class${needed > 1 ? 'es' : ''} to reach ${target}%`;
  } else {
    const canMiss = Math.floor((100 * attended - target * total) / target);
    if (canMiss === 0) return "On the edge — don't miss";
    return `Can miss ${canMiss} more class${canMiss > 1 ? 'es' : ''}`;
  }
};

export default function AttendanceScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { studentData } = useStudent();

  if (!studentData) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goHome(navigation)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Academics</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            2026–2027 · {studentData.semester}
          </Text>
        </View>
      </View>

      <View style={[styles.tabContainer, { backgroundColor: theme.cardDarker }]}>
        <TouchableOpacity style={[styles.tabButton, { backgroundColor: theme.card }]}>
          <Text style={[styles.tabTextActive, { color: theme.text }]}>Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => navigation.navigate('CIEMarks')} 
        >
          <Text style={[styles.tabTextInactive, { color: theme.textSecondary }]}>CIE Marks</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {studentData.subjects.map((subject: any) => {
          const isLow = subject.percentage < 75;
          const statusColor = isLow ? theme.warning : theme.success;
          const statusBg = isLow ? 'rgba(245, 158, 11, 0.15)' : 'rgba(52, 211, 153, 0.15)';
          const { icon, color, bg } = getSubjectIcon(subject.name);

          return (
            <View key={subject.id} style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.cardHeader}>
                <View style={styles.subjectInfo}>
                  <View style={[styles.subjectIconCircle, { backgroundColor: bg }]}>
                    <Ionicons name={icon as any} size={20} color={color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.subjectName, { color: theme.text }]} numberOfLines={1}>
                      {subject.name}
                    </Text>
                    <Text style={[styles.subjectCode, { color: theme.textSecondary }]}>
                      {subject.id}
                    </Text>
                  </View>
                </View>

                {subject.status && (
                  <View style={[styles.badge, { backgroundColor: statusBg }]}>
                    <Text style={[styles.badgeText, { color: statusColor }]}>{subject.status}</Text>
                  </View>
                )}
              </View>

              <View style={styles.statsRow}>
                <Text style={[styles.percentageText, { color: theme.text }]}>
                  {subject.percentage || 0}%
                </Text>
                <Text style={[styles.attendedText, { color: theme.textSecondary }]}>
                  {subject.attended}/{subject.recorded} attended
                </Text>
              </View>

              <View style={[styles.progressBarBg, { backgroundColor: theme.cardDarker }]}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${subject.percentage || 0}%`, backgroundColor: statusColor }
                  ]} 
                />
              </View>

              <Text style={[styles.actionText, { color: theme.textSecondary }]}>
                {getActionText(subject.attended, subject.recorded)}
              </Text>
            </View>
          );
        })}
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
  
  tabContainer: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 12, padding: 4, marginBottom: 20 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabTextActive: { fontSize: 14, fontWeight: 'bold' },
  tabTextInactive: { fontSize: 14, fontWeight: '500' },
  
  // FIXED: Added paddingBottom
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  
  card: { borderRadius: 20, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  subjectInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 },
  subjectIconCircle: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  subjectName: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  subjectCode: { fontSize: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
  percentageText: { fontSize: 26, fontWeight: 'bold' },
  attendedText: { fontSize: 12, marginBottom: 4 },
  progressBarBg: { height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 12 },
  progressBarFill: { height: '100%', borderRadius: 3 },
  actionText: { fontSize: 12 },
});