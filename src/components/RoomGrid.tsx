import React from 'react';
import { Users, CheckCircle, XCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

const RoomGrid: React.FC = () => {
  const { 
    rooms, 
    selectedFloor, 
    selectedWing, 
    selectedRoom, 
    setSelectedRoom, 
    isRoomAvailable,
    bookings
  } = useBooking();

  const filteredRooms = rooms.filter(
    room => room.floor === selectedFloor && room.wing === selectedWing
  );

  const getRoomBooking = (roomId: string) => {
    return bookings.find(booking => 
      booking.roomId === roomId && booking.status === 'confirmed'
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Floor {selectedFloor} - Wing {selectedWing}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredRooms.map((room) => {
          const isAvailable = isRoomAvailable(room.id);
          const isSelected = selectedRoom?.id === room.id;
          const booking = getRoomBooking(room.id);
          
          return (
            <div
              key={room.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : isAvailable
                  ? 'border-green-200 bg-green-50 hover:border-green-300 cursor-pointer transform hover:scale-105'
                  : 'border-red-200 bg-red-50'
              }`}
              onClick={() => isAvailable && setSelectedRoom(room)}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {room.roomNumber}
                </div>
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-2">
                  <Users className="h-4 w-4" />
                  <span>{room.maxOccupancy}</span>
                </div>
                <div className="flex items-center justify-center space-x-1 text-xs font-medium">
                  {isAvailable ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">Available</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 text-red-600" />
                      <span className="text-red-600">Booked</span>
                    </>
                  )}
                </div>
                {!isAvailable && booking && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Booked by:</p>
                    <div className="space-y-1">
                      {booking.attendeeNames.map((name, index) => (
                        <div
                          key={index}
                          className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded text-center"
                        >
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomGrid;