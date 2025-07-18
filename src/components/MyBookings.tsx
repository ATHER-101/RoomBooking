import React, { useState } from 'react';
import { MapPin, Users, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const { getUserBookings, cancelBooking, rooms } = useBooking();
  const [showBookings, setShowBookings] = useState(false);

  if (!user) return null;

  const userBookings = getUserBookings(user.name);

  const getRoomDetails = (roomId: string) => {
    return rooms.find(room => room.id === roomId);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await cancelBooking(bookingId);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowBookings(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-6"
      >
        My Bookings ({userBookings.length})
      </button>

      {showBookings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">My Bookings</h2>
              <button
                onClick={() => setShowBookings(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {userBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4" />
                  <p>No bookings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBookings.map((booking) => {
                    const room = getRoomDetails(booking.roomId);
                    
                    return (
                      <div key={booking.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-gray-600" />
                            <div>
                              <div className="font-semibold text-gray-900">
                                Room {room?.roomNumber}
                              </div>
                              <div className="text-sm text-gray-600">
                                Floor {room?.floor} - Wing {room?.wing}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm mb-3">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>{booking.attendeeNames.length} people</span>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded p-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Attendees:</p>
                          <div className="flex flex-wrap gap-2">
                            {booking.attendeeNames.map((name, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyBookings;