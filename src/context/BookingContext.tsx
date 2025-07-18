import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, Booking } from '../types';
import roomsData from '../data/rooms.json';

interface BookingContextType {
  rooms: Room[];
  bookings: Booking[];
  selectedFloor: number;
  selectedWing: string;
  selectedRoom: Room | null;
  setSelectedFloor: (floor: number) => void;
  setSelectedWing: (wing: string) => void;
  setSelectedRoom: (room: Room | null) => void;
  isRoomAvailable: (roomId: string) => boolean;
  bookRoom: (roomId: string, attendeeNames: string[]) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  getUserBookings: (userName: string) => Booking[];
  getAvailableWings: (floor: number) => string[];
  getFloors: () => number[];
  canUserBook: (userName: string) => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms] = useState<Room[]>(roomsData);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedFloor, setSelectedFloor] = useState(4);
  const [selectedWing, setSelectedWing] = useState('E');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    // Load bookings from localStorage
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('bookings', JSON.stringify(newBookings));
  };

  const isRoomAvailable = (roomId: string) => {
    return !bookings.some(booking => 
      booking.roomId === roomId && 
      booking.status === 'confirmed'
    );
  };

  const canUserBook = (userName: string) => {
    // Check if user has any active bookings by name
    const hasBooking = bookings.some(booking => 
      booking.attendeeNames.includes(userName) && 
      booking.status === 'confirmed'
    );
    return !hasBooking;
  };

  const bookRoom = async (roomId: string, attendeeNames: string[]) => {
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      roomId,
      attendeeNames,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    
    const newBookings = [...bookings, newBooking];
    saveBookings(newBookings);
  };

  const cancelBooking = async (bookingId: string) => {
    const newBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'cancelled' as const }
        : booking
    );
    saveBookings(newBookings);
  };

  const getUserBookings = (userName: string) => {
    return bookings.filter(booking => 
      booking.attendeeNames.includes(userName) && booking.status === 'confirmed'
    );
  };

  const getAvailableWings = (floor: number) => {
    const wings = rooms
      .filter(room => room.floor === floor)
      .map(room => room.wing);
    return [...new Set(wings)].sort();
  };

  const getFloors = () => {
    const floors = rooms.map(room => room.floor);
    return [...new Set(floors)].sort();
  };

  return (
    <BookingContext.Provider value={{
      rooms,
      bookings,
      selectedFloor,
      selectedWing,
      selectedRoom,
      setSelectedFloor,
      setSelectedWing,
      setSelectedRoom,
      isRoomAvailable,
      bookRoom,
      cancelBooking,
      getUserBookings,
      getAvailableWings,
      getFloors,
      canUserBook,
    }}>
      {children}
    </BookingContext.Provider>
  );
};