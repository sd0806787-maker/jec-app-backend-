import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ImageBackground, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';
import { useStudent } from '../context/StudentContext';
import { imageUriToDataUri } from '../services/images';
import { issuesApi } from '../services/api';

export default function ReportIssueScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { studentData } = useStudent();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleBack = () => {
    goHome(navigation);
  };

  // 👇 PHOTO PICKER IS FULLY ENABLED
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
    });

    if (result.canceled) return;

    try {
      const resized = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG },
      );
      setImageUri(resized.uri);
    } catch {
      Alert.alert('Error', 'Could not process image.');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !location.trim()) {
      Alert.alert('Missing Details', 'Please fill in Title, Location, and Description.');
      return;
    }

    setIsSending(true);

    try {
      const imageBase64 = imageUri
        ? await imageUriToDataUri(imageUri)
        : undefined;

      await issuesApi.report({
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        reportedBy: studentData?.rollNo,
        imageBase64,
      });

      Alert.alert('Reported', 'Your issue has been submitted successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert(
        'Could Not Submit',
        error instanceof Error
          ? error.message
          : 'Please check your connection and try again.',
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Report Issue</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* 👇 Upload Box */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
          {imageUri ? (
            <ImageBackground source={{ uri: imageUri }} style={styles.imagePreview} imageStyle={{ borderRadius: 20 }}>
              <View style={styles.imageOverlay}>
                <View style={styles.changePhotoBtn}>
                  <Ionicons name="camera" size={16} color="#FFF" />
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 13 }}>Change Photo</Text>
                </View>
              </View>
            </ImageBackground>
          ) : (
            <View style={[styles.uploadCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
                <Ionicons name="images" size={32} color={theme.primary} />
              </View>
              <Text style={[styles.uploadTitle, { color: theme.text }]}>Upload Photo</Text>
              <Text style={[styles.uploadSubtitle, { color: theme.textSecondary }]}>
                Tap here to attach a picture
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Issue Title</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
          placeholder="e.g., Broken Fan"
          placeholderTextColor={theme.textSecondary}
          value={title} onChangeText={setTitle}
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>Location</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
          placeholder="e.g., Library"
          placeholderTextColor={theme.textSecondary}
          value={location} onChangeText={setLocation}
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
          placeholder="Describe the issue..."
          placeholderTextColor={theme.textSecondary}
          multiline numberOfLines={4} textAlignVertical="top"
          value={description} onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.submitWrapper} onPress={handleSubmit} disabled={isSending}>
          <LinearGradient colors={isSending ? ['#4B5563', '#374151'] : ['#8B5CF6', '#6D28D9']} style={styles.gradientBtn}>
            {isSending ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Submit Issue</Text>}
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

  imagePicker: { marginBottom: 24 },
  uploadCard: { height: 180, borderRadius: 24, borderWidth: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  uploadTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  uploadSubtitle: { fontSize: 13, textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },

  imagePreview: { height: 220, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 16 },
  imageOverlay: { backgroundColor: 'rgba(0,0,0,0.4)', width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 16, borderRadius: 24 },
  changePhotoBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },

  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 8 },
  input: { height: 50, borderRadius: 14, paddingHorizontal: 16, fontSize: 15, borderWidth: 1, marginBottom: 16 },
  textArea: { height: 120, paddingTop: 12, paddingBottom: 12 },

  submitWrapper: { marginTop: 16, shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 10 },
  gradientBtn: { height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#FFF', fontSize: 17, fontWeight: 'bold', letterSpacing: 0.5 },
});