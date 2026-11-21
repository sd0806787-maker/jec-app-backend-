import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';
import { getRoadmapById, RoadmapLevel } from '../data/roadmaps';
import { getRoadmapDetail } from '../data/roadmapDetails';

const levelColor = (level: RoadmapLevel, theme: any) => {
  if (level === 'Beginner') return theme.success;
  if (level === 'Intermediate') return theme.warning;
  return theme.danger;
};

export default function RoadmapDetailScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const roadmap = getRoadmapById(route?.params?.roadmapId);

  // Stages start expanded, topics start collapsed — roadmap.sh-style drill-down.
  const [collapsedStages, setCollapsedStages] = useState<Set<number>>(() => new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(() => new Set());

  const detail = useMemo(() => (roadmap ? getRoadmapDetail(roadmap) : null), [roadmap]);

  if (!roadmap || !detail) {
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
        </View>
        <View style={styles.missing}>
          <Ionicons name="map-outline" size={52} color={theme.textSecondary} />
          <Text style={[styles.missingText, { color: theme.textSecondary }]}>
            This roadmap could not be found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const badgeColor = levelColor(roadmap.level, theme);
  const allCollapsed = collapsedStages.size === detail.stages.length;

  const openUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      // Ignore unopenable links.
    }
  };

  const toggleStage = (index: number) => {
    setCollapsedStages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleTopic = (key: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAllStages = () => {
    setCollapsedStages(
      allCollapsed ? new Set() : new Set(detail.stages.map((_, index) => index)),
    );
  };

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
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
          Roadmap
        </Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.iconBg }]}
          onPress={() => openUrl(detail.roadmapUrl ?? 'https://roadmap.sh')}
          activeOpacity={0.7}
        >
          <Ionicons name="open-outline" size={19} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View
          style={[
            styles.hero,
            { backgroundColor: roadmap.color + '14', borderColor: roadmap.color + '40' },
          ]}
        >
          <View style={[styles.heroIcon, { backgroundColor: roadmap.color + '24' }]}>
            <Ionicons name={roadmap.icon as any} size={34} color={roadmap.color} />
          </View>
          <Text style={[styles.heroTitle, { color: theme.text }]}>{roadmap.title}</Text>
          <Text style={[styles.heroDesc, { color: theme.textSecondary }]}>
            {roadmap.description}
          </Text>

          <View style={styles.heroMeta}>
            <View style={[styles.levelBadge, { backgroundColor: badgeColor + '22' }]}>
              <Text style={[styles.levelText, { color: badgeColor }]}>{roadmap.level}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {roadmap.duration}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="layers-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {detail.stages.length} stages
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="git-branch-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {detail.totalTopics} topics
              </Text>
            </View>
          </View>
        </View>

        {/* What you'll learn */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="sparkles-outline" size={17} color={roadmap.color} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>What you&apos;ll learn</Text>
          </View>
          <View style={styles.outcomeWrap}>
            {detail.outcomes.map((outcome) => (
              <View
                key={outcome}
                style={[styles.outcomeChip, { backgroundColor: roadmap.color + '12' }]}
              >
                <Text style={[styles.outcomeText, { color: theme.text }]}>{outcome}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.outcomeNote, { color: theme.textSecondary }]}>
            {detail.totalTopics} core topics expanded into {detail.totalSubtopics} sub-topics
            across {detail.stages.length} stages.
          </Text>
          {detail.roadmapUrl ? (
            <TouchableOpacity
              style={[styles.linkButton, { backgroundColor: theme.cardDarker }]}
              onPress={() => openUrl(detail.roadmapUrl as string)}
              activeOpacity={0.8}
            >
              <Ionicons name="open-outline" size={15} color={roadmap.color} />
              <Text style={[styles.linkText, { color: roadmap.color }]}>
                View the original on roadmap.sh
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Roadmap tree */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Step-by-step roadmap</Text>
          <TouchableOpacity onPress={toggleAllStages} activeOpacity={0.7}>
            <Text style={[styles.sectionAction, { color: roadmap.color }]}>
              {allCollapsed ? 'Expand all' : 'Collapse all'}
            </Text>
          </TouchableOpacity>
        </View>

        {detail.stages.map((stage, stageIndex) => {
          const isLastStage = stageIndex === detail.stages.length - 1;
          const stageCollapsed = collapsedStages.has(stageIndex);

          return (
            <View key={`${stage.title}-${stageIndex}`} style={styles.stageRow}>
              <View style={styles.timelineCol}>
                <View style={[styles.node, { backgroundColor: roadmap.color }]}>
                  <Text style={styles.nodeText}>{stageIndex + 1}</Text>
                </View>
                {!isLastStage && (
                  <View style={[styles.connector, { backgroundColor: theme.border }]} />
                )}
              </View>

              <View
                style={[
                  styles.stageCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <TouchableOpacity
                  style={styles.stageHeader}
                  onPress={() => toggleStage(stageIndex)}
                  activeOpacity={0.75}
                >
                  <View style={styles.stageHeaderText}>
                    <Text style={[styles.stageTitle, { color: theme.text }]}>
                      {stage.title}
                    </Text>
                    <Text style={[styles.stageMeta, { color: theme.textSecondary }]}>
                      {stage.topics.length} topics · {stage.hours}
                    </Text>
                  </View>
                  <Ionicons
                    name={stageCollapsed ? 'chevron-down' : 'chevron-up'}
                    size={18}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>

                {!stageCollapsed ? (
                  <View style={styles.stageBody}>
                    <Text style={[styles.stageDesc, { color: theme.textSecondary }]}>
                      {stage.description}
                    </Text>

                    {/* Topic nodes */}
                    <View style={styles.topicTree}>
                      {stage.topics.map((topic, topicIndex) => {
                        const key = `${stageIndex}-${topicIndex}`;
                        const expanded = expandedTopics.has(key);
                        const isLastTopic = topicIndex === stage.topics.length - 1;

                        return (
                          <View key={`${topic.name}-${topicIndex}`} style={styles.topicRow}>
                            <View style={styles.topicRail}>
                              <View
                                style={[
                                  styles.topicDot,
                                  {
                                    borderColor: roadmap.color,
                                    backgroundColor: expanded
                                      ? roadmap.color
                                      : theme.background,
                                  },
                                ]}
                              />
                              {!isLastTopic && (
                                <View style={[styles.topicLine, { backgroundColor: theme.border }]} />
                              )}
                            </View>

                            <View style={styles.topicMain}>
                              <TouchableOpacity
                                style={[
                                  styles.topicHeader,
                                  { backgroundColor: theme.cardDarker },
                                ]}
                                onPress={() => toggleTopic(key)}
                                activeOpacity={0.75}
                              >
                                <Text
                                  style={[
                                    styles.topicName,
                                    { color: expanded ? roadmap.color : theme.text },
                                  ]}
                                >
                                  {topic.name}
                                </Text>
                                <Ionicons
                                  name={expanded ? 'remove-outline' : 'add-outline'}
                                  size={16}
                                  color={expanded ? roadmap.color : theme.textSecondary}
                                />
                              </TouchableOpacity>

                              {expanded ? (
                                <View style={styles.topicDetail}>
                                  <Text style={[styles.topicSummary, { color: theme.text }]}>
                                    {topic.summary}
                                  </Text>
                                  {topic.subtopics.map((sub) => (
                                    <View key={sub} style={styles.subtopicRow}>
                                      <View
                                        style={[
                                          styles.subtopicDot,
                                          { backgroundColor: roadmap.color + '88' },
                                        ]}
                                      />
                                      <Text
                                        style={[
                                          styles.subtopicText,
                                          { color: theme.textSecondary },
                                        ]}
                                      >
                                        {sub}
                                      </Text>
                                    </View>
                                  ))}
                                </View>
                              ) : null}
                            </View>
                          </View>
                        );
                      })}
                    </View>

                    {/* Practice project */}
                    <View
                      style={[
                        styles.projectCard,
                        {
                          backgroundColor: roadmap.color + '10',
                          borderColor: roadmap.color + '30',
                        },
                      ]}
                    >
                      <View style={styles.projectTitleRow}>
                        <Ionicons name="construct-outline" size={16} color={roadmap.color} />
                        <Text style={[styles.projectLabel, { color: roadmap.color }]}>
                          Practice project
                        </Text>
                      </View>
                      <Text style={[styles.projectText, { color: theme.text }]}>
                        {stage.project}
                      </Text>
                    </View>

                    {/* Self-check */}
                    <View style={styles.checkpoints}>
                      <Text style={[styles.checkpointsLabel, { color: theme.textSecondary }]}>
                        Self-check
                      </Text>
                      {stage.checkpoints.map((checkpoint) => (
                        <View key={checkpoint} style={styles.checkpointRow}>
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={15}
                            color={theme.textSecondary}
                          />
                          <Text
                            style={[styles.checkpointText, { color: theme.textSecondary }]}
                          >
                            {checkpoint}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Resources */}
                    {stage.resources.map((resource) => (
                      <TouchableOpacity
                        key={resource.url}
                        style={[styles.resource, { backgroundColor: roadmap.color + '15' }]}
                        onPress={() => openUrl(resource.url)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="link-outline" size={16} color={roadmap.color} />
                        <Text
                          style={[styles.resourceText, { color: roadmap.color }]}
                          numberOfLines={1}
                        >
                          {resource.label}
                        </Text>
                        <Ionicons name="open-outline" size={14} color={roadmap.color} />
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}

        <View style={[styles.tipCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="bulb-outline" size={20} color={theme.warning} />
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            Tap a stage to fold it, tap any topic to see what it covers. Follow the stages in
            order, finish the practice project, and keep your work on GitHub.
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },

  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missingText: { marginTop: 14, fontSize: 14 },

  scrollContent: { paddingHorizontal: 20 },

  hero: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  heroDesc: { fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: 16 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  levelBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  levelText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 12.5, fontWeight: '500' },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  outcomeWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  outcomeChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9 },
  outcomeText: { fontSize: 12, fontWeight: '600' },
  outcomeNote: { fontSize: 12, lineHeight: 17, marginTop: 12 },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 12,
  },
  linkText: { fontSize: 12.5, fontWeight: '700' },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  sectionAction: { fontSize: 12.5, fontWeight: '700' },

  stageRow: { flexDirection: 'row' },
  timelineCol: { width: 36, alignItems: 'center' },
  node: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  connector: { width: 2, flex: 1, marginVertical: 4, borderRadius: 1 },

  stageCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    marginLeft: 10,
    marginBottom: 14,
    overflow: 'hidden',
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  stageHeaderText: { flex: 1 },
  stageTitle: { fontSize: 16, fontWeight: '700', marginBottom: 3 },
  stageMeta: { fontSize: 11.5, fontWeight: '500' },
  stageBody: { paddingHorizontal: 16, paddingBottom: 16 },
  stageDesc: { fontSize: 13, lineHeight: 18, marginBottom: 14 },

  topicTree: { marginBottom: 8 },
  topicRow: { flexDirection: 'row' },
  topicRail: { width: 22, alignItems: 'center' },
  topicDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 2,
    marginTop: 14,
  },
  topicLine: { width: 2, flex: 1, marginTop: 3, borderRadius: 1 },
  topicMain: { flex: 1, paddingBottom: 8 },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  topicName: { flex: 1, fontSize: 13, fontWeight: '600' },
  topicDetail: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 2 },
  topicSummary: { fontSize: 12.5, lineHeight: 18, marginBottom: 8 },
  subtopicRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 5 },
  subtopicDot: { width: 5, height: 5, borderRadius: 3, marginTop: 6 },
  subtopicText: { flex: 1, fontSize: 12, lineHeight: 17 },

  projectCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginTop: 6,
  },
  projectTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 6 },
  projectLabel: { fontSize: 11.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  projectText: { fontSize: 12.5, lineHeight: 18 },

  checkpoints: { marginTop: 14 },
  checkpointsLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 7,
  },
  checkpointRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginBottom: 5 },
  checkpointText: { flex: 1, fontSize: 12, lineHeight: 17 },

  resource: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 8,
  },
  resourceText: { flex: 1, fontSize: 12.5, fontWeight: '600' },

  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 4,
  },
  tipText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
});
