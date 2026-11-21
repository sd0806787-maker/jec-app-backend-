import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { CONTENT_BASE_URL } from '../services/api';
import { goHome } from '../navigation/goHome';

const CRITERIA_URL = `${CONTENT_BASE_URL}/criteria.json`;

interface Company {
  companyName: string;
  ctcLPA?: string | number | null;
  cgpaCutoff?: number | string | null;
  '12thMarksCutoff'?: string | number | null;
  importantTopics?: string[];
  officialWebsite?: string | null;
}

interface CriteriaResponse {
  companies?: Company[];
}

const CGPA_FILTERS = [
  { label: 'All', value: 0 },
  { label: '7.0+', value: 7.0 },
  { label: '8.0+', value: 8.0 },
  { label: '9.0+', value: 9.0 },
];

const formatValue = (value?: string | number | null, suffix = '') => {
  if (value === null || value === undefined || value === '') return '—';
  return `${value}${suffix}`;
};

const getDomain = (url?: string | null) => {
  if (!url) return null;
  const match = url.match(/^https?:\/\/([^/?#]+)/i);
  if (!match) return null;
  return match[1]
    .replace(/^www\./i, '')
    .replace(/^careers\./i, '')
    .toLowerCase();
};

function CompanyLogo({ name, website }: { name?: string; website?: string | null }) {
  const domain = getDomain(website);
  const sources = useMemo(
    () =>
      domain
        ? [
            `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
            `https://logo.clearbit.com/${domain}`,
          ]
        : [],
    [domain],
  );

  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(sources.length === 0);
  const initial = name?.charAt(0)?.toUpperCase() || '?';

  if (failed || sources.length === 0) {
    return (
      <LinearGradient colors={['#2E1065', '#13081F']} style={styles.companyInitial}>
        <Text style={styles.companyInitialText}>{initial}</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.companyLogoWrap}>
      <Image
        source={{ uri: sources[sourceIndex] }}
        style={styles.companyLogo}
        resizeMode="contain"
        onError={() => {
          if (sourceIndex < sources.length - 1) setSourceIndex(sourceIndex + 1);
          else setFailed(true);
        }}
      />
    </View>
  );
}

export default function CompanyCriteriaScreen({ navigation }: any) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minCgpa, setMinCgpa] = useState<number>(0);

  // State for the interactive topics modal
  const [selectedTopics, setSelectedTopics] = useState<string[] | null>(null);

  const fetchCriteria = useCallback(async () => {
    try {
      const res = await fetch(`${CRITERIA_URL}?t=${Date.now()}`);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data: CriteriaResponse = await res.json();
      setCompanies(Array.isArray(data.companies) ? data.companies : []);
      setError(null);
    } catch {
      setError('Could not load company criteria. Check your connection and try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Defer so the first state update happens outside the effect body.
    const timer = setTimeout(fetchCriteria, 0);
    return () => clearTimeout(timer);
  }, [fetchCriteria]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchCriteria();
  };

  const handleFilterPress = (value: number) => {
    if (value === minCgpa) return;
    setIsFiltering(true);
    setMinCgpa(value);
    setTimeout(() => setIsFiltering(false), 300);
  };

  const filteredCompanies = useMemo(() => {
    if (minCgpa === 0) return companies;
    return companies.filter((company) => {
      if (company.cgpaCutoff === null || company.cgpaCutoff === undefined) return false;
      return Number(company.cgpaCutoff) >= minCgpa;
    });
  }, [companies, minCgpa]);

  const openWebsite = async (url?: string | null) => {
    if (!url) return;
    try { await Linking.openURL(url); } catch {}
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={['#120924', '#05020A', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => goHome(navigation)}>
          <Ionicons name="arrow-back" size={22} color="#A78BFA" />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Hiring Criteria</Text>
          <Text style={styles.headerSubtitle}>Eligibility & topics</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="briefcase" size={22} color="#8B5CF6" />
        </View>
      </View>

      {/* Filter Row */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {CGPA_FILTERS.map((filter) => {
            const isActive = minCgpa === filter.value;
            return (
              <TouchableOpacity
                key={filter.label}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => handleFilterPress(filter.value)}
                disabled={isFiltering}
              >
                {isActive && (
                   <LinearGradient
                     colors={['#4C1D95', '#2E1065']}
                     style={StyleSheet.absoluteFill}
                     start={{ x: 0, y: 0 }}
                     end={{ x: 1, y: 1 }}
                   />
                )}
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading criteria...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={56} color="#666" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => { setIsLoading(true); fetchCriteria(); }}>
            <Ionicons name="refresh" size={18} color="#FFF" />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#8B5CF6" />}
        >
          {isFiltering ? (
            <View style={styles.filterLoadingContainer}>
              <ActivityIndicator size="small" color="#8B5CF6" />
              <Text style={styles.filterLoadingText}>Applying filter...</Text>
            </View>
          ) : filteredCompanies.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="briefcase-outline" size={48} color="#666" />
              <Text style={styles.emptyText}>
                {companies.length === 0 ? 'No company criteria available yet.' : `No companies match the ${minCgpa}+ CGPA filter.`}
              </Text>
            </View>
          ) : (
            filteredCompanies.map((company, index) => (
              <View key={index} style={styles.cardWrapper}>
                <View style={styles.card}>
                  <View style={styles.cardInner}>
                    <View style={styles.cardHeader}>
                      <CompanyLogo name={company.companyName} website={company.officialWebsite} />
                      <Text style={styles.companyName}>{company.companyName}</Text>
                    </View>

                    <View style={styles.statsRow}>
                      <View style={styles.statBox}>
                        <Ionicons name="cash-outline" size={16} color="#34D399" />
                        <Text style={styles.statLabel}>CTC</Text>
                        <Text style={styles.statValue} numberOfLines={1}>{formatValue(company.ctcLPA, company.ctcLPA ? ' LPA' : '')}</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Ionicons name="school-outline" size={16} color="#A78BFA" />
                        <Text style={styles.statLabel}>CGPA</Text>
                        <Text style={styles.statValue}>{formatValue(company.cgpaCutoff)}</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Ionicons name="ribbon-outline" size={16} color="#FBBF24" />
                        <Text style={styles.statLabel}>12th</Text>
                        <Text style={styles.statValue}>{formatValue(company['12thMarksCutoff'])}</Text>
                      </View>
                    </View>

                    {/* 👇 INTERACTIVE TOPICS SECTION 👇 */}
                    {(company.importantTopics ?? []).length > 0 && (
                      <TouchableOpacity
                        style={styles.topicsSection}
                        onPress={() => setSelectedTopics(company.importantTopics ?? [])}
                        activeOpacity={0.7}
                      >
                        <View style={styles.topicsTitleRow}>
                          <Ionicons name="bulb" size={16} color="#8B5CF6" />
                          <Text style={styles.topicsTitle}>TOPICS</Text>
                          <Ionicons name="chevron-forward" size={14} color="#A78BFA" style={{ marginLeft: 'auto' }} />
                        </View>
                        <View style={styles.topicChips}>
                          {(company.importantTopics ?? []).slice(0, 3).map((topic, i) => (
                            <View key={i} style={styles.chip}>
                              <Text style={styles.chipText}>{topic}</Text>
                            </View>
                          ))}
                          {(company.importantTopics ?? []).length > 3 && (
                            <View style={[styles.chip, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                              <Text style={styles.chipText}>+{(company.importantTopics ?? []).length - 3} more</Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    )}

                    {company.officialWebsite && (
                      <TouchableOpacity style={styles.websiteButton} onPress={() => openWebsite(company.officialWebsite)}>
                        <Text style={styles.websiteText}>Visit Website</Text>
                        <Ionicons name="arrow-forward" size={14} color="#A78BFA" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
          <View style={{ height: 120 }} />
        </ScrollView>
      )}

      {/* 👇 TOPICS MODAL 👇 */}
      <Modal visible={!!selectedTopics} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Important Topics</Text>
              <TouchableOpacity onPress={() => setSelectedTopics(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              {(selectedTopics ?? []).map((topic, i) => (
                <View key={i} style={styles.modalListItem}>
                  <View style={styles.modalDot} />
                  <Text style={styles.modalListText}>{topic}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#05020A' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16, gap: 12 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 13, marginTop: 2, fontWeight: '500', color: '#888' },
  headerIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(139, 92, 246, 0.1)', borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.2)', alignItems: 'center', justifyContent: 'center' },

  filterWrapper: { marginBottom: 20 },
  filterScroll: { paddingHorizontal: 20, gap: 10 },
  filterChip: { height: 42, paddingHorizontal: 24, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  filterChipActive: { borderColor: '#4C1D95' },
  filterText: { fontSize: 14, fontWeight: '700', color: '#888' },
  filterTextActive: { color: '#FFF' },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  loadingText: { marginTop: 14, fontSize: 14, color: '#888' },
  errorText: { fontSize: 14, textAlign: 'center', marginTop: 14, color: '#888' },
  retryButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14, backgroundColor: '#8B5CF6' },
  retryText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

  // 👇 Constrained card width styling
  scrollContent: { paddingTop: 8 },
  cardWrapper: { paddingHorizontal: 24, marginBottom: 16 },
  card: { borderRadius: 20, backgroundColor: 'rgba(15, 10, 25, 0.7)', borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.15)', overflow: 'hidden' },
  cardInner: { padding: 16 },
  
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 16, fontSize: 14, textAlign: 'center', color: '#888' },
  filterLoadingContainer: { marginTop: 40, alignItems: 'center', gap: 12 },
  filterLoadingText: { color: '#888', fontSize: 14, fontWeight: '500' },

  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  companyInitial: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  companyInitialText: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  companyLogoWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginRight: 14, padding: 6, overflow: 'hidden' },
  companyLogo: { width: '100%', height: '100%' },
  companyName: { flex: 1, fontSize: 18, fontWeight: '800', color: '#FFF' },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statBox: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.02)' },
  statLabel: { fontSize: 9, fontWeight: '800', marginTop: 6, color: '#666', textTransform: 'uppercase' },
  statValue: { fontSize: 14, fontWeight: '800', marginTop: 2, color: '#FFF' },

  // 👇 New interactive topics styling
  topicsSection: { marginBottom: 16, backgroundColor: 'rgba(139, 92, 246, 0.05)', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.1)' },
  topicsTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  topicsTitle: { fontSize: 11, fontWeight: '800', color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: 0.5 },
  topicChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: 'rgba(139, 92, 246, 0.15)' },
  chipText: { fontSize: 11, fontWeight: '600', color: '#A78BFA' },

  websiteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.2)', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: 'rgba(139, 92, 246, 0.05)' },
  websiteText: { fontSize: 13, fontWeight: '700', color: '#A78BFA' },

  // 👇 Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxHeight: '80%', backgroundColor: '#13081F', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.3)', overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(139, 92, 246, 0.1)' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  modalScroll: { padding: 20, gap: 12 },
  modalListItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modalDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#8B5CF6' },
  modalListText: { fontSize: 15, color: '#CCC', fontWeight: '500', flex: 1 },
});