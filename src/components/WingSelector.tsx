import React from 'react';
import { useBooking } from '../context/BookingContext';

const WingSelector: React.FC = () => {
  const { selectedFloor, selectedWing, setSelectedWing, getAvailableWings } = useBooking();
  const wings = getAvailableWings(selectedFloor);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Wing</h3>
      <div className="grid grid-cols-3 gap-3">
        {wings.map((wing) => (
          <button
            key={wing}
            onClick={() => setSelectedWing(wing)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedWing === wing
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <div className="text-center">
              <div className="text-xl font-bold">{wing}</div>
              <div className="text-sm">Wing</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WingSelector;