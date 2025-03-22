import React from 'react';

export const Node = ({ label, onClick, className = '', highlight = false }) => (
  <div
    onClick={onClick}
    className={`h-12 w-12 rounded-full border-2 ${
      highlight ? 'border-green-500 ring-4 ring-green-300' : 'border-gray-400'
    } flex items-center justify-center cursor-pointer hover:bg-gray-100 ${className}`}
  >
    {label}
  </div>
);

export const StateNode = ({ state }) => {
  const displayState = Array.isArray(state)
    ? `[${state.join(',')}]`
    : state?.toString() || '';

  return (
    <div className="h-12 rounded-full border-2 border-gray-400 flex items-center justify-center px-2">
      {displayState}
    </div>
  );
};

export const StateRect = (({ state }) => {
  const displayState = Array.isArray(state)
    ? `[${state.join(',')}]`
    : state?.toString() || '';

  return (
    <div className="h-10 px-2 border-2 border-gray-400 rounded flex items-center justify-center bg-white">
      {displayState}
    </div>
  );
})

export const Arrow = ({ vertical = false, direction = 'right' }) => (
  <div
    className={
      vertical
        ? 'h-8 w-0.5 bg-gray-400 my-2'
        : `w-8 h-0.5 bg-gray-400 mx-2 relative ${
            direction === 'right' ? 'arrow-right' : 'arrow-left'
          }`
    }
  >
    {!vertical && (
      <div
        className={`absolute top-0 ${
          direction === 'right' ? 'right-0' : 'left-0'
        } transform -translate-y-1/2`}
      >
        <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-gray-400"></div>
      </div>
    )}
  </div>
);