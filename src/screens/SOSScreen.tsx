import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Animated, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';

const EMERGENCY_CONTACTS = [
  { id: '1', title: 'Campus Security', number: '+919876543210', icon: 'shield-checkmark', color: '#EF4444' }, // Replace with real number
  { id: '2', title: 'Police', number: '100', icon: 'shield', color: '#3B82F6' },
  { id: '3', title: 'Ambulance', number: '108', icon: 'medical', color: '#10B981' },
  { id: '4', title: 'Women Helpline', number: '1091', icon: 'female', color: '#F59E0B' },
];

export default function SOSScreen({ navigation }: any) {
  const { theme } = useTheme();
  
  // Animation values for the pulsing SOS button
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const [progressAnim] = useState(() => new Animated.Value(0));
  const [isHolding, setIsHolding] = useState(false);

  // Pulsing effect loop
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert('Error', 'Could not open the dialer.');
    });
  };

  const startHold = () => {
    setIsHolding(true);
    // Animate the progress bar over 3 seconds
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        // Triggered!
        setIsHolding(false);
        progressAnim.setValue(0);
        handleCall(EMERGENCY_CONTACTS[0].number);
        Alert.alert("SOS TRIGGERED", "Calling Campus Security immediately...");
      }
    });
  };

  const cancelHold = () => {
    setIsHolding(false);
    // Cancel animation and reset
    progressAnim.stopAnimation();
    Animated.timing(progressAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goHome(navigation)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Emergency SOS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={24} color="#EF4444" />
          <Text style={[styles.warningText, { color: theme.text }]}>
            Use this only in case of real emergencies, fights, or medical issues during the fest.
          </Text>
        </View>

        {/* 👇 HOLD TO TRIGGER SOS BUTTON 👇 */}
        <View style={styles.sosContainer}>
          <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
          
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={startHold}
            onPressOut={cancelHold}
            style={styles.sosButton}
          >
            <LinearGradient
              colors={isHolding ? ['#DC2626', '#991B1B'] : ['#EF4444', '#B91C1C']}
              style={styles.sosGradient}
            >
              <Ionicons name="hand-left" size={48} color="#FFF" />
              <Text style={styles.sosText}>{isHolding ? 'HOLD...' : 'HOLD'}</Text>
              <Text style={styles.sosSubtext}>to call</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Progress Bar for Holding */}
        <View style={[styles.progressBg, { backgroundColor: theme.card }]}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }
            ]} 
          />
        </View>

        {/* Quick Dial Contacts */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 40 }]}>Quick Dial Contacts</Text>
        <View style={styles.gridContainer}>
          {EMERGENCY_CONTACTS.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={[styles.contactCard, { backgroundColor: theme.card, borderColor: 'rgba(255,255,255,0.05)' }]}
              onPress={() => handleCall(contact.number)}
              activeOpacity={0.7}
            >
              <View style={[styles.contactIconBg, { backgroundColor: `${contact.color}15` }]}>
                <Ionicons name={contact.icon as any} size={28} color={contact.color} />
              </View>
              <Text style={[styles.contactTitle, { color: theme.text }]}>{contact.title}</Text>
              <Text style={[styles.contactNumber, { color: theme.textSecondary }]}>Tap to call</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  backBtn: { marginRight: 15, padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100, alignItems: 'center' },
  
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 40,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    width: '100%',
  },
  warningText: { flex: 1, marginLeft: 12, fontSize: 13, lineHeight: 18, fontWeight: '500' },

  sosContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 240,
    height: 240,
    marginBottom: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  sosButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  sosGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sosText: { color: '#FFF', fontSize: 32, fontWeight: '900', letterSpacing: 2, marginTop: 8 },
  sosSubtext: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 'bold' },

  progressBg: { width: '80%', height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 10 },
  progressFill: { height: '100%', backgroundColor: '#EF4444', borderRadius: 4 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, alignSelf: 'flex-start' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, width: '100%' },
  contactCard: {
    width: '47%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  contactIconBg: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  contactTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
  contactNumber: { fontSize: 12, fontWeight: '500' },
});