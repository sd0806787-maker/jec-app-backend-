import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// 1. IMPORT THE CORRECT SAFE AREA
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';
import { useStudent } from '../context/StudentContext';

import { CONTENT_BASE_URL } from '../services/api';
import type { ThemeColors } from '../theme/colors';
import bundledSyllabus from '../../assets/syllabus.json';

const SYLLABUS_URL = `${CONTENT_BASE_URL}/syllabus.json`;

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type BranchCode = 'CSE' | 'ME' | 'EE' | 'CE' | 'IE';

interface Module {
  title: string;
  topics: string[];
}

interface CourseOutcome {
  code: string;
  description: string;
  level?: string;
}

interface Subject {
  subject: string;
  code: string;
  type?: string;
  hoursPerWeek?: string;
  credits?: number;
  prerequisites?: string | string[];
  courseObjectives?: string[];
  courseOutcomes?: CourseOutcome[];
  modules?: Module[];
  experiments?: string[];
  textbooks?: string[];
  onlineResources?: string[];
  programmingLanguage?: string;
  assessment?: string;
  remarks?: string[];
  note?: string;
}

interface SemesterInfo {
  branch?: string;
  branchCode?: string;
  semester?: number;
  university?: string;
  academicSession?: string;
  totalContactHoursPerWeek?: number;
  totalCredits?: number;
}

interface SyllabusPayload {
  semesterInfo?: Record<string, SemesterInfo>;
  [key: string]: unknown;
}

/* -------------------------------------------------------------------------- */
/*                                  Config                                    */
/* -------------------------------------------------------------------------- */

const BRANCH_ORDER: BranchCode[] = ['CSE', 'ME', 'EE', 'CE', 'IE'];

const BRANCH_META: Record<
  BranchCode,
  { label: string; short: string; icon: string; color: string }
> = {
  CSE: {
    label: 'Computer Science & Engineering',
    short: 'CSE',
    icon: 'code-slash',
    color: '#8B5CF6',
  },
  ME: { label: 'Mechanical Engineering', short: 'ME', icon: 'cog', color: '#F59E0B' },
  EE: { label: 'Electrical Engineering', short: 'EE', icon: 'flash', color: '#3B82F6' },
  CE: { label: 'Civil Engineering', short: 'CE', icon: 'business', color: '#22C55E' },
  IE: {
    label: 'Instrumentation Engineering',
    short: 'IE',
    icon: 'speedometer',
    color: '#EC4899',
  },
};

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const BRANCH_ALIASES: Record<string, BranchCode> = {
  CSE: 'CSE',
  CS: 'CSE',
  COMPUTER: 'CSE',
  ME: 'ME',
  MECH: 'ME',
  MECHANICAL: 'ME',
  EE: 'EE',
  EEE: 'EE',
  ETC: 'EE',
  ELECTRICAL: 'EE',
  CE: 'CE',
  CIVIL: 'CE',
  IE: 'IE',
  IN: 'IE',
  INSTRU: 'IE',
  INSTRUMENTATION: 'IE',
};

/** Maps the student's backend branch key/name to a syllabus JSON branch. */
const resolveBranch = (branchKey?: string | null, branchName?: string | null): BranchCode => {
  const key = (branchKey ?? '').toUpperCase().trim();
  if (BRANCH_ALIASES[key]) return BRANCH_ALIASES[key];

  const name = (branchName ?? '').toUpperCase();
  if (name.includes('COMPUTER')) return 'CSE';
  if (name.includes('MECHANICAL')) return 'ME';
  if (name.includes('INSTRUMENT')) return 'IE';
  if (name.includes('CIVIL')) return 'CE';
  if (name.includes('ELECTRON')) return 'EE';
  if (name.includes('ELECTRICAL')) return 'EE';
  return 'CSE';
};

const resolveSemester = (semester?: string | null): number => {
  const match = (semester ?? '').match(/\d+/);
  const parsed = match ? Number(match[0]) : 1;
  return parsed >= 1 && parsed <= 8 ? parsed : 1;
};

const parseSyllabusKey = (key: string): { branch: BranchCode; semester: number } | null => {
  const match = /^([A-Z]+)_(\d+)$/.exec(key);
  if (!match) return null;
  const branch = match[1] as BranchCode;
  if (!BRANCH_ORDER.includes(branch)) return null;
  return { branch, semester: Number(match[2]) };
};

const typeColor = (type: string | undefined, theme: ThemeColors): string => {
  switch (type) {
    case 'Practical':
      return theme.success;
    case 'Theory + Practical':
      return theme.secondary;
    case 'Mandatory Audit Course':
      return theme.warning;
    case 'Theory':
      return theme.primary;
    default:
      return theme.textSecondary;
  }
};

/* -------------------------------------------------------------------------- */
/*                              Module-level cache                            */
/* -------------------------------------------------------------------------- */

const CACHE_TTL_MS = 10 * 60 * 1000;

/** Bundled copy keeps the feature usable if the remote bucket is down/stale. */
const BUNDLED_SYLLABUS = bundledSyllabus as unknown as SyllabusPayload;

let cachedSyllabus: SyllabusPayload | null = null;
let cachedAt = 0;

/** Counts usable flat branch/semester keys in a syllabus payload. */
function syllabusKeyCount(data: unknown): number {
  if (!data || typeof data !== 'object') return 0;
  return Object.entries(data as Record<string, unknown>).filter(
    ([key, value]) => parseSyllabusKey(key) !== null && Array.isArray(value),
  ).length;
}

async function loadSyllabus(force = false): Promise<SyllabusPayload> {
  if (!force && cachedSyllabus && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedSyllabus;
  }

  let data: SyllabusPayload | null = null;
  let remoteCount = 0;

  try {
    const response = await fetch(`${SYLLABUS_URL}?t=${Date.now()}`);
    if (response.ok) {
      const remote = (await response.json()) as unknown;
      remoteCount = syllabusKeyCount(remote);
      if (remoteCount > 0) data = remote as SyllabusPayload;
    }
  } catch {
    // Fall through to the bundled copy when offline.
  }

  // The bucket may still be serving older/partial data; prefer whichever copy
  // contains more branch/semester entries.
  if (!data || remoteCount < syllabusKeyCount(BUNDLED_SYLLABUS)) {
    data = BUNDLED_SYLLABUS;
  }

  cachedSyllabus = data;
  cachedAt = Date.now();
  return data;
}

/* -------------------------------------------------------------------------- */
/*                              Small components                              */
/* -------------------------------------------------------------------------- */

function Section({
  icon,
  title,
  color,
  theme,
  children,
}: {
  icon: string;
  title: string;
  color: string;
  theme: ThemeColors;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={15} color={color} />
        <Text style={[styles.sectionTitle, { color }]}>{title.toUpperCase()}</Text>
      </View>
      {children}
    </View>
  );
}

function Bullet({
  text,
  theme,
  color,
  icon = 'checkmark-circle',
}: {
  text: string;
  theme: ThemeColors;
  color: string;
  icon?: string;
}) {
  return (
    <View style={styles.topicRow}>
      <Ionicons
        name={icon as any}
        size={15}
        color={color}
        style={{ marginRight: 8, marginTop: 3 }}
      />
      <Text style={[styles.topicText, { color: theme.text }]}>{text}</Text>
    </View>
  );
}

function MetaChip({
  icon,
  label,
  color,
  theme,
}: {
  icon: string;
  label: string;
  color: string;
  theme: ThemeColors;
}) {
  return (
    <View style={[styles.metaChip, { backgroundColor: color + '1F' }]}>
      <Ionicons name={icon as any} size={12} color={color} />
      <Text style={[styles.metaChipText, { color }]}>{label}</Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Screen                                   */
/* -------------------------------------------------------------------------- */

export default function SyllabusScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { studentData } = useStudent();

  const [data, setData] = useState<SyllabusPayload | null>(cachedSyllabus);
  const [isLoading, setIsLoading] = useState(!cachedSyllabus);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual picks override the student's profile default; when the profile
  // loads/changes the derived selection follows it automatically.
  const [manualSelection, setManualSelection] = useState<{
    branch?: BranchCode;
    semester?: number;
  }>({});
  const [query, setQuery] = useState('');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const branch =
    manualSelection.branch ?? resolveBranch(studentData?.branchKey, studentData?.branch);
  const semester = manualSelection.semester ?? resolveSemester(studentData?.semester);

  const fetchSyllabus = useCallback(async (force = false) => {
    try {
      const payload = await loadSyllabus(force);
      setData(payload);
      setError(null);
    } catch {
      setError('Could not load the syllabus. Check your connection and try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    loadSyllabus()
      .then((payload) => {
        if (!active) return;
        setData(payload);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError('Could not load the syllabus. Check your connection and try again.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchSyllabus(true);
  }, [fetchSyllabus]);

  /** Semesters that actually exist in the JSON, per branch. */
  const availableSemesters = useMemo(() => {
    const map: Record<BranchCode, Set<number>> = {
      CSE: new Set(),
      ME: new Set(),
      EE: new Set(),
      CE: new Set(),
      IE: new Set(),
    };
    if (!data) return map;
    Object.keys(data).forEach((key) => {
      const parsed = parseSyllabusKey(key);
      if (parsed && Array.isArray(data[key])) map[parsed.branch].add(parsed.semester);
    });
    return map;
  }, [data]);

  const semesterKey = `${branch}_${semester}`;

  const subjects = useMemo<Subject[]>(() => {
    const raw = data?.[semesterKey];
    return Array.isArray(raw) ? (raw as Subject[]) : [];
  }, [data, semesterKey]);

  const semesterInfo = data?.semesterInfo?.[semesterKey];

  const filteredSubjects = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return subjects;
    return subjects.filter(
      (subject) =>
        subject.subject.toLowerCase().includes(needle) ||
        subject.code.toLowerCase().includes(needle),
    );
  }, [subjects, query]);

  const isAvailable = availableSemesters[branch].has(semester);

  const selectBranch = (next: BranchCode) => {
    if (next === branch) return;
    setManualSelection((current) => ({ ...current, branch: next }));
    setExpandedSubject(null);
    setQuery('');
  };

  const selectSemester = (next: number) => {
    if (next === semester) return;
    setManualSelection((current) => ({ ...current, semester: next }));
    setExpandedSubject(null);
    setQuery('');
  };

  const toggleSubject = (code: string) => {
    setExpandedSubject((current) => (current === code ? null : code));
  };

  const meta = BRANCH_META[branch];

  return (
    // 2. ADD THE TOP EDGE PROP HERE
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goHome(navigation)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color={theme.text} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Syllabus</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {meta.short} · Semester {semester} Curriculum
          </Text>
        </View>

        {/* HOME BUTTON TO RETURN INSTANTLY */}
        <TouchableOpacity
          style={[styles.homeBtn, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('MainApp', { screen: 'Home' })}
        >
          <Ionicons name="home" size={22} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ color: theme.textSecondary, marginTop: 14 }}>Loading syllabus…</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
        >
          {/* ---------------- Branch selector ---------------- */}
          <View style={[styles.selectorCard, { backgroundColor: theme.card }]}>
            <View style={styles.selectorHeader}>
              <Ionicons name="school-outline" size={18} color={theme.primary} />
              <Text style={[styles.selectorTitle, { color: theme.text }]}>
                Choose your branch
              </Text>
            </View>

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
                        backgroundColor: selected ? info.color : theme.cardDarker,
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
            <Text style={[styles.branchLabel, { color: theme.textSecondary }]}>
              {meta.label}
            </Text>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* ---------------- Semester selector ---------------- */}
            <View style={styles.selectorHeader}>
              <Ionicons name="calendar-outline" size={18} color={theme.primary} />
              <Text style={[styles.selectorTitle, { color: theme.text }]}>
                Choose your semester
              </Text>
            </View>

            <View style={styles.semesterGrid}>
              {SEMESTERS.map((value) => {
                const selected = value === semester;
                const available = availableSemesters[branch].has(value);
                return (
                  <TouchableOpacity
                    key={value}
                    onPress={() => selectSemester(value)}
                    activeOpacity={0.8}
                    style={[
                      styles.semChip,
                      {
                        backgroundColor: selected ? theme.primary : theme.cardDarker,
                        borderColor: selected ? theme.primary : theme.border,
                        opacity: available ? 1 : 0.45,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.semChipText,
                        { color: selected ? '#FFFFFF' : theme.text },
                      ]}
                    >
                      Sem {value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={[styles.branchLabel, { color: theme.textSecondary }]}>
              Dimmed semesters have no syllabus uploaded yet.
            </Text>
          </View>

          {/* ---------------- Semester summary ---------------- */}
          {(semesterInfo || (isAvailable && subjects.length > 0)) && (
            <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
              <View style={[styles.infoIconBox, { backgroundColor: meta.color + '22' }]}>
                <Ionicons name={meta.icon as any} size={22} color={meta.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoTitle, { color: theme.text }]}>
                  {semesterInfo?.branch ?? meta.label} · Semester {semester}
                </Text>
                {semesterInfo?.university ? (
                  <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                    {semesterInfo.university}
                    {semesterInfo.academicSession
                      ? ` · ${semesterInfo.academicSession}`
                      : ''}
                  </Text>
                ) : (
                  <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                    {subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'} available
                  </Text>
                )}
                <View style={styles.metaRow}>
                  {typeof semesterInfo?.totalCredits === 'number' && (
                    <MetaChip
                      icon="ribbon-outline"
                      label={`${semesterInfo.totalCredits} credits`}
                      color={meta.color}
                      theme={theme}
                    />
                  )}
                  {typeof semesterInfo?.totalContactHoursPerWeek === 'number' && (
                    <MetaChip
                      icon="time-outline"
                      label={`${semesterInfo.totalContactHoursPerWeek} hrs / week`}
                      color={theme.primary}
                      theme={theme}
                    />
                  )}
                  {!semesterInfo && subjects.length > 0 && (
                    <MetaChip
                      icon="documents-outline"
                      label={`${subjects.length} subjects`}
                      color={theme.primary}
                      theme={theme}
                    />
                  )}
                </View>
              </View>
            </View>
          )}

          {/* ---------------- Subject search ---------------- */}
          {isAvailable && subjects.length > 0 && (
            <View
              style={[
                styles.searchWrapper,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Ionicons
                name="search"
                size={20}
                color={theme.textSecondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Search subject or code"
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
          )}

          {/* ---------------- Stale-data warning ---------------- */}
          {error && data && (
            <View
              style={[
                styles.callout,
                {
                  backgroundColor: theme.danger + '14',
                  borderLeftColor: theme.danger,
                },
              ]}
            >
              <Ionicons name="cloud-offline-outline" size={18} color={theme.danger} />
              <Text style={[styles.calloutText, { color: theme.text }]}>
                Showing the last saved syllabus. {error}
              </Text>
            </View>
          )}

          {/* ---------------- Error state ---------------- */}
          {error && !data ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cloud-offline-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                Syllabus unavailable
              </Text>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{error}</Text>
              <TouchableOpacity
                style={[styles.retryBtn, { backgroundColor: theme.primary }]}
                onPress={() => {
                  setIsLoading(true);
                  fetchSyllabus(true);
                }}
              >
                <Ionicons name="refresh" size={16} color="#FFFFFF" />
                <Text style={styles.retryText}>Try again</Text>
              </TouchableOpacity>
            </View>
          ) : !isAvailable ? (
            /* ---------------- Not uploaded state ---------------- */
            <View style={styles.emptyContainer}>
              <Ionicons name="cloud-upload-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                Not uploaded yet
              </Text>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                The {meta.label} semester {semester} syllabus has not been published. Try another
                semester or pull down to refresh.
              </Text>
            </View>
          ) : filteredSubjects.length === 0 ? (
            /* ---------------- Empty search state ---------------- */
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No subjects found</Text>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No subject matches “{query.trim()}”. Try a different name or code.
              </Text>
            </View>
          ) : (
            /* ---------------- Subject cards ---------------- */
            filteredSubjects.map((subject) => {
              const isExpanded = expandedSubject === subject.code;
              const color = typeColor(subject.type, theme);
              const prerequisites = Array.isArray(subject.prerequisites)
                ? subject.prerequisites
                : subject.prerequisites
                  ? [subject.prerequisites]
                  : [];
              const hasDetails =
                prerequisites.length > 0 ||
                !!subject.programmingLanguage ||
                (subject.courseObjectives?.length ?? 0) > 0 ||
                (subject.modules?.length ?? 0) > 0 ||
                (subject.experiments?.length ?? 0) > 0 ||
                (subject.courseOutcomes?.length ?? 0) > 0 ||
                (subject.textbooks?.length ?? 0) > 0 ||
                (subject.onlineResources?.length ?? 0) > 0 ||
                !!subject.assessment ||
                !!subject.note ||
                (subject.remarks?.length ?? 0) > 0;

              return (
                <View
                  key={subject.code}
                  style={[
                    styles.card,
                    {
                      backgroundColor: theme.card,
                      borderWidth: isExpanded ? 1 : 0,
                      borderColor: isExpanded ? theme.primary : 'transparent',
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.subjectHeader}
                    onPress={() => toggleSubject(subject.code)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconBox, { backgroundColor: color + '22' }]}>
                      <Ionicons
                        name={subject.type === 'Practical' ? 'flask' : 'book'}
                        size={22}
                        color={color}
                      />
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={[styles.subjectName, { color: theme.text }]} numberOfLines={2}>
                        {subject.subject}
                      </Text>
                      <View style={styles.codeRow}>
                        <Ionicons
                          name="barcode-outline"
                          size={14}
                          color={theme.textSecondary}
                        />
                        <Text style={[styles.subjectCode, { color: theme.textSecondary }]}>
                          {subject.code}
                        </Text>
                      </View>

                      <View style={styles.metaRow}>
                        {!!subject.type && (
                          <MetaChip
                            icon="pricetag-outline"
                            label={subject.type}
                            color={color}
                            theme={theme}
                          />
                        )}
                        {typeof subject.credits === 'number' && (
                          <MetaChip
                            icon="ribbon-outline"
                            label={`${subject.credits} cr`}
                            color={theme.secondary}
                            theme={theme}
                          />
                        )}
                        {!!subject.hoursPerWeek && (
                          <MetaChip
                            icon="time-outline"
                            label={subject.hoursPerWeek}
                            color={theme.textSecondary}
                            theme={theme}
                          />
                        )}
                      </View>
                    </View>

                    <View style={[styles.chevronBox, { backgroundColor: theme.cardDarker }]}>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color={isExpanded ? theme.primary : theme.textSecondary}
                      />
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.moduleContainer}>
                      {!hasDetails && (
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                          Detailed syllabus for this subject has not been uploaded yet.
                        </Text>
                      )}

                      {prerequisites.length > 0 && (
                        <Section
                          icon="link-outline"
                          title="Prerequisites"
                          color={theme.warning}
                          theme={theme}
                        >
                          {prerequisites.map((item, index) => (
                            <Bullet
                              key={`pre-${index}`}
                              text={item}
                              theme={theme}
                              color={theme.warning}
                              icon="arrow-forward-circle"
                            />
                          ))}
                        </Section>
                      )}

                      {!!subject.programmingLanguage && (
                        <Section
                          icon="terminal-outline"
                          title="Programming language"
                          color={theme.secondary}
                          theme={theme}
                        >
                          <Bullet
                            text={subject.programmingLanguage}
                            theme={theme}
                            color={theme.secondary}
                            icon="code-slash"
                          />
                        </Section>
                      )}

                      {(subject.courseObjectives?.length ?? 0) > 0 && (
                        <Section
                          icon="flag-outline"
                          title="Course objectives"
                          color={theme.primary}
                          theme={theme}
                        >
                          {subject.courseObjectives!.map((objective, index) => (
                            <Bullet
                              key={`obj-${index}`}
                              text={objective}
                              theme={theme}
                              color={theme.primary}
                              icon="chevron-forward-circle"
                            />
                          ))}
                        </Section>
                      )}

                      {(subject.modules?.length ?? 0) > 0 && (
                        <Section
                          icon="layers-outline"
                          title="Modules"
                          color={theme.primary}
                          theme={theme}
                        >
                          {subject.modules!.map((module, mIndex) => (
                            <View key={`mod-${mIndex}`} style={styles.moduleBlock}>
                              <View
                                style={[
                                  styles.moduleTitlePill,
                                  { backgroundColor: theme.cardDarker },
                                ]}
                              >
                                <View
                                  style={[styles.moduleDot, { backgroundColor: theme.primary }]}
                                />
                                <Text
                                  style={[styles.moduleTitle, { color: theme.primary }]}
                                >
                                  {module.title}
                                </Text>
                              </View>

                              {module.topics.map((topic, tIndex) => (
                                <Bullet
                                  key={`topic-${mIndex}-${tIndex}`}
                                  text={topic}
                                  theme={theme}
                                  color={theme.success}
                                />
                              ))}
                            </View>
                          ))}
                        </Section>
                      )}

                      {(subject.experiments?.length ?? 0) > 0 && (
                        <Section
                          icon="flask-outline"
                          title="Experiments"
                          color={theme.success}
                          theme={theme}
                        >
                          {subject.experiments!.map((experiment, index) => (
                            <View key={`exp-${index}`} style={styles.topicRow}>
                              <View
                                style={[
                                  styles.numberBadge,
                                  { backgroundColor: theme.cardDarker },
                                ]}
                              >
                                <Text
                                  style={[styles.numberBadgeText, { color: theme.success }]}
                                >
                                  {index + 1}
                                </Text>
                              </View>
                              <Text style={[styles.topicText, { color: theme.text }]}>
                                {experiment}
                              </Text>
                            </View>
                          ))}
                        </Section>
                      )}

                      {(subject.courseOutcomes?.length ?? 0) > 0 && (
                        <Section
                          icon="trophy-outline"
                          title="Course outcomes"
                          color={theme.secondary}
                          theme={theme}
                        >
                          {subject.courseOutcomes!.map((outcome, index) => (
                            <View key={`co-${index}`} style={styles.outcomeRow}>
                              <View
                                style={[
                                  styles.coBadge,
                                  { backgroundColor: theme.secondary + '22' },
                                ]}
                              >
                                <Text
                                  style={[styles.coBadgeText, { color: theme.secondary }]}
                                >
                                  {outcome.code}
                                </Text>
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text style={[styles.topicText, { color: theme.text }]}>
                                  {outcome.description}
                                </Text>
                                {!!outcome.level && (
                                  <Text
                                    style={[
                                      styles.outcomeLevel,
                                      { color: theme.textSecondary },
                                    ]}
                                  >
                                    {outcome.level}
                                  </Text>
                                )}
                              </View>
                            </View>
                          ))}
                        </Section>
                      )}

                      {(subject.textbooks?.length ?? 0) > 0 && (
                        <Section
                          icon="library-outline"
                          title="Textbooks & references"
                          color={theme.warning}
                          theme={theme}
                        >
                          {subject.textbooks!.map((book, index) => (
                            <View key={`book-${index}`} style={styles.topicRow}>
                              <Ionicons
                                name="book-outline"
                                size={15}
                                color={theme.warning}
                                style={{ marginRight: 8, marginTop: 3 }}
                              />
                              <Text style={[styles.topicText, { color: theme.text }]}>
                                {book}
                              </Text>
                            </View>
                          ))}
                        </Section>
                      )}

                      {(subject.onlineResources?.length ?? 0) > 0 && (
                        <Section
                          icon="globe-outline"
                          title="Online resources"
                          color={theme.accent}
                          theme={theme}
                        >
                          {subject.onlineResources!.map((resource, index) => (
                            <Bullet
                              key={`online-${index}`}
                              text={resource}
                              theme={theme}
                              color={theme.accent}
                              icon="link"
                            />
                          ))}
                        </Section>
                      )}

                      {!!subject.assessment && (
                        <Section
                          icon="clipboard-outline"
                          title="Assessment"
                          color={theme.primary}
                          theme={theme}
                        >
                          <View
                            style={[
                              styles.noteBox,
                              { backgroundColor: theme.cardDarker },
                            ]}
                          >
                            <Text style={[styles.noteText, { color: theme.text }]}>
                              {subject.assessment}
                            </Text>
                          </View>
                        </Section>
                      )}

                      {!!subject.note && (
                        <View
                          style={[
                            styles.callout,
                            {
                              backgroundColor: theme.primary + '14',
                              borderLeftColor: theme.primary,
                            },
                          ]}
                        >
                          <Ionicons
                            name="information-circle-outline"
                            size={18}
                            color={theme.primary}
                          />
                          <Text style={[styles.calloutText, { color: theme.text }]}>
                            {subject.note}
                          </Text>
                        </View>
                      )}

                      {(subject.remarks?.length ?? 0) > 0 && (
                        <Section
                          icon="alert-circle-outline"
                          title="Remarks"
                          color={theme.warning}
                          theme={theme}
                        >
                          {subject.remarks!.map((remark, index) => (
                            <Bullet
                              key={`remark-${index}`}
                              text={remark}
                              theme={theme}
                              color={theme.warning}
                              icon="alert-circle"
                            />
                          ))}
                        </Section>
                      )}
                    </View>
                  )}
                </View>
              );
            })
          )}

          <Text style={[styles.footerNote, { color: theme.textSecondary }]}>
            Syllabus as published by Assam Science and Technology University. Pull down to
            refresh.
          </Text>

          {/* Increased paddingBottom to prevent bottom cropping */}
          <View style={{ height: 120 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // 3. ADDED paddingTop TO PUSH IT DOWN FURTHER IF NEEDED
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backBtn: { marginRight: 15, padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, marginTop: 4, fontWeight: '500' },

  homeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20 },

  /* ---------------------------- Selectors ---------------------------- */
  selectorCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectorHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  selectorTitle: { fontSize: 15, fontWeight: '700' },
  branchRow: { gap: 8, paddingRight: 4 },
  branchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
  },
  branchChipText: { fontSize: 13, fontWeight: '700' },
  branchLabel: { fontSize: 12, marginTop: 10, lineHeight: 18 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 16 },

  semesterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  semChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 66,
    alignItems: 'center',
  },
  semChipText: { fontSize: 13, fontWeight: '700' },

  /* ----------------------------- Info card ---------------------------- */
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 18,
    borderRadius: 20,
    marginBottom: 18,
    gap: 14,
  },
  infoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  infoText: { fontSize: 13, lineHeight: 20, fontWeight: '500' },

  /* ----------------------------- Search ------------------------------- */
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15 },

  /* ----------------------------- Cards -------------------------------- */
  card: {
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: { flex: 1, paddingRight: 10 },
  subjectName: { fontSize: 18, fontWeight: '700', marginBottom: 6, letterSpacing: -0.2 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  subjectCode: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaChipText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },

  chevronBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* --------------------------- Details -------------------------------- */
  moduleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 4,
  },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },

  moduleBlock: {
    marginBottom: 14,
  },
  moduleTitlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  moduleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  topicText: {
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
    fontWeight: '400',
  },

  numberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
    marginTop: 1,
  },
  numberBadgeText: { fontSize: 11, fontWeight: '800' },

  outcomeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  coBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
    marginRight: 9,
    marginTop: 1,
  },
  coBadgeText: { fontSize: 10, fontWeight: '800' },
  outcomeLevel: { fontSize: 12, marginTop: 4, fontStyle: 'italic' },

  noteBox: { borderRadius: 12, padding: 12 },
  noteText: { fontSize: 14, lineHeight: 22, fontWeight: '600' },

  callout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 12,
    borderLeftWidth: 3,
    padding: 12,
    marginBottom: 16,
  },
  calloutText: { flex: 1, fontSize: 13, lineHeight: 20 },

  /* ----------------------------- States ------------------------------- */
  emptyContainer: { alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginTop: 16, textAlign: 'center' },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 21,
    textAlign: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 18,
  },
  retryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  footerNote: {
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
});
