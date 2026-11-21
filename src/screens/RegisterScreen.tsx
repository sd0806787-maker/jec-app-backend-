import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { apiRequest } from '../services/api';

export default function RegisterScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [roll, setRoll] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          roll,
          name,
          branch,
          semester: parseInt(semester, 10),
          password,
        }),
      });

      Alert.alert('Success', 'Account created! Please login.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Network error',
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
      <TextInput style={[styles.input, { backgroundColor: theme.card, color: theme.text }]} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={[styles.input, { backgroundColor: theme.card, color: theme.text }]} placeholder="Roll Number" value={roll} onChangeText={setRoll} />
      <TextInput style={[styles.input, { backgroundColor: theme.card, color: theme.text }]} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={[styles.input, { backgroundColor: theme.card, color: theme.text }]} placeholder="Branch" value={branch} onChangeText={setBranch} />
      <TextInput style={[styles.input, { backgroundColor: theme.card, color: theme.text }]} placeholder="Semester" value={semester} onChangeText={setSemester} keyboardType="numeric" />
      <TextInput style={[styles.input, { backgroundColor: theme.card, color: theme.text }]} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      
      <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={handleRegister}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ color: theme.primary, marginTop: 15, textAlign: 'center' }}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 30 },
  input: { height: 56, borderRadius: 12, paddingHorizontal: 16, fontSize: 16, marginBottom: 16 },
  btn: { height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});