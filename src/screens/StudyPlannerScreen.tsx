import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { goHome } from '../navigation/goHome';

interface Task {
  id: string;
  title: string;
  subject: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export default function StudyPlannerScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // Load tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const saved = await AsyncStorage.getItem('@study_tasks');
        if (saved) setTasks(JSON.parse(saved));
      } catch { console.log("Error loading tasks"); }
    };
    loadTasks();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    AsyncStorage.setItem('@study_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!title.trim() || !subject.trim() || !date.trim()) {
      Alert.alert("Missing Info", "Please fill in Task, Subject, and Due Date.");
      return;
    }
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      subject,
      date,
      priority,
      completed: false
    };
    setTasks([newTask, ...tasks]);
    setTitle(''); setSubject(''); setDate(''); setPriority('Medium');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setTasks(tasks.filter(t => t.id !== id)) }
    ]);
  };

  const getPriorityColor = (p: string) => {
    if (p === 'High') return '#F87171'; // Red
    if (p === 'Medium') return '#FBBF24'; // Yellow
    return '#34D399'; // Green
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goHome(navigation)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Study Planner</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Track your assignments and goals</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Progress Card */}
          <View style={[styles.progressCard, { backgroundColor: theme.card }]}>
            <View style={styles.progressInfo}>
              <Text style={[styles.progressTitle, { color: theme.textSecondary }]}>Total Progress</Text>
              <Text style={[styles.progressValue, { color: theme.text }]}>{progress}%</Text>
              <Text style={[styles.progressSub, { color: theme.textSecondary }]}>{completedCount} of {tasks.length} tasks done</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: theme.cardDarker }]}>
              <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: theme.primary }]} />
            </View>
          </View>

          {/* Add Task Form */}
          <View style={[styles.formCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.formTitle, { color: theme.text }]}>Add New Task</Text>
            
            <TextInput 
              style={[styles.input, { backgroundColor: theme.cardDarker, color: theme.text, borderColor: theme.border }]}
              placeholder="Task (e.g., Submit DBMS Assignment)"
              placeholderTextColor={theme.textSecondary}
              value={title} onChangeText={setTitle}
            />
            
            <View style={styles.row}>
              <TextInput 
                style={[styles.input, { flex: 1, marginRight: 10, backgroundColor: theme.cardDarker, color: theme.text, borderColor: theme.border }]}
                placeholder="Subject"
                placeholderTextColor={theme.textSecondary}
                value={subject} onChangeText={setSubject}
              />
              <TextInput 
                style={[styles.input, { flex: 1, backgroundColor: theme.cardDarker, color: theme.text, borderColor: theme.border }]}
                placeholder="Due Date"
                placeholderTextColor={theme.textSecondary}
                value={date} onChangeText={setDate}
              />
            </View>

            {/* Priority Selector */}
            <View style={styles.priorityRow}>
              {['High', 'Medium', 'Low'].map((p) => (
                <TouchableOpacity 
                  key={p}
                  style={[styles.priorityBtn, { backgroundColor: priority === p ? getPriorityColor(p) + '30' : theme.cardDarker, borderColor: priority === p ? getPriorityColor(p) : 'transparent' }]}
                  onPress={() => setPriority(p as any)}
                >
                  <Text style={{ color: priority === p ? getPriorityColor(p) : theme.textSecondary, fontWeight: 'bold' }}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.primary }]} onPress={addTask}>
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={{ color: '#FFF', fontWeight: 'bold', marginLeft: 6 }}>Add Task</Text>
            </TouchableOpacity>
          </View>

          {/* Task List */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Tasks</Text>
          {tasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-done-circle-outline" size={48} color={theme.textSecondary} />
              <Text style={{ color: theme.textSecondary, marginTop: 12 }}>No tasks yet. Add one above!</Text>
            </View>
          ) : (
            tasks.map((task) => (
              <View key={task.id} style={[styles.taskCard, { backgroundColor: theme.card, opacity: task.completed ? 0.6 : 1 }]}>
                <TouchableOpacity onPress={() => toggleTask(task.id)} style={styles.checkbox}>
                  <Ionicons name={task.completed ? "checkbox" : "square-outline"} size={24} color={task.completed ? theme.success : theme.textSecondary} />
                </TouchableOpacity>
                
                <View style={styles.taskInfo}>
                  <Text style={[styles.taskTitle, { color: theme.text, textDecorationLine: task.completed ? 'line-through' : 'none' }]}>
                    {task.title}
                  </Text>
                  <View style={styles.taskDetails}>
                    <Text style={[styles.taskSub, { color: theme.textSecondary }]}>{task.subject} · {task.date}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
                      <Text style={{ color: getPriorityColor(task.priority), fontSize: 10, fontWeight: 'bold' }}>{task.priority}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={20} color={theme.danger} />
                </TouchableOpacity>
              </View>
            ))
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backBtn: { marginRight: 15, padding: 5, marginLeft: -5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 13, marginTop: 4 },
  scrollContent: { paddingHorizontal: 20 },
  
  // Progress Card
  progressCard: { borderRadius: 20, padding: 20, marginBottom: 20 },
  progressInfo: { marginBottom: 16 },
  progressTitle: { fontSize: 14, fontWeight: '600' },
  progressValue: { fontSize: 36, fontWeight: 'bold', marginVertical: 4 },
  progressSub: { fontSize: 12 },
  progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },

  // Form
  formCard: { borderRadius: 20, padding: 20, marginBottom: 24 },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  input: { height: 50, borderRadius: 12, paddingHorizontal: 16, fontSize: 14, borderWidth: 1, marginBottom: 12 },
  row: { flexDirection: 'row' },
  priorityRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  priorityBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
  addBtn: { height: 50, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },

  // Task List
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  taskCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12 },
  checkbox: { marginRight: 12 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  taskDetails: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  taskSub: { fontSize: 12 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  deleteBtn: { padding: 8, marginLeft: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
});