import React from 'react';
import { useBooking } from '../context/BookingContext';

const FloorSelector: React.FC = () => {
  const { selectedFloor, setSelectedFloor, getFloors } = useBooking();
  const floors = getFloors();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Floor</h3>
      <div className="grid grid-cols-3 gap-3">
        {floors.map((floor) => (
          <button
            key={floor}
            onClick={() => setSelectedFloor(floor)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedFloor === floor
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <div className="text-center">
              <div className="text-xl font-bold">{floor}</div>
              <div className="text-sm">Floor</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FloorSelector;