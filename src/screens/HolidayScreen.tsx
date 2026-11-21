import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, Text, FlatList, StyleSheet, 
  TextInput, TouchableOpacity, ScrollView, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { mockHolidays, Holiday } from '../data/holidayData';

// YOUR GITHUB URL
import { CONTENT_BASE_URL } from '../services/api';

const GITHUB_HOLIDAYS_URL = `${CONTENT_BASE_URL}/holidays.json`;

const MONTHS = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function HolidayScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('All');
  
  // Start with local data, then update from GitHub
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchLatestHolidays = async () => {
      try {
        // Add a timestamp to bypass GitHub's raw cache
        const response = await fetch(`${GITHUB_HOLIDAYS_URL}?t=${new Date().getTime()}`);
        
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const text = await response.text();
        
        // Parse the JSON manually to catch syntax errors clearly
        let json;
        try {
          json = JSON.parse(text);
        } catch (parseError) {
          console.log("❌ GITHUB JSON IS BROKEN. Error:", parseError instanceof Error ? parseError.message : String(parseError));
          console.log("Raw text snippet:", text.substring(0, 100));
          return; // Stop here and keep using offline data
        }

        // Handle both JSON structures (Array or { holidays: [] })
        const dataArray = Array.isArray(json) ? json : json.holidays;
        
        if (dataArray && Array.isArray(dataArray)) {
          setHolidays(dataArray);
          console.log(`✅ Successfully loaded ${dataArray.length} holidays from GitHub`);
        } else {
          console.log("❌ JSON format is wrong. Expected an array or { holidays: [] }");
        }
      } catch (error: any) {
        console.log("❌ Failed to fetch from GitHub, using offline data. Error:", error.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchLatestHolidays();
  }, []);

  // 1. Filter Logic based on Search and Month
  const filteredHolidays = useMemo(() => {
    return holidays.filter((holiday) => {
      const matchesSearch = holiday.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMonth = selectedMonth === 'All' || holiday.date.includes(selectedMonth);
      return matchesSearch && matchesMonth;
    });
  }, [searchQuery, selectedMonth, holidays]);

  // 2. Calculate Stats
  const stats = useMemo(() => {
    let publicCount = 0;
    let restrictedCount = 0;
    holidays.forEach(h => {
      if (h.type === 'Public Holiday') publicCount++;
      if (h.type === 'Restricted Holiday') restrictedCount++;
    });
    return { total: holidays.length, publicCount, restrictedCount };
  }, [holidays]);

  // Helper to get the color for the holiday type badge
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'National Holiday': return theme.primary; 
      case 'Public Holiday': return theme.success;   
      case 'Restricted Holiday': return theme.warning; 
      case 'Special Casual Leave': return theme.secondary; 
      case 'Half Holiday': return theme.textSecondary; 
      default: return theme.textSecondary;
    }
  };

  const renderHolidayItem = ({ item }: { item: Holiday }) => {
    const dateParts = item.date.split(' ');
    const dayNum = dateParts[0];
    const month = dateParts[1];
    const badgeColor = getBadgeColor(item.type);

    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: theme.card }]}
        activeOpacity={0.7}
      >
        {/* Left Side: Date Badge */}
        <View style={[styles.dateBadge, { backgroundColor: theme.cardDarker }]}>
          <Text style={[styles.dateDay, { color: theme.text }]}>{dayNum}</Text>
          <Text style={[styles.dateMonth, { color: theme.textSecondary }]}>{month}</Text>
        </View>

        {/* Middle: Holiday Info */}
        <View style={styles.detailsContainer}>
          <Text style={[styles.holidayName, { color: theme.text }]} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={[styles.holidayDay, { color: theme.textSecondary }]}>
            {item.day}
          </Text>
        </View>

        {/* Right Side: Type Badge */}
        <View style={[styles.typeBadge, { backgroundColor: `${badgeColor}15` }]}>
          <Text style={[styles.typeText, { color: badgeColor }]}>
            {item.type.replace(' Holiday', '').replace('Special Casual Leave', 'SCL')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      
      {/* Header & Stats */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Holidays</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Academic Year 2026</Text>
          </View>
          {isFetching && <ActivityIndicator size="small" color={theme.primary} />}
        </View>
        
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.statValue, { color: theme.success }]}>{stats.publicCount}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Public</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.statValue, { color: theme.warning }]}>{stats.restrictedCount}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Restricted</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>{stats.total}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={20} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search holidays..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Month Filter Pills */}
      <View style={styles.monthFilterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthScroll}>
          {MONTHS.map((month) => (
            <TouchableOpacity
              key={month}
              style={[
                styles.monthPill,
                { backgroundColor: selectedMonth === month ? theme.primary : theme.card }
              ]}
              onPress={() => setSelectedMonth(month)}
            >
              <Text style={[
                styles.monthText,
                { color: selectedMonth === month ? '#FFF' : theme.textSecondary }
              ]}>
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Holiday List */}
      <FlatList
        data={filteredHolidays}
        keyExtractor={(item) => item.id}
        renderItem={renderHolidayItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={theme.textSecondary} />
            <Text style={{ color: theme.textSecondary, marginTop: 10 }}>No holidays found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 13, marginTop: 4, marginBottom: 20 },
  
  // Stats
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  statBox: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '500' },
  
  // Search Bar
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 20, 
    paddingHorizontal: 16, 
    height: 50, 
    borderRadius: 16,
    marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  
  // Month Filter
  monthFilterWrapper: { marginBottom: 20 },
  monthScroll: { paddingHorizontal: 20, gap: 10 },
  monthPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  monthText: { fontSize: 14, fontWeight: '600' },
  
  // List
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  dateBadge: {
    width: 60,
    height: 65,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dateDay: { fontSize: 22, fontWeight: 'bold' },
  dateMonth: { fontSize: 11, textTransform: 'uppercase', fontWeight: '600', marginTop: 2 },
  
  detailsContainer: { flex: 1, justifyContent: 'center', paddingRight: 10 },
  holidayName: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  holidayDay: { fontSize: 13 },
  
  typeBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  typeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 50 },
});