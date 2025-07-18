import { Student } from '../types';
import studentsData from '../data/students.json';

export const loadStudents = async (): Promise<Student[]> => {
  try {
    // Return the imported JSON data directly
    return studentsData;
  } catch (error) {
    console.error('Error loading students:', error);
    return [];
  }
};