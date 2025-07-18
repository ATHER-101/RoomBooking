import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Header from './components/Header';
import NameLogin from './components/GoogleLogin';
import FloorSelector from './components/FloorSelector';
import WingSelector from './components/WingSelector';
import RoomGrid from './components/RoomGrid';
import BookingModal from './components/BookingModal';
import MyBookings from './components/MyBookings';
import { useBooking } from './context/BookingContext';

const MainApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { selectedRoom, canUserBook } = useBooking();
  const [showBookingModal, setShowBookingModal] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <NameLogin />;
  }

  const userCanBook = canUserBook(user.name);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book a Meeting Room</h2>
          <p className="text-gray-600">Select your preferred floor and wing</p>
          {!userCanBook && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                You already have a room booked. Cancel your existing booking to book a new room.
              </p>
            </div>
          )}
        </div>
        
        <MyBookings />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <FloorSelector />
            <WingSelector />
          </div>
          
          <div className="lg:col-span-3">
            <RoomGrid />
            <div className="text-center">
              <button
                onClick={() => setShowBookingModal(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!selectedRoom || !userCanBook}
              >
                {!selectedRoom ? 'Select a Room' : !userCanBook ? 'Already Have Booking' : 'Book Selected Room'}
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <BookingModal 
        isOpen={showBookingModal} 
        onClose={() => setShowBookingModal(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <MainApp />
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;