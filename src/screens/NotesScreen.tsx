import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';
import { useStudent } from '../context/StudentContext';
import { notesDatabase, ResourceItem } from '../data/notesData';

const getResourceStyle = (type: string) => {
  switch (type) {
    case 'NPTEL': return { icon: 'school', color: '#F87171', bg: 'rgba(248, 113, 113, 0.15)' }; 
    case 'Roadmap': return { icon: 'map', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)' }; 
    case 'Documentation': return { icon: 'document-text', color: '#34D399', bg: 'rgba(52, 211, 153, 0.15)' }; 
    default: return { icon: 'link', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.15)' };
  }
};

export default function NotesScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { studentData } = useStudent();

  if (!studentData) return null;

  const branchKey = studentData.branchKey || 'OTHER';
  const resources = notesDatabase[branchKey] || notesDatabase['OTHER'];

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.log("Error opening URL:", error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 10 }]}>
        <TouchableOpacity onPress={() => goHome(navigation)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Study Hub</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {branchKey} Resources
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <Ionicons name="bulb-outline" size={24} color={theme.warning} />
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Curated NPTEL courses and roadmaps specifically for your branch.
          </Text>
        </View>

        {resources.map((item: ResourceItem, index: number) => {
          const { icon, color, bg } = getResourceStyle(item.type);

          return (
            <TouchableOpacity 
              key={index} 
              style={[styles.card, { backgroundColor: theme.card }]}
              onPress={() => handleOpenLink(item.url)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: bg }]}>
                <Ionicons name={icon as any} size={24} color={color} />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>

              <Ionicons name="open-outline" size={20} color={theme.textSecondary} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15 },
  backBtn: { marginRight: 15, padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 13, marginTop: 4 },
  
  // FIXED: Added paddingBottom
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  
  infoCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 24, gap: 12, marginTop: 10 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 20 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 12 },
  iconCircle: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  textContainer: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  description: { fontSize: 12, lineHeight: 18 },
});