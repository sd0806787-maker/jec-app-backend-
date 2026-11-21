import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useStudent } from '../context/StudentContext';
import CircularProgress from '../components/CircularProgress';

const vibrantColors = [
  { color: '#F87171', bg: 'rgba(248, 113, 113, 0.15)' },
  { color: '#FB923C', bg: 'rgba(251, 146, 60, 0.15)' },
  { color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.15)' },
  { color: '#34D399', bg: 'rgba(52, 211, 153, 0.15)' },
  { color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.15)' },
  { color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)' },
  { color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.15)' },
  { color: '#F472B6', bg: 'rgba(244, 114, 182, 0.15)' },
];

const getSubjectIcon = (name: string) => {
  const n = name?.toLowerCase() || '';

  if (n.includes('data structure') || n.includes('algorithm'))
    return {
      icon: 'git-network-outline',
      color: '#60A5FA',
      bg: 'rgba(96, 165, 250, 0.15)',
    };

  if (
    n.includes('object oriented') ||
    n.includes('programming') ||
    n.includes('oop') ||
    n.includes('java') ||
    n.includes('c++')
  )
    return {
      icon: 'code-slash-outline',
      color: '#F472B6',
      bg: 'rgba(244, 114, 182, 0.15)',
    };

  if (
    n.includes('digital') ||
    n.includes('system') ||
    n.includes('microprocessor')
  )
    return {
      icon: 'hardware-chip-outline',
      color: '#34D399',
      bg: 'rgba(52, 211, 153, 0.15)',
    };

  if (n.includes('python'))
    return {
      icon: 'logo-python',
      color: '#A78BFA',
      bg: 'rgba(167, 139, 250, 0.15)',
    };

  if (n.includes('network'))
    return {
      icon: 'globe-outline',
      color: '#F87171',
      bg: 'rgba(248, 113, 113, 0.15)',
    };

  if (n.includes('database') || n.includes('dbms'))
    return {
      icon: 'server-outline',
      color: '#FBBF24',
      bg: 'rgba(251, 191, 36, 0.15)',
    };

  if (n.includes('math'))
    return {
      icon: 'calculator-outline',
      color: '#FBBF24',
      bg: 'rgba(251, 191, 36, 0.15)',
    };

  if (n.includes('physics'))
    return {
      icon: 'magnet-outline',
      color: '#38BDF8',
      bg: 'rgba(56, 189, 248, 0.15)',
    };

  if (n.includes('chemistry'))
    return {
      icon: 'flask-outline',
      color: '#A3E635',
      bg: 'rgba(163, 230, 53, 0.15)',
    };

  if (n.includes('thermodynamics') || n.includes('heat'))
    return {
      icon: 'thermometer-outline',
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.15)',
    };

  if (
    n.includes('machine') ||
    n.includes('mechanic') ||
    n.includes('kinematics')
  )
    return {
      icon: 'cog-outline',
      color: '#9CA3AF',
      bg: 'rgba(156, 163, 175, 0.15)',
    };

  if (
    n.includes('structure') ||
    n.includes('concrete') ||
    n.includes('surveying')
  )
    return {
      icon: 'business-outline',
      color: '#F97316',
      bg: 'rgba(249, 115, 22, 0.15)',
    };

  if (
    n.includes('fluid') ||
    n.includes('water') ||
    n.includes('hydraulic')
  )
    return {
      icon: 'water-outline',
      color: '#06B6D4',
      bg: 'rgba(6, 182, 212, 0.15)',
    };

  if (
    n.includes('circuit') ||
    n.includes('electric') ||
    n.includes('power')
  )
    return {
      icon: 'flash-outline',
      color: '#EAB308',
      bg: 'rgba(234, 179, 8, 0.15)',
    };

  if (n.includes('signal') || n.includes('communication'))
    return {
      icon: 'radio-outline',
      color: '#D946EF',
      bg: 'rgba(217, 70, 239, 0.15)',
    };

  if (n.includes('management') || n.includes('economic'))
    return {
      icon: 'briefcase-outline',
      color: '#8B5CF6',
      bg: 'rgba(139, 92, 246, 0.15)',
    };

  if (n.includes('english') || n.includes('language'))
    return {
      icon: 'chatbubbles-outline',
      color: '#14B8A6',
      bg: 'rgba(20, 184, 166, 0.15)',
    };

  const colorIndex = (name?.length || 0) % vibrantColors.length;
  const selectedColor = vibrantColors[colorIndex];

  return {
    icon: 'book-outline',
    color: selectedColor.color,
    bg: selectedColor.bg,
  };
};

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';

  return 'Good Evening';
};

export default function HomeScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { studentData } = useStudent();

  if (!studentData) return null;

  const subjects = studentData.subjects || [];

  const lowAttendanceSubjects = subjects.filter(
    (s: any) => s.percentage < 75
  );

  const allActions = [
    {
      id: '1',
      icon: 'calendar-outline',
      label: 'Attendance',
      route: 'Attendance',
    },
    {
      id: '2',
      icon: 'document-text-outline',
      label: 'CIE',
      route: 'CIEMarks',
    },
    {
      id: '3',
      icon: 'bar-chart-outline',
      label: 'CIE Graph',
      route: 'CIEAnalytics',
    },
    {
      id: '4',
      icon: 'time-outline',
      label: 'Timetable',
      route: 'Timetable',
    },
    {
      id: '5',
      icon: 'checkbox-outline',
      label: 'Planner',
      route: 'StudyPlanner',
    },
    {
      id: '6',
      icon: 'trophy-outline',
      label: 'Toppers',
      route: 'Toppers',
    },
    {
      id: '7',
      icon: 'briefcase-outline',
      label: 'Company',
      route: 'CompanyCriteria',
    },
    {
      id: '8',
      icon: 'notifications-outline',
      label: 'Notice',
      route: 'Announcements',
    },
    {
      id: '9',
      icon: 'library-outline',
      label: 'Syllabus',
      route: 'Syllabus',
    },
    {
      id: '10',
      icon: 'alert-circle-outline',
      label: 'Issues',
      route: 'Issues',
    },
    {
      id: '11',
      icon: 'search-outline',
      label: 'Lost & Found',
      route: 'LostFound',
    },
    {
      id: '12',
      icon: 'document-attach-outline',
      label: 'Notes',
      route: 'Notes',
    },
    {
      id: '13',
      icon: 'medkit-outline',
      label: 'Medical',
      route: 'MedicalLeave',
    },
    {
      id: '14',
      icon: 'map-outline',
      label: 'Roadmap',
      route: 'Roadmap',
    },
  ];

  const ACTION_COLUMNS = 4;
  const actionRows = [];

  for (let i = 0; i < allActions.length; i += ACTION_COLUMNS) {
    actionRows.push(allActions.slice(i, i + ACTION_COLUMNS));
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.name, { color: theme.text }]}>
              {studentData.name}
            </Text>

            <Text
              style={[
                styles.greeting,
                { color: theme.textSecondary },
              ]}
            >
              {studentData.rollNo} · {studentData.semester}
            </Text>
          </View>

          <TouchableOpacity style={styles.refreshBtn}>
            <Ionicons
              name="refresh"
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* SOS Button */}
        <View style={styles.sosRow}>
          <TouchableOpacity
            style={styles.sosCard}
            onPress={() =>
              navigation.navigate('Academics', {
                screen: 'SOS',
                initial: false,
              })
            }
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#2A0B12', '#0D0406']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sosGradientHome}
            >
              <View style={styles.sosIconBg}>
                <Ionicons
                  name="alert-circle"
                  size={22}
                  color="#FF3366"
                />
              </View>

              <View style={styles.sosTextContent}>
                <Text style={styles.sosTitleHome}>
                  EMERGENCY SOS
                </Text>

                <Text style={styles.sosSubtitleHome}>
                  Tap for immediate help
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={16}
                color="rgba(255, 51, 102, 0.5)"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Shortcut Cards */}
        <View style={styles.shortcutRow}>
          <TouchableOpacity
            style={[
              styles.shortcutCard,
              { shadowColor: '#8B5CF6' },
            ]}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#2E1065', '#13081F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.shortcutGradient}
            >
              <View style={styles.shortcutIconBg}>
                <Ionicons
                  name="school"
                  size={22}
                  color="#A78BFA"
                />
              </View>

              <View style={styles.shortcutTextContent}>
                <Text style={styles.shortcutTitle}>
                  JEC Portal
                </Text>

                <Text style={styles.shortcutSubtitle}>
                  Home
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={16}
                color="rgba(255,255,255,0.3)"
              />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.shortcutCard,
              { shadowColor: '#8B5CF6' },
            ]}
            onPress={() =>
              navigation.navigate('Academics', {
                screen: 'HostelManagement',
                initial: false,
              })
            }
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#13081F', '#2E1065']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.shortcutGradient}
            >
              <View style={styles.shortcutIconBg}>
                <Ionicons
                  name="bed"
                  size={22}
                  color="#A78BFA"
                />
              </View>

              <View style={styles.shortcutTextContent}>
                <Text style={styles.shortcutTitle}>
                  JEC Hostel
                </Text>

                <Text style={styles.shortcutSubtitle}>
                  Management
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={16}
                color="rgba(255,255,255,0.3)"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Hero Attendance Card */}
        <View style={styles.heroShadowWrapper}>
          <LinearGradient
            colors={['#4C1D95', '#7E22CE', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroTopRow}>
              <View style={styles.greetingPill}>
                <Ionicons
                  name="sunny-outline"
                  size={14}
                  color="#FBBF24"
                />

                <Text style={styles.greetingPillText}>
                  {getGreeting()}
                </Text>
              </View>

              <Ionicons
                name="ellipsis-horizontal"
                size={20}
                color="rgba(255,255,255,0.5)"
              />
            </View>

            <View style={styles.attendanceRow}>
              <View style={styles.circleWrapper}>
                <CircularProgress
                  percentage={studentData.overallAttendance}
                />
              </View>

              <View style={styles.attendanceStats}>
                <View style={styles.statBlock}>
                  <View style={styles.iconSmallBg}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#4ADE80"
                    />
                  </View>

                  <View>
                    <Text style={styles.statLabel}>
                      Attended
                    </Text>

                    <Text style={styles.statValue}>
                      {studentData.attendedClasses}
                    </Text>
                  </View>
                </View>

                <View style={styles.statBlock}>
                  <View style={styles.iconSmallBg}>
                    <Ionicons
                      name="calendar"
                      size={16}
                      color="#F472B6"
                    />
                  </View>

                  <View>
                    <Text style={styles.statLabel}>
                      Conducted
                    </Text>

                    <Text style={styles.statValue}>
                      {studentData.conductedClasses}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.heroBottomRow}>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />

                <Text style={styles.statusText}>
                  {studentData.status}
                </Text>
              </View>

              <View style={styles.statusBadge}>
                <Ionicons
                  name="book"
                  size={14}
                  color="rgba(255,255,255,0.7)"
                />

                <Text style={styles.statusText}>
                  {studentData.subjectsCount} Subjects
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Needs Attention */}
        {lowAttendanceSubjects.length > 0 && (
          <>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.text },
              ]}
            >
              Needs attention
            </Text>

            <View
              style={[
                styles.needsAttentionCard,
                { backgroundColor: theme.card },
              ]}
            >
              {lowAttendanceSubjects.map(
                (subject: any, index: number) => {
                  const { icon, color, bg } =
                    getSubjectIcon(subject.name);

                  return (
                    <View
                      key={
                        subject.id ||
                        index.toString()
                      }
                      style={[
                        styles.attentionRow,
                        index !== 0 && {
                          borderTopWidth: 1,
                          borderTopColor:
                            theme.cardDarker,
                        },
                      ]}
                    >
                      <View style={styles.attentionLeft}>
                        <View
                          style={[
                            styles.smallIconCircle,
                            {
                              backgroundColor: bg,
                            },
                          ]}
                        >
                          <Ionicons
                            name={icon as any}
                            size={16}
                            color={color}
                          />
                        </View>

                        <Text
                          style={[
                            styles.attentionText,
                            { color: theme.text },
                          ]}
                          numberOfLines={1}
                        >
                          {subject.name}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.badge,
                          {
                            backgroundColor:
                              'rgba(239, 68, 68, 0.1)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            { color: theme.danger },
                          ]}
                        >
                          NC {subject.percentage}%
                        </Text>
                      </View>
                    </View>
                  );
                }
              )}
            </View>
          </>
        )}

        {/* Quick Actions */}
        <View
          style={[
            styles.quickActionsCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.actionGrid}>
            {actionRows.map((row, rowIndex) => (
              <View
                key={`action-row-${rowIndex}`}
                style={[
                  styles.actionRow,
                  row.length < ACTION_COLUMNS &&
                    styles.actionRowCentered,
                ]}
              >
                {row.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.actionSlot}
                    activeOpacity={0.6}
                    onPress={() => {
                      if (
                        action.route ===
                        'Announcements'
                      ) {
                        navigation.navigate(
                          'Announcements'
                        );
                      } else {
                        navigation.navigate(
                          'Academics',
                          {
                            screen:
                              action.route,
                            initial: false,
                          }
                        );
                      }
                    }}
                  >
                    <View
                      style={[
                        styles.actionIconBg,
                        {
                          backgroundColor:
                            theme.cardDarker,
                        },
                      ]}
                    >
                      <Ionicons
                        name={action.icon as any}
                        size={22}
                        color={theme.primary}
                      />
                    </View>

                    <Text
                      style={[
                        styles.actionLabel,
                        {
                          color:
                            theme.textSecondary,
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Subjects */}
        <View style={styles.subjectHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.text },
            ]}
          >
            Subjects
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Academics', {
                screen: 'Attendance',
                initial: false,
              })
            }
          >
            <Text
              style={{
                color: theme.primary,
                fontWeight: '600',
              }}
            >
              See all
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.subjectsCard,
            { backgroundColor: theme.card },
          ]}
        >
          {subjects.map(
            (subject: any, index: number) => {
              const { icon, color, bg } =
                getSubjectIcon(subject.name);

              return (
                <View
                  key={
                    subject.id ||
                    index.toString()
                  }
                  style={styles.subjectRow}
                >
                  <View style={styles.subjectTitleRow}>
                    <View
                      style={
                        styles.subjectNameContainer
                      }
                    >
                      <View
                        style={[
                          styles.subjectIconCircle,
                          {
                            backgroundColor:
                              bg,
                          },
                        ]}
                      >
                        <Ionicons
                          name={icon as any}
                          size={18}
                          color={color}
                        />
                      </View>

                      <Text
                        style={[
                          styles.subjectName,
                          {
                            color:
                              theme.text,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {subject.name}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.subjectPercentage,
                        {
                          color:
                            theme.text,
                        },
                      ]}
                    >
                      {subject.percentage || 0}%
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.progressBarBg,
                      {
                        backgroundColor:
                          theme.cardDarker,
                        marginLeft: 44,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${subject.percentage || 0}%`,
                          backgroundColor:
                            (subject.percentage ||
                              0) < 75
                              ? theme.warning
                              : theme.success,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            }
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  greeting: {
    fontSize: 13,
  },

  refreshBtn: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 50,
  },

  /* SOS */

  sosRow: {
    marginBottom: 16,
  },

  sosCard: {
    borderRadius: 20,
    shadowColor: '#FF3366',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },

  sosGradientHome: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 102, 0.25)',
  },

  sosIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  sosTextContent: {
    flex: 1,
  },

  sosTitleHome: {
    color: '#FF3366',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  sosSubtitleHome: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },

  /* Shortcut Cards */

  shortcutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },

  shortcutCard: {
    flex: 1,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },

  shortcutGradient: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 19,
  },

  shortcutIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  shortcutTextContent: {
    flex: 1,
  },

  shortcutTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },

  shortcutSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },

  /* Hero */

  heroShadowWrapper: {
    marginBottom: 32,
    shadowColor: '#1A0B33',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 1.0,
    shadowRadius: 24,
    elevation: 30,
    backgroundColor: 'transparent',
  },

  heroCard: {
    borderRadius: 28,
    padding: 20,
  },

  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  greetingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  greetingPillText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },

  attendanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  circleWrapper: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 70,
    padding: 5,
  },

  attendanceStats: {
    flex: 1,
    marginLeft: 20,
    gap: 12,
  },

  statBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  iconSmallBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '500',
  },

  statValue: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 2,
  },

  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },

  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },

  /* Section */

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  /* Needs Attention */

  needsAttentionCard: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },

  attentionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },

  attentionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },

  attentionText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  smallIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Quick Actions */

  quickActionsCard: {
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 8,
    marginBottom: 24,
    borderWidth: 1,
  },

  actionGrid: {
    rowGap: 22,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  actionRowCentered: {
    justifyContent: 'center',
  },

  actionSlot: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 3,
  },

  actionIconBg: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },

  actionLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
    minHeight: 28,
    paddingHorizontal: 1,
  },

  /* Subjects */

  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  subjectsCard: {
    borderRadius: 20,
    padding: 16,
  },

  subjectRow: {
    marginBottom: 18,
  },

  subjectTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  subjectNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },

  subjectIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  subjectName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },

  subjectPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});