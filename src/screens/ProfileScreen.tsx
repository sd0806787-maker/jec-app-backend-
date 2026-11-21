import React, { useState } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, TouchableOpacity, 
  Alert, Linking, Modal, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates'; // <-- NEW: Import Updates
import { useTheme } from '../context/ThemeContext';
import { useStudent } from '../context/StudentContext';

export default function ProfileScreen({ navigation }: any) {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const { studentData, setStudentData, setRollNumber } = useStudent();
  
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // <-- NEW: Loading state

  if (!studentData) return null;

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const semesterNumber = studentData.semester.replace('Sem ', '');

  const handleSendEmail = () => {
    Linking.openURL('mailto:souvikdas1757@gmail.com?subject=JEC App Support');
    setIsSupportModalOpen(false);
  };

  // --- NEW: FORCE UPDATE FUNCTION ---
  const handleForceUpdate = async () => {
    try {
      setIsUpdating(true);
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        Alert.alert(
          "Update Downloaded", 
          "The app will now restart to apply the latest changes.",
          [{ text: "Restart", onPress: async () => await Updates.reloadAsync() }]
        );
      } else {
        Alert.alert("No Updates", "You are already using the latest version of the app.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not check for updates. Please try again later.");
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive', 
          onPress: async () => {
            await AsyncStorage.removeItem('@jec_roll');
            await AsyncStorage.removeItem('@jec_data');
            await AsyncStorage.removeItem('@toppers_cache'); 
            await AsyncStorage.removeItem('@announcements_cache');
            await AsyncStorage.removeItem('@professors_cache');
            setStudentData(null);
            setRollNumber('');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>

        {/* --- Profile Hero Card --- */}
        <View style={[styles.heroCard, { backgroundColor: theme.card }]}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#4C1D95', '#A855F7']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>{getInitials(studentData.name)}</Text>
            </LinearGradient>
          </View>
          
          <Text style={[styles.name, { color: theme.text }]}>{studentData.name}</Text>
          <Text style={[styles.rollNo, { color: theme.textSecondary }]}>
            {studentData.rollNo} · {studentData.branch}
          </Text>

          {/* Quick Stats Row */}
          <View style={[styles.statsRow, { borderTopColor: theme.cardDarker }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.success }]}>{studentData.overallAttendance}%</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Attendance</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.cardDarker }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>{studentData.subjectsCount}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Subjects</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.cardDarker }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>{semesterNumber}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Semester</Text>
            </View>
          </View>
        </View>

        {/* --- Settings Menu --- */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Settings</Text>
        
        <View style={[styles.menuCard, { backgroundColor: theme.card }]}>
          
          {/* Edit Profile Row */}
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.cardDarker, borderBottomWidth: 1 }]}
            onPress={() => Alert.alert('Coming Soon', 'Editing profile will be available in the next update.')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(96, 165, 250, 0.15)' }]}>
                <Ionicons name="person-outline" size={20} color="#60A5FA" />
              </View>
              <Text style={[styles.menuText, { color: theme.text }]}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          {/* Appearance Row */}
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.cardDarker, borderBottomWidth: 1 }]}
            onPress={toggleTheme}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(167, 139, 250, 0.15)' }]}>
                <Ionicons name={isDarkMode ? "moon-outline" : "sunny-outline"} size={20} color="#A78BFA" />
              </View>
              <Text style={[styles.menuText, { color: theme.text }]}>Appearance</Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
              {isDarkMode ? 'Dark' : 'Light'}
            </Text>
          </TouchableOpacity>

          {/* FORCE UPDATE ROW */}
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: theme.cardDarker, borderBottomWidth: 1 }]}
            onPress={handleForceUpdate}
            disabled={isUpdating}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(251, 191, 36, 0.15)' }]}>
                <Ionicons name="cloud-download-outline" size={20} color="#FBBF24" />
              </View>
              <Text style={[styles.menuText, { color: theme.text }]}>
                {isUpdating ? 'Checking for updates...' : 'Check for Updates'}
              </Text>
            </View>
            {isUpdating ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            )}
          </TouchableOpacity>

          {/* Help & Support Row */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setIsSupportModalOpen(true)} 
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(52, 211, 153, 0.15)' }]}>
                <Ionicons name="help-circle-outline" size={20} color="#34D399" />
              </View>
              <Text style={[styles.menuText, { color: theme.text }]}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

        </View>

        {/* --- Sign Out Button --- */}
        <TouchableOpacity 
          style={[styles.signOutBtn, { borderColor: 'rgba(239, 68, 68, 0.3)' }]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={[styles.signOutText, { color: '#EF4444' }]}>Sign out</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: theme.textSecondary }]}>
          JEC Student App v1.0.0
        </Text>

      </ScrollView>

      {/* --- CUSTOM HELP & SUPPORT MODAL --- */}
      <Modal visible={isSupportModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            
            <LinearGradient
              colors={['#34D399', '#10B981']}
              style={styles.modalIconBg}
            >
              <Ionicons name="mail" size={32} color="#FFF" />
            </LinearGradient>

            <Text style={[styles.modalTitle, { color: theme.text }]}>Help & Support</Text>
            <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
              Have a question, found a bug, or want to suggest a feature? We&apos;d love to hear from you.
            </Text>

            <TouchableOpacity 
              style={[styles.emailBox, { backgroundColor: theme.cardDarker, borderColor: theme.border }]}
              onPress={handleSendEmail}
            >
              <Ionicons name="at" size={20} color={theme.textSecondary} />
              <Text style={[styles.emailText, { color: theme.text }]}>souvikdas1757@gmail.com</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.primaryBtn, { backgroundColor: theme.primary }]} 
              onPress={handleSendEmail}
            >
              <Text style={styles.primaryBtnText}>Send Email</Text>
              <Ionicons name="paper-plane" size={18} color="#FFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryBtn} 
              onPress={() => setIsSupportModalOpen(false)}
            >
              <Text style={{ color: theme.textSecondary, fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 120 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 10 },

  // Hero Card
  heroCard: { borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 24 },
  avatarContainer: { marginBottom: 16 },
  avatarGradient: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  rollNo: { fontSize: 13, marginBottom: 24 },

  // Stats
  statsRow: { flexDirection: 'row', width: '100%', borderTopWidth: 1, paddingTop: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 11 },
  statDivider: { width: 1, height: '80%' },

  // Menu
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  menuCard: { borderRadius: 20, overflow: 'hidden', marginBottom: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIconBg: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuText: { fontSize: 15, fontWeight: '500' },

  // Sign Out
  signOutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderRadius: 16, 
    paddingVertical: 16, 
    marginBottom: 24 
  },
  signOutText: { fontSize: 16, fontWeight: '600', marginLeft: 8 },
  
  versionText: { fontSize: 12, textAlign: 'center' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContent: { borderRadius: 24, padding: 24, alignItems: 'center' },
  modalIconBg: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  emailBox: { flexDirection: 'row', alignItems: 'center', width: '100%', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 24 },
  emailText: { fontSize: 15, fontWeight: '500', marginLeft: 10 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingVertical: 16, borderRadius: 12, marginBottom: 12 },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  secondaryBtn: { paddingVertical: 12 }
});