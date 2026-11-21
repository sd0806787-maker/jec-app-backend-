import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CieMark =
  | number
  | { marks?: number; maximum?: number; absent?: boolean }
  | null;

// 1. Define the Subject Interface
export interface SubjectData {
  id: string;
  name: string;
  percentage: number;
  status?: string;
  attended: number; 
  recorded: number;
  cie?: CieMark[]; 
}

// 2. Define the Student Interface
export interface StudentData {
  name: string;
  rollNo: string;
  semester: string;
  branchKey: string; // e.g., 'CSE', 'ME', 'CE'
  branch: string;    // e.g., 'Computer Science and Engineering'
  status: string;
  subjectsCount: number;
  overallAttendance: number;
  attendedClasses: number;
  conductedClasses: number;
  section?: string;
  academicYear?: string;
  subjects: SubjectData[];
}

// 3. Define the Context Data
interface StudentContextData {
  studentData: StudentData | null;
  setStudentData: (data: StudentData | null) => void;
  rollNumber: string;
  setRollNumber: (roll: string) => void;
  isLoading: boolean;
}

// 4. Create Context
const StudentContext = createContext<StudentContextData>({} as StudentContextData);

// 5. Create Provider
export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [rollNumber, setRollNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Restore the last signed-in profile so the app still opens when the campus
  // server is unreachable (the login screen writes both keys on success).
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [savedRoll, savedData] = await Promise.all([
          AsyncStorage.getItem('@jec_roll'),
          AsyncStorage.getItem('@jec_data'),
        ]);
        if (mounted && savedRoll && savedData) {
          setRollNumber(savedRoll);
          setStudentData(JSON.parse(savedData) as StudentData);
        }
      } catch {
        // A corrupted cache should simply send the user to the login screen.
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <StudentContext.Provider
      value={{ studentData, setStudentData, rollNumber, setRollNumber, isLoading }}
    >
      {children}
    </StudentContext.Provider>
  );
};

// 6. Create Hook
export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};