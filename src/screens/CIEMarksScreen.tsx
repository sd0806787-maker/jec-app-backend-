import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
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
  return { icon: 'book-outline', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)' };
};

// CHANGED: keep both score and max (was getMarkNumber)
const getCieDetails = (mark: any) => {
  if (mark === null || mark === undefined) return { score: null, max: null };
  if (typeof mark === 'number') return { score: mark, max: 20 };
  if (typeof mark === 'object') {
    if (mark.absent === true) return { score: 0, max: mark.maximum || 20 };
    return {
      score: mark.marks !== undefined ? mark.marks : null,
      max: mark.maximum !== undefined ? mark.maximum : 20,
    };
  }
  return { score: null, max: null };
};

export default function CIEMarksScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { studentData } = useStudent();
  const [target, setTarget] = useState<string>('80');

  if (!studentData) return null;
  const targetNum = parseInt(target) || 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goHome(navigation)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>CIE Marks</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>View your internal scores</Text>
        </View>
      </View>

      <View style={[styles.targetCard, { backgroundColor: theme.card }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.targetLabel, { color: theme.textSecondary }]}>Target Score</Text>
          <Text style={[styles.targetDesc, { color: theme.text }]}>Set your goal to see the gap</Text>
        </View>
        <View style={[styles.targetInputWrapper, { backgroundColor: theme.cardDarker, borderColor: theme.border }]}>
          <TextInput
            style={[styles.targetInput, { color: theme.text }]}
            value={target}
            onChangeText={setTarget}
            keyboardType="numeric"
            maxLength={3}
          />
          <Text style={[styles.targetPercent, { color: theme.textSecondary }]}>%</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {studentData.subjects.map((subject: any) => {
          const rawCieData = subject.cie || [null, null, null];
          const cieDetails = rawCieData.map(getCieDetails);
          const hasMarks = cieDetails.some((c: any) => c.score !== null);
          const { icon, color, bg } = getSubjectIcon(subject.name);

          if (!hasMarks) {
            return (
              <View key={subject.id} style={[styles.card, { backgroundColor: theme.card }]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: bg }]}>
                    <Ionicons name={icon as any} size={20} color={color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.subjectName, { color: theme.text }]} numberOfLines={1}>{subject.name}</Text>
                    <View style={styles.statusRow}>
                      <Ionicons name="hourglass-outline" size={14} color={theme.textSecondary} />
                      <Text style={[styles.statusText, { color: theme.textSecondary }]}>Not published yet</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }

          // CHANGED: dynamic max instead of hardcoded 60
          let totalScored = 0;
          let totalMax = 0;
          cieDetails.forEach((c: any) => {
            if (c.score !== null && c.max !== null) {
              totalScored += c.score;
              totalMax += c.max;
            }
          });

          const currentPerc = totalMax > 0 ? Math.round((totalScored / totalMax) * 100) : 0;
          const needsFocus = currentPerc < targetNum;

          return (
            <View key={subject.id} style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, { backgroundColor: bg }]}>
                  <Ionicons name={icon as any} size={20} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.subjectName, { color: theme.text }]} numberOfLines={1}>{subject.name}</Text>
                  <Text style={[styles.marksText, { color: theme.textSecondary }]}>
                    Total: {totalScored} / {totalMax} Marks
                  </Text>
                </View>
                {needsFocus && (
                  <View style={styles.focusBadge}>
                    <Ionicons name="time" size={14} color={theme.warning} />
                    <Text style={[styles.focusText, { color: theme.warning }]}>Needs Time</Text>
                  </View>
                )}
              </View>

              {/* NEW: per-CIE breakdown */}
              <View style={styles.cieRow}>
                {cieDetails.map((c: any, i: number) => {
                  const pct = c.score !== null && c.max > 0 ? Math.round((c.score / c.max) * 100) : null;
                  const below = pct !== null && pct < targetNum;
                  return (
                    <View
                      key={i}
                      style={[
                        styles.cieChip,
                        { backgroundColor: theme.cardDarker, borderColor: theme.border },
                      ]}
                    >
                      <Text style={[styles.cieLabel, { color: theme.textSecondary }]}>
                        CIE {i + 1}
                      </Text>
                      <Text style={[styles.cieValue, { color: theme.text }]}>
                        {c.score !== null ? `${c.score}/${c.max}` : '—'}
                      </Text>
                      {pct !== null && (
                        <Text style={[styles.ciePct, { color: below ? theme.warning : theme.success }]}>
                          {pct}%
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>

              <View style={styles.barContainer}>
                <View style={[styles.barBackground, { backgroundColor: theme.cardDarker }]}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${currentPerc}%`, backgroundColor: needsFocus ? theme.warning : theme.success },
                    ]}
                  />
                  <View
                    style={[
                      styles.targetMarker,
                      { left: `${targetNum}%`, backgroundColor: theme.primary },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.barFooter}>
                <Text style={[styles.percentText, { color: needsFocus ? theme.warning : theme.success }]}>
                  {currentPerc}% Current
                </Text>
                <Text style={[styles.percentText, { color: theme.primary }]}>
                  {targetNum}% Target
                </Text>
              </View>
            </View>
          );
        })}
        <View style={{ height: 120 }} />
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
  targetCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, padding: 16, borderRadius: 20, marginBottom: 24 },
  targetLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase' },
  targetDesc: { fontSize: 14, fontWeight: '500' },
  targetInputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 48 },
  targetInput: { fontSize: 18, fontWeight: 'bold', width: 40, textAlign: 'center' },
  targetPercent: { fontSize: 16, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20 },
  card: { borderRadius: 20, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  subjectName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  marksText: { fontSize: 12, fontWeight: '500' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusText: { fontSize: 12, fontStyle: 'italic' },
  focusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245, 158, 11, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  focusText: { fontSize: 10, fontWeight: 'bold' },
  barContainer: { marginTop: 16, marginBottom: 8 },
  barBackground: { height: 16, borderRadius: 8, width: '100%', overflow: 'hidden', position: 'relative' },
  barFill: { height: '100%', borderRadius: 8 },
  targetMarker: { position: 'absolute', top: 0, bottom: 0, width: 3, zIndex: 10 },
  barFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  percentText: { fontSize: 12, fontWeight: 'bold' },

  // NEW styles for the per-CIE row
  cieRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  cieChip: { flex: 1, borderRadius: 10, borderWidth: 1, paddingVertical: 8, alignItems: 'center' },
  cieLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  cieValue: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  ciePct: { fontSize: 10, fontWeight: '700', marginTop: 1 },
});