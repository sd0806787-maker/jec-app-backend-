import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as MailComposer from 'expo-mail-composer';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';
import { useStudent } from '../context/StudentContext';

import { CONTENT_BASE_URL } from '../services/api';

const PROFESSORS_URL = `${CONTENT_BASE_URL}/professors.json`;

const FALLBACK_PROFESSORS = [
  { name: 'Dr. A. Sharma', email: 'a.sharma@jecassam.ac.in', designation: 'Professor' },
  { name: 'Prof. B. Das', email: 'b.das@jecassam.ac.in', designation: 'Assistant Professor' },
];

interface Professor {
  name: string;
  email: string;
  designation: string;
}

export default function MedicalLeaveScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { studentData } = useStudent();

  const [reason, setReason] = useState('');
  const [professors, setProfessors] = useState<Professor[]>(FALLBACK_PROFESSORS);
  const [selectedProf, setSelectedProf] = useState<Professor>(FALLBACK_PROFESSORS[0]);
  const [isLoadingProfs, setIsLoadingProfs] = useState(true);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');

  const [pdfFile, setPdfFile] = useState<any>(null);
  const [showProfDropdown, setShowProfDropdown] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const res = await fetch(`${PROFESSORS_URL}?t=${new Date().getTime()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (data.professors && Array.isArray(data.professors) && data.professors.length > 0) {
          const formatted = data.professors.map((p: any) => ({
            name: p.name,
            email: p.email,
            designation: p.designation || 'Faculty',
          }));
          setProfessors(formatted);
          setSelectedProf(formatted[0]);
        }
      } catch {
        console.log('Using fallback professors due to network error');
      } finally {
        setIsLoadingProfs(false);
      }
    };
    fetchProfessors();
  }, []);

  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (!result.canceled) {
        setPdfFile(result.assets[0]);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      if (pickerMode === 'start') {
        setStartDate(selectedDate);
        if (selectedDate > endDate) setEndDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const openPicker = (mode: 'start' | 'end') => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const handleSubmit = async () => {
    if (!reason.trim() || !pdfFile) {
      Alert.alert('Missing Details', 'Please provide a reason and upload your medical PDF.');
      return;
    }

    if (endDate < startDate) {
      Alert.alert('Invalid Dates', 'End date cannot be before the start date.');
      return;
    }

    setIsSending(true);

    try {
      // 👇 Check if an email app is available
      const isAvailable = await MailComposer.isAvailableAsync();
      
      if (!isAvailable) {
        // 👇 SHOW PROTOTYPE MESSAGE IF NO MAIL APP FOUND
        Alert.alert(
          "Feature Disabled", 
          "The email feature is currently disabled since this is a prototype or no email app is installed on your device."
        );
        return;
      }

      const startStr = startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const endStr = endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const dateRangeText = startStr === endStr ? startStr : `${startStr} to ${endStr}`;

      await MailComposer.composeAsync({
        recipients: [selectedProf.email],
        subject: `Medical Leave Application - ${studentData?.name} (${studentData?.rollNo})`,
        body: `Dear ${selectedProf.name},\n\nI am writing to inform you that I was absent on the following dates: ${dateRangeText}.\n\nReason: ${reason}\n\nPlease find my medical certificate attached.\n\nRegards,\n${studentData?.name}\nRoll No: ${studentData?.rollNo}`,
        attachments: [pdfFile.uri],
      });
      
      navigation.goBack();

    } catch {
      // 👇 CATCH ANY OTHER EMAIL ERRORS
      Alert.alert(
        "Notice", 
        "The email feature is currently disabled since this is a prototype or no email app is installed."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goHome(navigation)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Medical Leave</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.dateRow}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Start Date</Text>
            <TouchableOpacity style={[styles.input, { backgroundColor: theme.card, flexDirection: 'row', alignItems: 'center' }]} onPress={() => openPicker('start')}>
              <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} style={{ marginRight: 8 }} />
              <Text style={{ color: theme.text, fontSize: 14 }}>
                {startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>End Date</Text>
            <TouchableOpacity style={[styles.input, { backgroundColor: theme.card, flexDirection: 'row', alignItems: 'center' }]} onPress={() => openPicker('end')}>
              <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} style={{ marginRight: 8 }} />
              <Text style={{ color: theme.text, fontSize: 14 }}>
                {endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showPicker && (
          <DateTimePicker
            value={pickerMode === 'start' ? startDate : endDate}
            mode="date"
            display="default"
            minimumDate={pickerMode === 'end' ? startDate : undefined}
            onChange={handleDateChange}
          />
        )}

        <Text style={[styles.label, { color: theme.textSecondary, marginTop: 10 }]}>Select Professor</Text>
        <TouchableOpacity style={[styles.input, { backgroundColor: theme.card, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]} onPress={() => setShowProfDropdown(!showProfDropdown)}>
          {isLoadingProfs ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Loading professors...</Text>
            </View>
          ) : (
            <Text style={{ color: theme.text, fontSize: 15 }} numberOfLines={1}>
              {selectedProf.name}
            </Text>
          )}
          <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
        
        {showProfDropdown && !isLoadingProfs && (
          <View style={[styles.dropdown, { backgroundColor: theme.card }]}>
            <ScrollView style={{ maxHeight: 220 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
              {professors.map((prof, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.dropdownItem} 
                  onPress={() => { setSelectedProf(prof); setShowProfDropdown(false); }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: theme.text, fontWeight: '600' }}>{prof.name}</Text>
                    <Text style={{ color: theme.primary, fontSize: 11, fontWeight: 'bold' }}>{prof.designation}</Text>
                  </View>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>{prof.email}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <Text style={[styles.label, { color: theme.textSecondary }]}>Reason for Absence</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: theme.card, color: theme.text }]}
          placeholder="Describe your medical reason..."
          placeholderTextColor={theme.textSecondary}
          multiline
          value={reason}
          onChangeText={setReason}
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>Medical Certificate (PDF)</Text>
        <TouchableOpacity style={[styles.uploadBox, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={pickPdf}>
          <Ionicons name={pdfFile ? "document-text" : "cloud-upload-outline"} size={32} color={theme.primary} />
          <Text style={{ color: pdfFile ? theme.text : theme.textSecondary, marginTop: 8 }} numberOfLines={1}>
            {pdfFile ? pdfFile.name : 'Tap to upload PDF'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitWrapper} onPress={handleSubmit} disabled={isLoadingProfs || isSending}>
          <LinearGradient colors={isLoadingProfs || isSending ? ['#4B5563', '#374151'] : ['#8B5CF6', '#6D28D9']} style={styles.gradientBtn}>
            {isLoadingProfs || isSending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.submitText}>Open Mail App</Text>
                <Ionicons name="mail" size={18} color="#FFF" style={{ marginLeft: 8 }} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backBtn: { marginRight: 15, padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 8 },
  input: { height: 54, borderRadius: 14, paddingHorizontal: 16, fontSize: 15, borderWidth: 1, borderColor: 'transparent', marginBottom: 16 },
  textArea: { height: 120, paddingTop: 16, textAlignVertical: 'top' },
  dropdown: { borderRadius: 14, padding: 10, marginBottom: 16, position: 'absolute', top: 230, left: 20, right: 20, zIndex: 10, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
  dropdownItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  uploadBox: { height: 120, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 24, paddingHorizontal: 16 },
  submitWrapper: { marginTop: 16, shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 10 },
  gradientBtn: { height: 60, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  submitText: { color: '#FFF', fontSize: 17, fontWeight: 'bold', letterSpacing: 0.5 },
});