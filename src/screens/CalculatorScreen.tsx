// src/screens/AttendanceCalculatorScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export function CalculatorScreen() {
  const { theme } = useTheme();
  const [total, setTotal] = useState<string>('');
  const [attended, setAttended] = useState<string>('');
  const [target, setTarget] = useState<string>('75');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const t = parseInt(total);
    const a = parseInt(attended);
    const tg = parseInt(target);

    if (isNaN(t) || isNaN(a) || isNaN(tg) || t <= 0 || a > t || tg <= 0 || tg > 100) {
      Alert.alert('Invalid Input', 'Please enter valid numbers. Attended cannot exceed total.');
      return;
    }

    const currentPerc = (a / t) * 100;
    
    if (currentPerc >= tg) {
      let canMiss = 0;
      while ((a / (t + canMiss + 1)) * 100 >= tg) {
        canMiss++;
      }
      setResult(`You can miss ${canMiss} classes.`);
    } else {
      let need = 0;
      while (((a + need) / (t + need)) * 100 < tg) {
        need++;
      }
      setResult(`You need to attend ${need} consecutive classes.`);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.background }}>
      <TextInput 
        placeholder="Total Classes" 
        placeholderTextColor={theme.textSecondary}
        keyboardType="numeric" 
        value={total} 
        onChangeText={setTotal} 
        style={[styles.input, { backgroundColor: theme.card, color: theme.text }]} 
      />
      <TextInput 
        placeholder="Attended Classes" 
        placeholderTextColor={theme.textSecondary}
        keyboardType="numeric" 
        value={attended} 
        onChangeText={setAttended} 
        style={[styles.input, { backgroundColor: theme.card, color: theme.text }]} 
      />
      <TextInput 
        placeholder="Target %" 
        placeholderTextColor={theme.textSecondary}
        keyboardType="numeric" 
        value={target} 
        onChangeText={setTarget} 
        style={[styles.input, { backgroundColor: theme.card, color: theme.text }]} 
      />
      <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={calculate}>
        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Calculate</Text>
      </TouchableOpacity>
      {result && <Text style={{ color: theme.success, fontSize: 18, marginTop: 20, textAlign: 'center' }}>{result}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  input: { padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  btn: { padding: 15, borderRadius: 10, alignItems: 'center' },
});