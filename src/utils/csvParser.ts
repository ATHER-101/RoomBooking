import { Student } from '../types';

export const parseCSV = (csvText: string): Student[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const student: Student = {
      email: values[0],
      name: values[1],
      rollNumber: values[2],
      secret: values[3]
    };
    return student;
  });
};

export const loadStudents = async (): Promise<Student[]> => {
  try {
    const response = await fetch('/src/data/s.csv');
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading students:', error);
    return [];
  }
};