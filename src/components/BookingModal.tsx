import React, { useState, useEffect } from 'react';
import { X, Users, MapPin } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Student } from '../types';
import StudentSelector from './StudentSelector';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { user, students } = useAuth();
  const { 
    selectedRoom, 
    isRoomAvailable, 
    bookRoom,
    canUserBook
  } = useBooking();
  
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && isOpen && students.length > 0) {
      // Find current user in students list and add them as first attendee
      const currentStudent = students.find(s => s.rollNumber === user.rollNumber);
      if (currentStudent) {
        setSelectedStudents([currentStudent]);
      }
      setError('');
    }
  }, [user, isOpen, students]);

  if (!isOpen || !selectedRoom) return null;

  const isAvailable = isRoomAvailable(selectedRoom.id);

  const handleStudentSelect = (student: Student) => {
    setSelectedStudents(prev => [...prev, student]);
  };

  const handleStudentRemove = (rollNumber: string) => {
    setSelectedStudents(prev => prev.filter(s => s.rollNumber !== rollNumber));
  };

  const handleBooking = async () => {
    if (!user) return;

    // Validate student count
    if (selectedStudents.length !== 4) {
      setError('Exactly 4 students are required for booking');
      return;
    }

    const attendeeNames = selectedStudents.map(s => s.name);
    
    // Check if any attendee already has a booking
    for (const name of attendeeNames) {
      if (!canUserBook(name)) {
        setError(`${name} already has a room booked`);
        return;
      }
    }

    setIsBooking(true);
    setError('');
    try {
      await bookRoom(selectedRoom.id, attendeeNames);
      
      // Reset form
      setSelectedStudents([]);
      onClose();
    } catch (error) {
      console.error('Booking failed:', error);
      setError('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (!isAvailable) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Room Not Available</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-600">This room is already booked.</p>
            <button
              onClick={onClose}
              className="mt-4 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Book Room</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Room Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <MapPin className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-semibold text-gray-900">
                  Room {selectedRoom.roomNumber}
                </div>
                <div className="text-sm text-gray-600">
                  Floor {selectedRoom.floor} - Wing {selectedRoom.wing}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="text-gray-900">Capacity: 4 people</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select 4 Students for the Meeting
            </label>
            <StudentSelector
              selectedStudents={selectedStudents}
              onStudentSelect={handleStudentSelect}
              onStudentRemove={handleStudentRemove}
              maxStudents={4}
              currentUserRollNumber={user?.rollNumber}
            />
          </div>

          {/* Book Button */}
          <button
            onClick={handleBooking}
            disabled={selectedStudents.length !== 4 || isBooking}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isBooking ? 'Booking...' : 'Book Room'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;