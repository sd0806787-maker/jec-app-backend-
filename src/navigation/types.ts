import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';

// 1. Define the Stack (Root) screens
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainApp: NavigatorScreenParams<RootTabParamList> | undefined;
  Announcements: undefined; 
};

// 2. Define the Bottom Tab screens
export type RootTabParamList = {
  Home: undefined;
  Academics: NavigatorScreenParams<AcademicsStackParamList>;
  Holiday: undefined; 
  Profile: undefined;
};

// 3. Define the Stack INSIDE the Academics Tab
export type AcademicsStackParamList = {
  AcademicsMenu: undefined;
  Attendance: undefined;
  Calculator: undefined;
  AttendanceCalculator: undefined;
  CIEMarks: undefined;
  NCDCStatus: undefined;
  Timetable: undefined;
  Notes: undefined;
  Toppers: undefined;
  Syllabus: undefined;
  StudyPlanner: undefined;
  
  // Issues Flow
  Issues: undefined;
  ReportIssue: undefined;
  IssueDetails: { issueId: string }; 
  
  // Lost & Found Flow
  LostFound: undefined; 
  ReportLostItem: undefined;
  LostFoundDetails: { itemId: string }; 
  
  // Other
  CompanyCriteria: undefined;
  Roadmap: undefined;
  RoadmapDetail: { roadmapId: string };
  CIEAnalytics: undefined;
  MedicalLeave: undefined;
  HostelManagement: undefined;
  SOS: undefined;
};

// 4. Export navigation prop types
export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export type HomeScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;
export type AcademicsScreenNavigationProp = NativeStackNavigationProp<AcademicsStackParamList, 'AcademicsMenu'>;
export type AttendanceScreenNavigationProp = NativeStackNavigationProp<AcademicsStackParamList, 'Attendance'>;
export type CalculatorScreenNavigationProp = NativeStackNavigationProp<AcademicsStackParamList, 'Calculator'>;
export type CIEMarksScreenNavigationProp = NativeStackNavigationProp<AcademicsStackParamList, 'CIEMarks'>;
export type NCDCStatusScreenNavigationProp = NativeStackNavigationProp<AcademicsStackParamList, 'NCDCStatus'>;
export type AnnouncementsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Announcements'>;