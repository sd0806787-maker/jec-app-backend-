import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform, useWindowDimensions, Linking 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStudent } from '../context/StudentContext';
import type { StudentData, SubjectData } from '../context/StudentContext';
import { ApiError, apiRequest } from '../services/api';

interface LoginResponse {
  student: {
    student: {
      name: string;
      roll: string;
      semester: number;
      branch: string;
      branchKey?: string;
      section?: string;
      academicYear?: string;
    };
    overall?: {
      status?: string;
      percentage?: number;
      attended?: number;
      recorded?: number;
    };
    subjects?: SubjectData[];
  };
}

// Password-reset support contact
const SUPPORT_WHATSAPP_NUMBER = '916003837348';
const SUPPORT_WHATSAPP_DISPLAY = '+91 6003837348';
const SUPPORT_WHATSAPP_MESSAGE = 'Hello, I need help resetting my JEC Student app password.';

export default function LoginScreen({ navigation }: any) {
  const { setStudentData, setRollNumber } = useStudent();
  const { height } = useWindowDimensions(); 
  
  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Dynamic Responsive Sizing
  const isSmallScreen = height < 700;
  const horizontalPadding = isSmallScreen ? 16 : 24;
  const logoSize = isSmallScreen ? 70 : 90;
  const cardPadding = isSmallScreen ? 16 : 24;

  // ==========================================
  // LOGIN LOGIC (Unchanged)
  // ==========================================
  const handleLogin = async () => {
    const roll = identifier.replace(/\s+/g, '').trim().toUpperCase();

    if (!roll) {
      Alert.alert('Error', 'Please enter your enrollment number');
      return;
    }
    setIsLoading(true);

    try {
      const data = await apiRequest<LoginResponse>('/api/auth/login-roll', {
        method: 'POST',
        body: JSON.stringify({ roll }),
        // The backend refreshes data from the college attendance portal, which
        // can take 20+ seconds on a cold lookup.
        timeoutMs: 45000,
      });

      const mappedData = {
        name: data.student.student.name,
        rollNo: data.student.student.roll,
        semester: `Sem ${data.student.student.semester}`,
        branch: data.student.student.branch,
        branchKey: data.student.student.branchKey || 'CSE',
        status: data.student.overall?.status || 'Regular',
        subjectsCount: data.student.subjects ? data.student.subjects.length : 0,
        overallAttendance: data.student.overall?.percentage || 0,
        attendedClasses: data.student.overall?.attended || 0,
        conductedClasses: data.student.overall?.recorded || 0,
        section: data.student.student.section || 'N/A',
        academicYear: data.student.student.academicYear || 'N/A',
        subjects: data.student.subjects || [],
      };

      if (rememberMe) {
        await AsyncStorage.setItem('@jec_data', JSON.stringify(mappedData));
        await AsyncStorage.setItem('@jec_roll', mappedData.rollNo);
      }

      setStudentData(mappedData);
      setRollNumber(mappedData.rollNo);
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp', state: { routes: [{ name: 'Home' }] } }],
      });
    } catch (error) {
      // If the campus server is down, fall back to the last profile saved on
      // this device for the same roll number. This keeps the app usable while
      // the backend is unavailable (attendance data may be slightly stale).
      let saved: StudentData | null = null;
      try {
        const raw = await AsyncStorage.getItem('@jec_data');
        if (raw) saved = JSON.parse(raw) as StudentData;
      } catch {
        saved = null;
      }

      if (saved?.rollNo?.toUpperCase() === roll) {
        setStudentData(saved);
        setRollNumber(saved.rollNo);
        Alert.alert(
          'Offline mode',
          'The campus server is unavailable. You are using the profile last saved on this device.',
          [
            {
              text: 'Continue',
              onPress: () =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainApp', state: { routes: [{ name: 'Home' }] } }],
                }),
            },
          ],
        );
      } else if (error instanceof ApiError && error.status !== 0) {
        Alert.alert('Login Failed', error.message || 'Invalid enrollment number');
      } else {
        const reason =
          error instanceof ApiError && error.message
            ? error.message
            : 'Could not reach the campus server.';
        Alert.alert(
          'Connection Problem',
          `${reason}\n\nCheck your internet connection and try again.`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // FORGOT PASSWORD LOGIC (Unchanged)
  // ==========================================
  const handleWhatsAppSupport = async () => {
    const url = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      SUPPORT_WHATSAPP_MESSAGE,
    )}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'WhatsApp Not Available',
        `Please message us on ${SUPPORT_WHATSAPP_DISPLAY}.`,
      );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#120924', '#0A0A0A']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.bgDecorationTop}>
        <Ionicons name="school" size={200} color="rgba(139, 92, 246, 0.05)" style={{ transform: [{ rotate: '15deg' }] }} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingHorizontal: horizontalPadding }
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.contentWrap}>
              
              {/* Logo Area */}
              <View style={styles.logoContainer}>
                <View style={[styles.logoGlow, { width: logoSize, height: logoSize, borderRadius: logoSize / 4 }]}>
                  <Image 
                    source={require('../../assets/logo.png')} 
                    style={{ width: logoSize * 0.8, height: logoSize * 0.8, borderRadius: logoSize / 5 }} 
                    resizeMode="contain" 
                  />
                </View>
              </View>

              <Text style={[styles.title, { fontSize: isSmallScreen ? 26 : 32 }]}>JEC Student App</Text>
              <Text style={styles.subtitle}>Your College. Our Priority.</Text>
              <View style={styles.divider} />

              {/* Main Glass Card */}
              <View style={[styles.glassCard, { padding: cardPadding }]}>
                
                {/* LOGIN FORM */}
                <Text style={styles.label}>Enrollment Number</Text>
                <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your enrollment number"
                    placeholderTextColor="#666"
                    value={identifier}
                    onChangeText={(text) => setIdentifier(text.replace(/[^A-Za-z0-9\-/.]/g, ''))}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    keyboardType="default"
                    inputMode="text"
                    autoCapitalize="characters"
                    autoCorrect={false}
                    maxLength={30}
                  />
                </View>

                <View style={styles.row}>
                  <TouchableOpacity style={styles.checkboxRow} onPress={() => setRememberMe(!rememberMe)}>
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                      {rememberMe && <Ionicons name="checkmark" size={14} color="#FFF" />}
                    </View>
                    <Text style={styles.checkboxText}>Remember Me</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowForgot(!showForgot)}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                {showForgot && (
                  <View style={styles.forgotBox}>
                    <Text style={styles.forgotTitle}>Reset Password</Text>
                    <Text style={styles.forgotHint}>
                      To reset your password, contact us on WhatsApp and send us a message.
                    </Text>
                    <TouchableOpacity style={styles.forgotNumberWrap} onPress={handleWhatsAppSupport}>
                      <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
                      <Text style={styles.forgotNumber}>{SUPPORT_WHATSAPP_DISPLAY}</Text>
                    </TouchableOpacity>
                    <View style={styles.forgotActions}>
                      <TouchableOpacity style={[styles.forgotAction, styles.forgotCancel]} onPress={() => setShowForgot(false)}>
                        <Text style={styles.forgotCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.forgotAction, styles.forgotSend]} onPress={handleWhatsAppSupport}>
                        <Ionicons name="logo-whatsapp" size={18} color="#FFF" />
                        <Text style={styles.forgotSendText}>WhatsApp</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.85}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Text style={styles.loginBtnText}>Login</Text>
                      <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.footerText}>JEC Student Portal • Access. Learn. Grow.</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', // Centers everything vertically
    paddingBottom: 40,
    paddingTop: 20,
  },
  contentWrap: { 
    width: '100%', 
    alignSelf: 'center', 
    maxWidth: 500, // Prevents the card from getting too wide on tablets
  },
  bgDecorationTop: { position: 'absolute', top: -40, right: -50, zIndex: 0 },
  
  logoContainer: { alignItems: 'center', marginBottom: 16, zIndex: 1 },
  logoGlow: {
    backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#A78BFA',
    shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 20, elevation: 15,
  },
  
  title: { fontWeight: '800', textAlign: 'center', color: '#FFF', marginBottom: 4 },
  subtitle: { fontSize: 15, textAlign: 'center', color: '#CCC', marginBottom: 12 },
  
  divider: { width: 60, height: 3, backgroundColor: '#8B5CF6', alignSelf: 'center', borderRadius: 2, marginBottom: 24 },
  
  glassCard: { 
    width: '100%',
    borderRadius: 24,
    backgroundColor: 'rgba(20, 15, 35, 0.6)', 
    borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.3)',
    marginBottom: 20,
  },

  label: { fontSize: 14, color: '#FFF', fontWeight: '600', marginBottom: 8 },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, 
    borderWidth: 1, borderColor: '#333', marginBottom: 16, paddingHorizontal: 14,
    height: 52,
  },
  inputContainerFocused: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.10)',
  },
  input: { flex: 1, color: '#FFF', fontSize: 16, paddingVertical: 0 },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#8B5CF6' },
  checkboxText: { color: '#CCC', fontSize: 13 },
  forgotText: { color: '#A78BFA', fontSize: 13, fontWeight: '600' },

  forgotBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  forgotTitle: { color: '#FFF', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  forgotHint: { color: '#AAA', fontSize: 12, marginBottom: 10, lineHeight: 17 },
  forgotNumberWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    marginBottom: 10,
  },
  forgotNumber: { color: '#25D366', fontSize: 18, fontWeight: '700', letterSpacing: 0.4 },
  forgotActions: { flexDirection: 'row', gap: 10 },
  forgotAction: { flex: 1, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  forgotCancel: { backgroundColor: 'rgba(255,255,255,0.08)' },
  forgotCancelText: { color: '#CCC', fontSize: 14, fontWeight: '600' },
  forgotSend: { backgroundColor: '#25D366', flexDirection: 'row', gap: 8 },
  forgotSendText: { color: '#FFF', fontSize: 14, fontWeight: '700' },

  loginBtn: { 
    height: 54,
    borderRadius: 14, backgroundColor: '#8B5CF6', 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6
  },
  loginBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  footerText: { color: '#555', fontSize: 12, textAlign: 'center', marginTop: 'auto', marginBottom: 10, fontWeight: '500' },
});