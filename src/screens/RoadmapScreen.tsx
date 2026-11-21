import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';
import { useStudent } from '../context/StudentContext';
import {
  POPULAR_SKILLS,
  ROADMAPS,
  searchRoadmaps,
  Roadmap,
  RoadmapLevel,
} from '../data/roadmaps';

type BranchKey = 'CSE' | 'ME' | 'EE' | 'CIVIL' | 'INSTRU';

const BRANCH_ORDER: BranchKey[] = ['CSE', 'ME', 'EE', 'CIVIL', 'INSTRU'];

const BRANCH_META: Record<
  BranchKey,
  { label: string; short: string; icon: string; color: string }
> = {
  CSE: { label: 'Computer Science & Engineering', short: 'CSE', icon: 'code-slash', color: '#8B5CF6' },
  ME: { label: 'Mechanical Engineering', short: 'ME', icon: 'cog', color: '#F59E0B' },
  EE: { label: 'Electrical Engineering', short: 'EE', icon: 'flash', color: '#3B82F6' },
  CIVIL: { label: 'Civil Engineering', short: 'Civil', icon: 'business', color: '#22C55E' },
  INSTRU: { label: 'Instrumentation Engineering', short: 'Instru', icon: 'speedometer', color: '#EC4899' },
};

const BRANCH_POPULAR: Record<BranchKey, string[]> = {
  CSE: POPULAR_SKILLS,
  ME: ['AutoCAD', 'SolidWorks', 'Thermodynamics', 'Electric Vehicle Technology'],
  EE: ['Circuit Analysis', 'Power Systems', 'Embedded Systems', 'PLC Programming'],
  CIVIL: ['AutoCAD', 'Revit', 'Structural Analysis', 'Quantity Surveying'],
  INSTRU: ['Instrumentation & Measurement', 'PLC Programming', 'SCADA', 'Sensors & Transducers'],
};

/** Branch of a roadmap: generated entries carry `branch:<KEY>:<slug>` ids. */
const branchOf = (roadmap: Roadmap): BranchKey => {
  const match = /^branch:([A-Z]+):/.exec(roadmap.id);
  return (match?.[1] as BranchKey) ?? 'CSE';
};

const resolveBranch = (branchKey?: string | null, branchName?: string | null): BranchKey => {
  const key = (branchKey ?? '').toUpperCase().trim();
  if (key === 'CSE' || key.includes('COMP')) return 'CSE';
  if (key === 'ME' || key.includes('MECH')) return 'ME';
  if (key === 'CE' || key.includes('CIVIL')) return 'CIVIL';
  if (key === 'IN' || key.includes('INSTRU')) return 'INSTRU';
  if (key === 'EE' || key === 'ETC' || key.includes('ELECT')) return 'EE';

  const name = (branchName ?? '').toLowerCase();
  if (name.includes('computer')) return 'CSE';
  if (name.includes('mechanical')) return 'ME';
  if (name.includes('civil')) return 'CIVIL';
  if (name.includes('instrumentation')) return 'INSTRU';
  if (name.includes('electrical') || name.includes('electronics')) return 'EE';
  return 'CSE';
};

const levelColor = (level: RoadmapLevel, theme: any) => {
  if (level === 'Beginner') return theme.success;
  if (level === 'Intermediate') return theme.warning;
  return theme.danger;
};

interface CourseSection {
  title: string;
  icon: string;
  color: string;
  data: Roadmap[];
}

const RoadmapCard = React.memo(function RoadmapCard({
  roadmap,
  theme,
  onOpen,
}: {
  roadmap: Roadmap;
  theme: any;
  onOpen: (id: string) => void;
}) {
  const badgeColor = levelColor(roadmap.level, theme);
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => onOpen(roadmap.id)}
      activeOpacity={0.85}
    >
      <View style={[styles.cardIcon, { backgroundColor: roadmap.color + '22' }]}>
        <Ionicons name={roadmap.icon as any} size={24} color={roadmap.color} />
      </View>

      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
          {roadmap.title}
        </Text>
        <Text style={[styles.cardDesc, { color: theme.textSecondary }]} numberOfLines={2}>
          {roadmap.description}
        </Text>

        <View style={styles.metaRow}>
          <View style={[styles.levelBadge, { backgroundColor: badgeColor + '20' }]}>
            <Text style={[styles.levelText, { color: badgeColor }]}>{roadmap.level}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={theme.textSecondary} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {roadmap.duration}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="layers-outline" size={13} color={theme.textSecondary} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {roadmap.stages.length} stages
            </Text>
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
    </TouchableOpacity>
  );
});

export default function RoadmapScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { studentData } = useStudent();

  const detectedBranch = useMemo(
    () => resolveBranch(studentData?.branchKey, studentData?.branch),
    [studentData?.branchKey, studentData?.branch],
  );

  const [manualBranch, setManualBranch] = useState<BranchKey | null>(null);
  const [query, setQuery] = useState('');
  const [isSwitching, setIsSwitching] = useState(false);

  const branch = manualBranch ?? detectedBranch;
  const meta = BRANCH_META[branch];

  const courses = useMemo(
    () => ROADMAPS.filter((roadmap) => branchOf(roadmap) === branch),
    [branch],
  );

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;

  const results = useMemo(() => {
    if (!isSearching) return courses;
    return searchRoadmaps(query).filter((roadmap) => branchOf(roadmap) === branch);
  }, [query, branch, courses, isSearching]);

  const sections = useMemo<CourseSection[]>(() => {
    if (isSearching) {
      return results.length
        ? [{ title: '', icon: '', color: '', data: results }]
        : [];
    }

    if (branch === 'CSE') {
      return [{ title: 'Courses', icon: 'map-outline', color: theme.primary, data: courses }];
    }

    const map = new Map<string, CourseSection>();
    for (const roadmap of courses) {
      const title = roadmap.aliases[1] ?? 'Courses';
      const existing = map.get(title);
      if (existing) {
        existing.data.push(roadmap);
      } else {
        map.set(title, {
          title,
          icon: roadmap.icon,
          color: roadmap.color,
          data: [roadmap],
        });
      }
    }
    return Array.from(map.values());
  }, [branch, courses, isSearching, results, theme.primary]);

  // Hide the overlay once the new branch has rendered.
  useEffect(() => {
    if (!isSwitching) return;
    const timer = setTimeout(() => setIsSwitching(false), 180);
    return () => clearTimeout(timer);
  }, [branch, isSwitching]);

  const selectBranch = (next: BranchKey) => {
    if (next === branch) return;
    setIsSwitching(true);
    setManualBranch(next);
    setQuery('');
  };

  const openRoadmap = useCallback(
    (roadmapId: string) => navigation.navigate('RoadmapDetail', { roadmapId }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Roadmap }) => (
      <RoadmapCard roadmap={item} theme={theme} onOpen={openRoadmap} />
    ),
    [theme, openRoadmap],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: CourseSection }) => {
      if (!section.title) return null;
      return (
        <View style={styles.groupHeader}>
          <View style={[styles.groupIcon, { backgroundColor: section.color + '22' }]}>
            <Ionicons name={section.icon as any} size={18} color={section.color} />
          </View>
          <Text style={[styles.groupTitle, { color: theme.text }]}>{section.title}</Text>
          <Text style={[styles.groupCount, { color: theme.textSecondary }]}>
            {section.data.length}
          </Text>
        </View>
      );
    },
    [theme],
  );

  const header = (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.branchRow}
      >
        {BRANCH_ORDER.map((key) => {
          const info = BRANCH_META[key];
          const selected = key === branch;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => selectBranch(key)}
              activeOpacity={0.8}
              style={[
                styles.branchChip,
                {
                  backgroundColor: selected ? info.color : theme.card,
                  borderColor: selected ? info.color : theme.border,
                },
              ]}
            >
              <Ionicons
                name={info.icon as any}
                size={14}
                color={selected ? '#FFFFFF' : info.color}
              />
              <Text
                style={[
                  styles.branchChipText,
                  { color: selected ? '#FFFFFF' : theme.text },
                ]}
              >
                {info.short}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {!isSearching && (
        <>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Popular courses</Text>
          <View style={styles.chipWrap}>
            {BRANCH_POPULAR[branch].map((skill) => (
              <TouchableOpacity
                key={skill}
                style={[
                  styles.skillChip,
                  { backgroundColor: theme.card, borderColor: meta.color + '45' },
                ]}
                onPress={() => setQuery(skill)}
                activeOpacity={0.8}
              >
                <Ionicons name="sparkles-outline" size={14} color={meta.color} />
                <Text style={[styles.skillChipText, { color: meta.color }]}>{skill}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {isSearching && (
        <Text style={[styles.resultText, { color: theme.textSecondary }]}>
          {results.length} {results.length === 1 ? 'course' : 'courses'} found for{' '}
          <Text style={{ color: theme.text, fontWeight: '700' }}>“{trimmedQuery}”</Text>
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.iconBg }]}
          onPress={() => goHome(navigation)}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Skill Roadmap</Text>
          <Text
            style={[styles.headerSubtitle, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {meta.label}
          </Text>
        </View>
        <View style={[styles.headerIcon, { backgroundColor: meta.color + '20' }]}>
          <Ionicons name={meta.icon as any} size={24} color={meta.color} />
        </View>
      </View>

      <View
        style={[styles.searchWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}
      >
        <Ionicons
          name="search"
          size={20}
          color={theme.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder={`Search ${meta.short} courses`}
          placeholderTextColor={theme.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <SectionList<Roadmap, CourseSection>
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No course matched in {meta.short}
            </Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Try a broader term, or switch branch above to browse its courses.
            </Text>
            {BRANCH_POPULAR[branch].slice(0, 3).map((skill) => (
              <TouchableOpacity
                key={skill}
                style={[styles.emptyAction, { borderColor: meta.color + '55' }]}
                onPress={() => setQuery(skill)}
                activeOpacity={0.8}
              >
                <Text style={[styles.emptyActionText, { color: meta.color }]}>{skill}</Text>
              </TouchableOpacity>
            ))}
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        stickySectionHeadersEnabled={false}
        initialNumToRender={5}
        maxToRenderPerBatch={6}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews
      />

      {isSwitching && (
        <View
          style={[styles.loadingOverlay, { backgroundColor: theme.background + 'E6' }]}
        >
          <ActivityIndicator size="small" color={meta.color} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading {meta.short} courses…
          </Text>
        </View>
      )}
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
    paddingBottom: 18,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, marginTop: 3, fontWeight: '500' },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15 },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    flexGrow: 1,
  },
  branchRow: { gap: 8, paddingBottom: 18, paddingRight: 4 },
  branchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  branchChipText: { fontSize: 13, fontWeight: '700' },

  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  skillChipText: { fontSize: 13, fontWeight: '600' },

  resultText: { fontSize: 13, marginBottom: 14, lineHeight: 18 },

  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
    marginBottom: 12,
  },
  groupIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupTitle: { flex: 1, fontSize: 17, fontWeight: '700' },
  groupCount: { fontSize: 12.5, fontWeight: '600' },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardBody: { flex: 1, paddingRight: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardDesc: { fontSize: 12.5, lineHeight: 17, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  levelText: { fontSize: 10.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11.5, fontWeight: '500' },

  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginTop: 16 },
  emptyText: { fontSize: 13.5, textAlign: 'center', marginTop: 6, marginBottom: 18, lineHeight: 19 },
  emptyAction: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    minWidth: 180,
    alignItems: 'center',
  },
  emptyActionText: { fontSize: 13, fontWeight: '600' },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: { fontSize: 13, fontWeight: '600' },
});
