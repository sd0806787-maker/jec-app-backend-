import React, { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useStudent } from '../context/StudentContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Import Types
import { RootStackParamList, RootTabParamList, AcademicsStackParamList } from './types';

// Import Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AcademicsScreen from '../screens/AcademicsScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import CIEMarksScreen from '../screens/CIEMarksScreen';
import CIEAnalyticsScreen from '../screens/CIEAnalyticsScreen'; 
import AttendanceCalculatorScreen from '../screens/AttendanceCalculatorScreen'; 
import ProfileScreen from '../screens/ProfileScreen';
import HolidayScreen from '../screens/HolidayScreen';
import TimetableScreen from '../screens/TimetableScreen';
import NotesScreen from '../screens/NotesScreen';
import ToppersScreen from '../screens/ToppersScreen';
import AnnouncementsScreen from '../screens/AnnouncementsScreen'; 
import SyllabusScreen from '../screens/SyllabusScreen';
import StudyPlannerScreen from '../screens/StudyPlannerScreen'; 

// Issues & LostFound
import IssuesScreen from '../screens/IssuesScreen';
import ReportIssueScreen from '../screens/ReportIssueScreen';
import IssueDetailsScreen from '../screens/IssueDetailsScreen';
import LostFoundScreen from '../screens/LostFoundScreen';
import ReportLostItemScreen from '../screens/ReportLostItemScreen';
import LostFoundDetailsScreen from '../screens/LostFoundDetailsScreen';

// Other Features
import CompanyCriteriaScreen from '../screens/CompanyCriteriaScreen';
import RoadmapScreen from '../screens/RoadmapScreen';
import RoadmapDetailScreen from '../screens/RoadmapDetailScreen';
import MedicalLeaveScreen from '../screens/MedicalLeaveScreen';
import HostelManagementScreen from '../screens/HostelManagementScreen';
import SOSScreen from '../screens/SOSScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const AcademicsStackNav = createNativeStackNavigator<AcademicsStackParamList>();

function AcademicsStack() {
  return (
    <AcademicsStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AcademicsStackNav.Screen name="AcademicsMenu" component={AcademicsScreen} />
      <AcademicsStackNav.Screen name="Attendance" component={AttendanceScreen} />
      <AcademicsStackNav.Screen name="CIEMarks" component={CIEMarksScreen} />
      <AcademicsStackNav.Screen name="CIEAnalytics" component={CIEAnalyticsScreen} />
      <AcademicsStackNav.Screen name="Calculator" component={AttendanceCalculatorScreen} />
      <AcademicsStackNav.Screen name="AttendanceCalculator" component={AttendanceCalculatorScreen} />
      <AcademicsStackNav.Screen name="Timetable" component={TimetableScreen} />
      <AcademicsStackNav.Screen name="Notes" component={NotesScreen} />
      <AcademicsStackNav.Screen name="Toppers" component={ToppersScreen} />
      <AcademicsStackNav.Screen name="Syllabus" component={SyllabusScreen} />
      <AcademicsStackNav.Screen name="StudyPlanner" component={StudyPlannerScreen} />
      
      {/* Issues Flow */}
      <AcademicsStackNav.Screen name="Issues" component={IssuesScreen} />
      <AcademicsStackNav.Screen name="ReportIssue" component={ReportIssueScreen} />
      <AcademicsStackNav.Screen name="IssueDetails" component={IssueDetailsScreen} />
      
      {/* Lost & Found Flow */}
      <AcademicsStackNav.Screen name="LostFound" component={LostFoundScreen} />
      <AcademicsStackNav.Screen name="ReportLostItem" component={ReportLostItemScreen} />
      <AcademicsStackNav.Screen name="LostFoundDetails" component={LostFoundDetailsScreen} />
      
      {/* Other */}
      <AcademicsStackNav.Screen name="CompanyCriteria" component={CompanyCriteriaScreen} />
      <AcademicsStackNav.Screen name="Roadmap" component={RoadmapScreen} />
      <AcademicsStackNav.Screen name="RoadmapDetail" component={RoadmapDetailScreen} />
      <AcademicsStackNav.Screen name="MedicalLeave" component={MedicalLeaveScreen} />
      <AcademicsStackNav.Screen name="HostelManagement" component={HostelManagementScreen} />
      <AcademicsStackNav.Screen name="SOS" component={SOSScreen} />
    </AcademicsStackNav.Navigator>
  );
}

function MainTabs() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets(); 
  const navigation = useNavigation<any>();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = (): boolean => {
        const state = navigation.getState();
        if (!state) return false;

        const mainAppRoute = state.routes.find((r: any) => r.name === 'MainApp');
        const tabState = mainAppRoute?.state;
        if (!tabState) return false;

        const activeTabName = tabState.routes[tabState.index]?.name;

        if (activeTabName && activeTabName !== 'Home') {
          navigation.navigate('MainApp', { screen: 'Home' });
          return true; 
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="firstRoute"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: theme.tabBar, 
          borderTopWidth: 0, 
          elevation: 0, 
          height: 65 + insets.bottom, 
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          paddingTop: 8,
          position: 'absolute', bottom: 0, left: 0, right: 0,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Academics') iconName = 'school';
          else if (route.name === 'Holiday') iconName = 'calendar-clear';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Academics" component={AcademicsStack} />
      <Tab.Screen name="Holiday" component={HolidayScreen} /> 
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { studentData, isLoading } = useStudent();

  if (isLoading) return null;

  return (
    <Stack.Navigator
      initialRouteName={studentData ? 'MainApp' : 'Login'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainApp" component={MainTabs} />
      <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
    </Stack.Navigator>
  );
}