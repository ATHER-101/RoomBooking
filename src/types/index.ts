export interface Room {
  id: string;
  floor: number;
  wing: string;
  roomNumber: number;
  occupancy: number;
  maxOccupancy: number;
}

export interface Booking {
  id: string;
  roomId: string;
  attendeeNames: string[];
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface User {
  name: string;
  rollNumber: string;
}

export interface Student {
  email: string;
  name: string;
  rollNumber: string;
  secret: string;
}