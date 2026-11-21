import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function AcademicsScreen({ navigation }: any) {
  const { theme } = useTheme();
  
  const menu = [
    { 
      title: 'Attendance', 
      description: 'View subject-wise attendance',
      route: 'Attendance', 
      icon: 'calendar-outline', 
      color: '#60A5FA', 
      bg: 'rgba(96, 165, 250, 0.15)' 
    },
    { 
      title: 'CIE Marks', 
      description: 'Check your internal assessment marks',
      route: 'CIEMarks', 
      icon: 'document-text-outline', 
      color: '#34D399', 
      bg: 'rgba(52, 211, 153, 0.15)' 
    },
    { 
      title: 'Syllabus', 
      description: 'View modules and topics for your subjects',
      route: 'Syllabus', 
      icon: 'book-outline', 
      color: '#A78BFA', 
      bg: 'rgba(167, 139, 250, 0.15)' 
    },
    { 
      title: 'Attendance Calculator', 
      description: 'Calculate classes needed to reach 75%',
      route: 'Calculator', 
      icon: 'calculator-outline', 
      color: '#FBBF24', 
      bg: 'rgba(251, 191, 36, 0.15)' 
    },
    { 
      title: 'Leaderboard', 
      description: 'See top CIE scorers in your class',
      route: 'Toppers', 
      icon: 'trophy-outline', 
      color: '#F59E0B', 
      bg: 'rgba(245, 158, 11, 0.15)' 
    },
    { 
      title: 'NC/DC Status', 
      description: 'Check your non-collegiate status',
      route: 'AcademicsMenu', 
      icon: 'warning-outline', 
      color: '#F87171', 
      bg: 'rgba(248, 113, 113, 0.15)' 
    },
    // 👇 ADDED ISSUES
    { 
      title: 'Campus Issues', 
      description: 'Report broken fans, leaks, and other problems',
      route: 'Issues', 
      icon: 'alert-circle-outline', 
      color: '#EF4444', 
      bg: 'rgba(239, 68, 68, 0.15)' 
    },
    // 👇 ADDED LOST & FOUND
    { 
      title: 'Lost & Found', 
      description: 'Find lost items or return found ones',
      route: 'LostFound', 
      icon: 'search-outline', 
      color: '#F472B6', 
      bg: 'rgba(244, 114, 182, 0.15)' 
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Academics</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Your academic tools and reports
          </Text>
        </View>

        {/* Menu List */}
        <View style={styles.menuContainer}>
          {menu.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.menuItem, { backgroundColor: theme.card }]}
              onPress={() => navigation.navigate(item.route)}
              activeOpacity={0.7}
            >
              {/* Icon */}
              <View style={[styles.iconContainer, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>

              {/* Text Content */}
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={1}>
                  {item.description}
                </Text>
              </View>

              {/* Chevron Arrow */}
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  
  header: { marginBottom: 24, marginTop: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  headerSubtitle: { fontSize: 14 },

  menuContainer: { gap: 12 }, 
  
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 20, 
  },
  
  iconContainer: { 
    width: 52, 
    height: 52, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: 16,
  },
  
  textContainer: { flex: 1, paddingRight: 10 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  description: { fontSize: 12 },
});