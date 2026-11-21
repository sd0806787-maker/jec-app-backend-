import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';
import { Ionicons } from '@expo/vector-icons';

export default function CalculatorScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [total, setTotal] = useState<string>('');
  const [attended, setAttended] = useState<string>('');
  const [target, setTarget] = useState<string>('75');
  const [result, setResult] = useState<{ type: 'success' | 'warning' | 'info', message: string } | null>(null);

  const calculate = () => {
    const t = parseInt(total);
    const a = parseInt(attended);
    const tg = parseInt(target);

    // Validation
    if (isNaN(t) || isNaN(a) || isNaN(tg) || t <= 0 || a < 0 || tg <= 0 || tg > 100) {
      Alert.alert('Invalid Input', 'Please enter valid numbers. Total must be > 0 and Target must be between 1 and 100.');
      return;
    }
    if (a > t) {
      Alert.alert('Invalid Input', 'Attended classes cannot be greater than total classes.');
      return;
    }

    const currentPerc = (a / t) * 100;

    if (currentPerc >= tg) {
      // Safe Math Formula: How many can I miss?
      // We want (a / (t + miss)) * 100 >= tg
      const canMiss = Math.floor((a * 100 - tg * t) / tg);
      
      if (canMiss <= 0) {
        setResult({ 
          type: 'warning', 
          message: `Your current attendance is ${currentPerc.toFixed(1)}%. You are on the edge — do not miss any classes!` 
        });
      } else {
        setResult({ 
          type: 'success', 
          message: `Your current attendance is ${currentPerc.toFixed(1)}%.\n\nYou can safely miss ${canMiss} more class${canMiss > 1 ? 'es' : ''}.` 
        });
      }
    } else {
      // Safe Math Formula: How many consecutive do I need to attend?
      // We want ((a + need) / (t + need)) * 100 >= tg
      const need = Math.ceil((tg * t - 100 * a) / (100 - tg));
      
      setResult({ 
        type: 'info', 
        message: `Your current attendance is ${currentPerc.toFixed(1)}%.\n\nYou need to attend ${need} consecutive class${need > 1 ? 'es' : ''} to reach ${tg}%.` 
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: theme.background }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => goHome(navigation)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Attendance Calculator</Text>
        </View>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Calculate how many classes you need to attend to reach your target percentage, or how many you can safely miss.
        </Text>

        {/* Input Card */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          
          <Text style={[styles.label, { color: theme.text }]}>Total Classes Conducted</Text>
          <TextInput 
            placeholder="e.g. 100" 
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric" 
            value={total} 
            onChangeText={setTotal} 
            style={[styles.input, { backgroundColor: theme.cardDarker, color: theme.text, borderColor: theme.border }]} 
          />

          <Text style={[styles.label, { color: theme.text }]}>Classes Attended</Text>
          <TextInput 
            placeholder="e.g. 75" 
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric" 
            value={attended} 
            onChangeText={setAttended} 
            style={[styles.input, { backgroundColor: theme.cardDarker, color: theme.text, borderColor: theme.border }]} 
          />

          <Text style={[styles.label, { color: theme.text }]}>Target Percentage (%)</Text>
          <TextInput 
            placeholder="e.g. 75" 
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric" 
            value={target} 
            onChangeText={setTarget} 
            style={[styles.input, { backgroundColor: theme.cardDarker, color: theme.text, borderColor: theme.border }]} 
          />

        </View>

        {/* Calculate Button */}
        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={calculate}>
          <Text style={styles.btnText}>Calculate</Text>
        </TouchableOpacity>

        {/* Result Card */}
        {result && (
          <View style={[
            styles.resultCard, 
            { 
              backgroundColor: theme.card,
              borderColor: result.type === 'success' ? theme.success : result.type === 'warning' ? theme.warning : theme.primary,
              borderLeftWidth: 5
            }
          ]}>
            <Ionicons 
              name={result.type === 'success' ? 'checkmark-circle' : result.type === 'warning' ? 'warning' : 'information-circle'} 
              size={28} 
              color={result.type === 'success' ? theme.success : result.type === 'warning' ? theme.warning : theme.primary} 
            />
            <Text style={[styles.resultText, { color: theme.text }]}>
              {result.message}
            </Text>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 10 },
  backBtn: { marginRight: 15 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  card: { borderRadius: 16, padding: 20, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 10 },
  input: { 
    height: 50, 
    borderRadius: 10, 
    paddingHorizontal: 16, 
    fontSize: 16, 
    borderWidth: 1, 
    marginBottom: 10 
  },
  btn: { 
    height: 54, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20 
  },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  resultCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  resultText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    lineHeight: 22,
  }
});