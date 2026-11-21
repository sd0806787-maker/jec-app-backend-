import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';
import { useStudent } from '../context/StudentContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CHART_HEIGHT = 160;
const DEFAULT_CIE_MAX = 20; // fallback when API sends `null` for a pending CIE

/* ---------- HELPERS ---------- */
const getCieDetails = (mark: any) => {
  if (mark === null || mark === undefined) return { score: null, max: null };
  if (typeof mark === 'number') return { score: mark, max: DEFAULT_CIE_MAX };
  if (typeof mark === 'object') {
    if (mark.absent === true) return { score: 0, max: mark.maximum || DEFAULT_CIE_MAX };
    return {
      score: mark.marks !== undefined ? mark.marks : null,
      max: mark.maximum !== undefined ? mark.maximum : DEFAULT_CIE_MAX,
    };
  }
  return { score: null, max: null };
};

const getPercent = (score: any, max: any) =>
  score !== null && max !== null && max > 0 ? (score / max) * 100 : 0;

/* ---------- HOOKS ---------- */
const useAnimatedNumber = (target: number, duration = 700) => {
  const [anim] = useState(() => new Animated.Value(0));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: target,
      duration,
      useNativeDriver: false,
    }).start();
    const id = anim.addListener(({ value }) => setDisplay(Math.round(value)));
    return () => anim.removeListener(id);
  }, [target]);

  return display;
};

/* ---------- SUB-COMPONENTS ---------- */
const FadeInCard = ({ delay = 0, style, children }: any) => {
  const [anim] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 450,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: anim,
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const PulsingTargetLine = ({ targetNum, color }: any) => {
  const [opacity] = useState(() => new Animated.Value(0.55));
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 1100, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.55, duration: 1100, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.targetLine, { bottom: `${targetNum}%`, borderColor: color, opacity }]}
    >
      <View style={[styles.targetBadge, { backgroundColor: color }]}>
        <Text style={styles.targetBadgeText}>{targetNum}%</Text>
      </View>
    </Animated.View>
  );
};

const AnimatedBar = ({ cie, index, isSelected, isBelow, onPress, theme }: any) => {
  const [scale] = useState(() => new Animated.Value(1));
  const [heightAnim] = useState(() => new Animated.Value(0));
  const percent = getPercent(cie.score, cie.max);
  const barColor = isBelow ? theme.warning : theme.success;

  useEffect(() => {
    Animated.spring(heightAnim, {
      toValue: percent,
      delay: index * 120,
      tension: 50,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  return (
    <Pressable
      style={styles.barColumn}
      onPress={() => cie.score !== null && onPress(index)}
      onPressIn={() =>
        Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, speed: 50 }).start()
      }
      onPressOut={() =>
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start()
      }
    >
      <Animated.View
        style={[styles.barTrack, { backgroundColor: theme.cardDarker, transform: [{ scale }] }]}
      >
        {cie.score !== null && (
          <Animated.View
            style={{
              width: '100%',
              height: heightAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              }),
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              overflow: 'hidden',
              backgroundColor: barColor,
            }}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        )}
        {isSelected && (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: 12, borderWidth: 2.5, borderColor: barColor },
            ]}
          />
        )}
      </Animated.View>
    </Pressable>
  );
};

/* ---------- GOAL PROJECTION ---------- */
const computeGoal = ({
  cieDetails,
  targetNum,
  theme,
}: {
  cieDetails: { score: number | null; max: number | null }[];
  targetNum: number;
  theme: any;
}) => {
  // 1. Sum ALL maxes (published + pending) to know the real final max
  let overallMax = 0;
  let pendingMax = 0;
  let pendingCount = 0;
  let totalScored = 0;

  cieDetails.forEach((c) => {
    const effMax = c.max !== null ? c.max : DEFAULT_CIE_MAX;
    overallMax += effMax;
    if (c.score !== null) {
      totalScored += c.score;
    } else {
      pendingMax += effMax;
      pendingCount += 1;
    }
  });

  if (overallMax === 0) return null;

  const currentPercent = Math.round((totalScored / overallMax) * 100);
  const targetMarks = Math.ceil((targetNum / 100) * overallMax);
  const marksNeeded = targetMarks - totalScored;
  const allPublished = pendingCount === 0;
  const maxAchievable = Math.round(((totalScored + pendingMax) / overallMax) * 100);

  // Already achieved
  if (marksNeeded <= 0) {
    if (allPublished) {
      return {
        state: 'achieved' as const,
        icon: 'checkmark-circle',
        color: theme.success,
        title: 'Target Achieved',
        subtitle: `You scored ${currentPercent}% (${totalScored}/${overallMax}), meeting your ${targetNum}% goal.`,
      };
    }
    return {
      state: 'achieved' as const,
      icon: 'checkmark-circle',
      color: theme.success,
      title: 'On Track',
      subtitle: `You've already secured ${targetNum}% with ${pendingCount} CIE${pendingCount === 1 ? '' : 's'} still to come.`,
    };
  }

  // All published but short
  if (allPublished) {
    return {
      state: 'short' as const,
      icon: 'close-circle',
      color: theme.warning,
      title: `Fell short by ${marksNeeded} marks`,
      subtitle: `You scored ${currentPercent}% (${totalScored}/${overallMax}); needed ${targetMarks}/${overallMax} for ${targetNum}%.`,
    };
  }

  // Mathematically impossible
  if (marksNeeded > pendingMax) {
    return {
      state: 'impossible' as const,
      icon: 'alert-circle',
      color: theme.warning,
      title: 'Target Unreachable',
      subtitle: `Max you can reach now is ${maxAchievable}%.`,
    };
  }

  // Achievable — the actionable case
  return {
    state: 'pending' as const,
    icon: 'flag',
    color: theme.primary,
    title: `Need ${marksNeeded} more marks`,
    subtitle: `Score ${marksNeeded} more to cross ${targetNum}%.`,
  };
};

const GoalProjection = ({ goal, theme }: any) => {
  if (!goal) return null;

  return (
    <View style={[styles.goalBox, { backgroundColor: theme.cardDarker }]}>
      <View style={[styles.goalAccent, { backgroundColor: goal.color }]} />
      <View style={[styles.goalIconCircle, { backgroundColor: theme.card }]}>
        <Ionicons name={goal.icon as any} size={20} color={goal.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.goalTitle, { color: goal.color }]}>{goal.title}</Text>
        <Text style={[styles.goalSubtitle, { color: theme.textSecondary }]}>
          {goal.subtitle}
        </Text>
      </View>
    </View>
  );
};

/* ---------- SUBJECT CARD ---------- */
const SubjectCard = ({ subject, targetNum, delay, theme }: any) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const cieDetails = (subject.cie || [null, null, null]).map(getCieDetails);
  const hasMarks = cieDetails.some((c: any) => c.score !== null);

  let totalScored = 0;
  let totalMax = 0;
  cieDetails.forEach((c: any) => {
    if (c.score !== null && c.max !== null) {
      totalScored += c.score;
      totalMax += c.max;
    }
  });
  const animatedTotal = useAnimatedNumber(totalScored);

  const goal = hasMarks ? computeGoal({ cieDetails, targetNum, theme }) : null;

  const handleBarPress = (index: number) => {
    if (cieDetails[index].score === null) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedIndex((prev) => (prev === index ? null : index));
  };

  if (!hasMarks) {
    return (
      <FadeInCard delay={delay} style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.subjectName, { color: theme.text }]} numberOfLines={1}>
              {subject.name}
            </Text>
            <View style={styles.statusRow}>
              <Ionicons name="hourglass-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                Not published yet
              </Text>
            </View>
          </View>
        </View>
      </FadeInCard>
    );
  }

  const selectedCie = selectedIndex !== null ? cieDetails[selectedIndex] : null;
  const selectedPercent = selectedCie ? getPercent(selectedCie.score, selectedCie.max) : 0;
  const selectedGap = selectedPercent - targetNum;
  const selectedIsBelow = selectedGap < 0;
  const selectedIndexSafe = selectedIndex ?? 0;

  return (
    <FadeInCard delay={delay} style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.subjectName, { color: theme.text }]} numberOfLines={1}>
            {subject.name}
          </Text>
          <Text style={[styles.marksText, { color: theme.textSecondary }]}>
            Total: {animatedTotal} / {totalMax} Marks
          </Text>
        </View>
        <View style={[styles.hintIcon, { backgroundColor: theme.cardDarker }]}>
          <Ionicons name="hand-left-outline" size={14} color={theme.textSecondary} />
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartWrapper}>
        <View style={[styles.chartArea, { height: CHART_HEIGHT }]}>
          {[25, 50, 75].map((p) => (
            <View key={p} style={[styles.gridLine, { bottom: `${p}%` }]} />
          ))}

          <PulsingTargetLine targetNum={targetNum} color={theme.primary} />

          {cieDetails.map((cie: any, index: number) => {
            const percent = getPercent(cie.score, cie.max);
            const isBelow = cie.score !== null && percent < targetNum;
            return (
              <AnimatedBar
                key={index}
                cie={cie}
                index={index}
                isSelected={selectedIndex === index}
                isBelow={isBelow}
                onPress={handleBarPress}
                theme={theme}
              />
            );
          })}
        </View>

        <View style={styles.labelRow}>
          {cieDetails.map((cie: any, index: number) => {
            const isSel = selectedIndex === index;
            return (
              <Pressable
                key={index}
                style={styles.labelColumn}
                onPress={() => handleBarPress(index)}
              >
                <Text style={[styles.barLabel, { color: theme.textSecondary }]}>
                  CIE {index + 1}
                </Text>
                <Text
                  style={[
                    styles.barScore,
                    { color: isSel ? theme.text : theme.textSecondary },
                  ]}
                >
                  {cie.score !== null ? `${cie.score}/${cie.max}` : '—'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Goal projection */}
      <GoalProjection goal={goal} theme={theme} />

      {/* Selected CIE detail panel */}
      {selectedCie && (
        <View style={[styles.infoPanel, { backgroundColor: theme.cardDarker }]}>
          <View style={styles.infoHeader}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>
              CIE {selectedIndexSafe + 1}
            </Text>
            <View
              style={[
                styles.statusPill,
                { backgroundColor: selectedIsBelow ? theme.warning : theme.success },
              ]}
            >
              <Ionicons
                name={selectedIsBelow ? 'trending-down' : 'trending-up'}
                size={12}
                color="#fff"
              />
              <Text style={styles.statusPillText}>
                {selectedIsBelow ? 'Below' : 'Above'} by{' '}
                {Math.abs(Math.round(selectedGap))}%
              </Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {selectedCie.score}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Scored</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {selectedCie.max}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Max</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text
                style={[
                  styles.statValue,
                  { color: selectedIsBelow ? theme.warning : theme.success },
                ]}
              >
                {Math.round(selectedPercent)}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Percent</Text>
            </View>
          </View>
        </View>
      )}
    </FadeInCard>
  );
};

/* ---------- MAIN SCREEN ---------- */
export default function CIEAnalyticsScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { studentData } = useStudent();
  const [target, setTarget] = useState<string>('80');

  if (!studentData) return null;
  const targetNum = Math.min(100, Math.max(0, parseInt(target) || 0));

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goHome(navigation)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>CIE Analytics</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Visualise your performance
          </Text>
        </View>
      </View>

      <View style={[styles.targetCard, { backgroundColor: theme.card }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.targetLabel, { color: theme.textSecondary }]}>
            Target Score
          </Text>
          <Text style={[styles.targetDesc, { color: theme.text }]}>
            Set your goal to see the gap
          </Text>
        </View>
        <View
          style={[
            styles.targetInputWrapper,
            { backgroundColor: theme.cardDarker, borderColor: theme.border },
          ]}
        >
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.graphTitle, { color: theme.text }]}>Marks per CIE</Text>
        <Text style={[styles.graphSubtitle, { color: theme.textSecondary }]}>
          Tap any bar for detailed insights
        </Text>

        {studentData.subjects.map((subject: any, index: number) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            targetNum={targetNum}
            delay={index * 80}
            theme={theme}
          />
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backBtn: { marginRight: 15, padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 13, marginTop: 4 },

  targetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  targetLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  targetDesc: { fontSize: 14, fontWeight: '500' },
  targetInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  targetInput: { fontSize: 18, fontWeight: 'bold', width: 40, textAlign: 'center' },
  targetPercent: { fontSize: 16, fontWeight: 'bold' },

  scrollContent: { paddingHorizontal: 20 },
  graphTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  graphSubtitle: { fontSize: 12, marginBottom: 16 },

  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.08)',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  subjectName: { fontSize: 16, fontWeight: 'bold' },
  marksText: { fontSize: 13, fontWeight: '500', marginTop: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  statusText: { fontSize: 12, fontStyle: 'italic' },
  hintIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chartWrapper: { marginBottom: 8 },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'stretch',
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 1,
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  targetLine: {
    position: 'absolute',
    left: 4,
    right: 4,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    zIndex: 10,
  },
  targetBadge: {
    position: 'absolute',
    right: -2,
    top: -10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  targetBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  barTrack: {
    flex: 1,
    width: '100%',
    maxWidth: 44,
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  labelRow: { flexDirection: 'row', marginTop: 10 },
  labelColumn: { flex: 1, alignItems: 'center' },
  barLabel: { fontSize: 11, fontWeight: '600', marginBottom: 3 },
  barScore: { fontSize: 13, fontWeight: '700' },

  // Goal projection
  goalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
    gap: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  goalAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  goalIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTitle: { fontSize: 14, fontWeight: '800', marginBottom: 3 },
  goalSubtitle: { fontSize: 12, fontWeight: '500', lineHeight: 17 },

  infoPanel: { borderRadius: 16, padding: 14, marginTop: 12 },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoTitle: { fontSize: 14, fontWeight: '700' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  statusPillText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700' },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: { width: 1, height: 28 },
});