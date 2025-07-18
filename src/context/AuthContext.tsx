import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student } from '../types';
import { loadStudents } from '../utils/csvParser';

interface AuthContextType {
  user: User | null;
  students: Student[];
  login: (rollNumber: string, secret: string) => boolean;
  logout: () => void;
  isLoading: boolean;
  loginError: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const initializeAuth = async () => {
      // Load students data
      const studentsData = await loadStudents();
      setStudents(studentsData);
      
      // Check for stored user data
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        // Verify user still exists in students list
        const studentExists = studentsData.find(s => s.rollNumber === userData.rollNumber);
        if (studentExists) {
          setUser(userData);
        } else {
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };
    
    initializeAuth();
  }, []);

  const login = (rollNumber: string, secret: string): boolean => {
    setLoginError('');
    
    const student = students.find(s => 
      s.rollNumber === rollNumber && s.secret === secret
    );
    
    if (student) {
      const userData: User = {
        name: student.name,
        rollNumber: student.rollNumber
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } else {
      setLoginError('Invalid roll number or secret');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, students, login, logout, isLoading, loginError }}>
      {children}
    </AuthContext.Provider>
  );
};