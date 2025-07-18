import React, { useState } from 'react';
import { Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Student } from '../types';

interface StudentSelectorProps {
  selectedStudents: Student[];
  onStudentSelect: (student: Student) => void;
  onStudentRemove: (rollNumber: string) => void;
  maxStudents: number;
  excludeRollNumbers?: string[];
  currentUserRollNumber?: string;
}

const StudentSelector: React.FC<StudentSelectorProps> = ({
  selectedStudents,
  onStudentSelect,
  onStudentRemove,
  maxStudents,
  excludeRollNumbers = [],
  currentUserRollNumber
}) => {
  const { students } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const notSelected = !selectedStudents.some(s => s.rollNumber === student.rollNumber);
    const notExcluded = !excludeRollNumbers.includes(student.rollNumber);
    
    return matchesSearch && notSelected && notExcluded;
  });

  const handleStudentSelect = (student: Student) => {
    if (selectedStudents.length < maxStudents) {
      onStudentSelect(student);
      setSearchTerm('');
      setShowDropdown(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search by name or roll number..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={selectedStudents.length >= maxStudents}
          />
        </div>
        
        {/* Dropdown */}
        {showDropdown && searchTerm && filteredStudents.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredStudents.slice(0, 10).map((student) => (
              <button
                key={student.rollNumber}
                onClick={() => handleStudentSelect(student)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                disabled={selectedStudents.length >= maxStudents}
              >
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.rollNumber}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Students */}
      {selectedStudents.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Selected Students ({selectedStudents.length}/{maxStudents}):
          </p>
          <div className="space-y-2">
            {selectedStudents.map((student) => (
              <div
                key={student.rollNumber}
                className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.rollNumber}</div>
                  </div>
                </div>
                <button
                  onClick={() => onStudentRemove(student.rollNumber)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                  disabled={student.rollNumber === currentUserRollNumber}
                >
                  {student.rollNumber === currentUserRollNumber ? 'You' : 'Remove'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default StudentSelector;