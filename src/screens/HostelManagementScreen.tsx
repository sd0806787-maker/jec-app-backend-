import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';

// Mock data for Hostel 1 to 13
const HOSTEL_DATA: Record<number, any> = {
  1: { block: 'Block A', room: 'A-101', warden: 'Dr. R. Sharma', phone: '+91 9876543210', mess: 'North Indian' },
  2: { block: 'Block B', room: 'B-202', warden: 'Prof. S. Das', phone: '+91 9876543211', mess: 'South Indian' },
  3: { block: 'Block C', room: 'C-303', warden: 'Mr. K. Bora', phone: '+91 9876543212', mess: 'Mixed' },
  4: { block: 'Block D', room: 'D-404', warden: 'Mrs. A. Das', phone: '+91 9876543213', mess: 'North Indian' },
  5: { block: 'Block E', room: 'E-505', warden: 'Dr. P. Kalita', phone: '+91 9876543214', mess: 'South Indian' },
  6: { block: 'Block F', room: 'F-606', warden: 'Mr. T. Rahman', phone: '+91 9876543215', mess: 'Mixed' },
  7: { block: 'Block G', room: 'G-707', warden: 'Mrs. N. Baruah', phone: '+91 9876543216', mess: 'North Indian' },
  8: { block: 'Block H', room: 'H-808', warden: 'Prof. M. Gogoi', phone: '+91 9876543217', mess: 'South Indian' },
  9: { block: 'Block I', room: 'I-909', warden: 'Dr. J. Ahmed', phone: '+91 9876543218', mess: 'Mixed' },
  10: { block: 'Block J', room: 'J-1010', warden: 'Mr. B. Sarma', phone: '+91 9876543219', mess: 'North Indian' },
  11: { block: 'Block K', room: 'K-111', warden: 'Mrs. D. Devi', phone: '+91 9876543220', mess: 'South Indian' },
  12: { block: 'Block L', room: 'L-212', warden: 'Prof. H. Ali', phone: '+91 9876543221', mess: 'Mixed' },
  13: { block: 'Block M', room: 'M-313', warden: 'Dr. V. Singh', phone: '+91 9876543222', mess: 'North Indian' },
};

// 👇 Highly Interactive Button Component with Cross-Fade 👇
const HostelSelectorButton = ({ 
  num, 
  isSelected, 
  onPress, 
  theme 
}: { 
  num: number; 
  isSelected: boolean; 
  onPress: () => void; 
  theme: any 
}) => {
  const [pressScale] = useState(() => new Animated.Value(1));
  const [gradientOpacity] = useState(
    () => new Animated.Value(isSelected ? 1 : 0),
  );
  const [textScale] = useState(
    () => new Animated.Value(isSelected ? 1.05 : 1),
  );

  useEffect(() => {
    Animated.timing(gradientOpacity, {
      toValue: isSelected ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.spring(textScale, {
      toValue: isSelected ? 1.05 : 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  const handlePressIn = () => {
    Animated.spring(pressScale, { toValue: 0.9, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <View style={[styles.selectorPill, { backgroundColor: theme.card, borderColor: 'rgba(139, 92, 246, 0.2)' }]}>
          <Text style={[styles.selectorText, { color: theme.textSecondary }]}>
            Hostel {num}
          </Text>
        </View>

        <Animated.View style={[StyleSheet.absoluteFill, { opacity: gradientOpacity, borderRadius: 20 }]}>
          <LinearGradient
            colors={['#8B5CF6', '#6D28D9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.selectorPill, styles.selectorPillActive, { borderColor: 'transparent' }]}
          >
            <Animated.View style={{ flexDirection: 'row', alignItems: 'center', transform: [{ scale: textScale }] }}>
              <Ionicons name="bed" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={[styles.selectorText, { color: '#FFF', fontWeight: 'bold' }]}>
                Hostel {num}
              </Text>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function HostelManagementScreen({ navigation }: any) {
  const { theme } = useTheme();
  
  const [selectedHostel, setSelectedHostel] = useState<number>(1);
  const currentHostelInfo = HOSTEL_DATA[selectedHostel];

  const handleComingSoon = (feature: string) => {
    Alert.alert(feature, `The ${feature} feature is coming soon!`);
  };

  const handleBack = () => {
    goHome(navigation);
  };

  // 👇 Navigate to Home (which is the JEC Portal dashboard)
  const goToPortal = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      
      {/* 👇 HEADER WITH JEC PORTAL BUTTON 👇 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>JEC Hostel</Text>
        
        <TouchableOpacity onPress={goToPortal} style={styles.portalBtn}>
          <Ionicons name="school" size={18} color={theme.primary} />
          <Text style={[styles.portalBtnText, { color: theme.primary }]}>JEC Portal</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.selectorLabel, { color: theme.textSecondary }]}>Select Your Hostel</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.selectorScroll} 
          contentContainerStyle={{ paddingRight: 20, gap: 12, paddingVertical: 10 }}
        >
          {Array.from({ length: 13 }, (_, i) => i + 1).map((num) => (
            <HostelSelectorButton
              key={num}
              num={num}
              isSelected={selectedHostel === num}
              onPress={() => setSelectedHostel(num)}
              theme={theme}
            />
          ))}
        </ScrollView>

        <LinearGradient 
          colors={['#4C1D95', '#7E22CE', '#A855F7']} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.heroCard}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.heroIconBg}>
              <Ionicons name="bed" size={24} color="#FFF" />
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Active Resident</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Hostel {selectedHostel}</Text>
          <Text style={styles.heroSubtitle}>Room {currentHostelInfo.room} · {currentHostelInfo.block}</Text>
          
          <View style={styles.heroBottomRow}>
            <View>
              <Text style={styles.heroStatLabel}>Warden</Text>
              <Text style={styles.heroStatValue}>{currentHostelInfo.warden}</Text>
            </View>
            <TouchableOpacity style={styles.callBtn} onPress={() => handleComingSoon('Calling Warden')}>
              <Ionicons name="call" size={16} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Today&apos;s Mess Menu</Text>
          <View style={[styles.messTypeBadge, { backgroundColor: 'rgba(167, 139, 250, 0.15)' }]}>
            <Text style={{ color: '#A78BFA', fontSize: 10, fontWeight: 'bold' }}>{currentHostelInfo.mess}</Text>
          </View>
        </View>
        
        <View style={[styles.messCard, { backgroundColor: theme.card }]}>
          <View style={styles.messRow}>
            <View style={[styles.messTimeBg, { backgroundColor: 'rgba(167, 139, 250, 0.15)' }]}>
              <Text style={[styles.messTimeText, { color: '#A78BFA' }]}>Morning</Text>
            </View>
            <Text style={[styles.messText, { color: theme.text }]}>Poha, Tea, Banana</Text>
          </View>
          <View style={[styles.messDivider, { backgroundColor: theme.cardDarker }]} />
          
          <View style={styles.messRow}>
            <View style={[styles.messTimeBg, { backgroundColor: 'rgba(244, 114, 182, 0.15)' }]}>
              <Text style={[styles.messTimeText, { color: '#F472B6' }]}>Lunch</Text>
            </View>
            <Text style={[styles.messText, { color: theme.text }]}>Rice, Dal, Chicken Curry</Text>
          </View>
          <View style={[styles.messDivider, { backgroundColor: theme.cardDarker }]} />
          
          <View style={styles.messRow}>
            <View style={[styles.messTimeBg, { backgroundColor: 'rgba(96, 165, 250, 0.15)' }]}>
              <Text style={[styles.messTimeText, { color: '#60A5FA' }]}>Dinner</Text>
            </View>
            <Text style={[styles.messText, { color: theme.text }]}>Roti, Paneer, Salad</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Quick Actions</Text>
        <View style={styles.gridContainer}>
          
          <TouchableOpacity style={[styles.gridItem, { backgroundColor: theme.card }]} onPress={() => handleComingSoon('Leave Request')}>
            <View style={[styles.gridIconBg, { backgroundColor: 'rgba(167, 139, 250, 0.15)' }]}>
              <Ionicons name="document-text" size={24} color="#A78BFA" />
            </View>
            <Text style={[styles.gridTitle, { color: theme.text }]}>Leave Request</Text>
            <Text style={[styles.gridSub, { color: theme.textSecondary }]}>Apply for outstation</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.gridItem, { backgroundColor: theme.card }]} onPress={() => handleComingSoon('Maintenance')}>
            <View style={[styles.gridIconBg, { backgroundColor: 'rgba(244, 114, 182, 0.15)' }]}>
              <Ionicons name="construct" size={24} color="#F472B6" />
            </View>
            <Text style={[styles.gridTitle, { color: theme.text }]}>Maintenance</Text>
            <Text style={[styles.gridSub, { color: theme.textSecondary }]}>Report an issue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.gridItem, { backgroundColor: theme.card }]} onPress={() => handleComingSoon('Notices')}>
            <View style={[styles.gridIconBg, { backgroundColor: 'rgba(96, 165, 250, 0.15)' }]}>
              <Ionicons name="megaphone" size={24} color="#60A5FA" />
            </View>
            <Text style={[styles.gridTitle, { color: theme.text }]}>Notices</Text>
            <Text style={[styles.gridSub, { color: theme.textSecondary }]}>Warden announcements</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.gridItem, { backgroundColor: theme.card }]} onPress={() => handleComingSoon('Room Details')}>
            <View style={[styles.gridIconBg, { backgroundColor: 'rgba(52, 211, 153, 0.15)' }]}>
              <Ionicons name="people" size={24} color="#34D399" />
            </View>
            <Text style={[styles.gridTitle, { color: theme.text }]}>Roommates</Text>
            <Text style={[styles.gridSub, { color: theme.textSecondary }]}>View details</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  backBtn: { marginRight: 15, padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', flex: 1 },
  
  // 👇 JEC PORTAL BUTTON STYLES 👇
  portalBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(139, 92, 246, 0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  portalBtnText: { fontSize: 13, fontWeight: 'bold' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  
  selectorLabel: { fontSize: 13, fontWeight: '600', marginBottom: 10, marginTop: 10 },
  selectorScroll: { marginBottom: 10 },
  selectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 95,
  },
  selectorPillActive: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  selectorText: { fontSize: 13 },

  heroCard: { 
    borderRadius: 24, 
    padding: 20, 
    marginBottom: 24, 
    shadowColor: '#4C1D95', 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.5, 
    shadowRadius: 12, 
    elevation: 10 
  },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  heroIconBg: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  statusText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  heroTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  heroSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 20 },
  heroBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 16 },
  heroStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 2 },
  heroStatValue: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  callBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  messTypeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  
  messCard: { borderRadius: 20, padding: 16 },
  messRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  messTimeBg: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 12 },
  messTimeText: { fontSize: 11, fontWeight: 'bold' },
  messText: { fontSize: 14, fontWeight: '500' },
  messDivider: { height: 1, marginVertical: 4 },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },
  gridItem: { width: '47%', borderRadius: 20, padding: 16 },
  gridIconBg: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  gridTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  gridSub: { fontSize: 11 },
});