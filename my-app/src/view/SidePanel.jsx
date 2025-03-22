import React from 'react';
import { X } from 'lucide-react';

export const SidePanel = ({ algorithms, selectedAlgorithm, onSelectAlgorithm, onClose }) => {
  return (
    <div className="w-64 h-full bg-gray-200 p-4 fixed right-0 top-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Select Algorithm</h3>
        <X className="cursor-pointer" onClick={onClose} />
      </div>
      <p className="mb-4">Current Algorithm: {selectedAlgorithm}</p>
      <ul>
        {Object.keys(algorithms).map((key) => (
          <li key={key} className="mb-2">
            <button
              onClick={() => onSelectAlgorithm(key)}
              className={`w-full text-left p-2 rounded ${
                selectedAlgorithm === algorithms[key].name
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300'
              }`}
            >
              {algorithms[key].name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};