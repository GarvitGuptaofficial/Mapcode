import React from 'react';
import { useState } from 'react';

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

export const StateRect = ({ state, onClick, color = 'gray', showSymbol = false }) => {
  const colors = {
    gray: 'bg-gray-500',
    red: 'bg-red-300',
    blue: 'bg-blue-300',
    green: 'bg-green-300',
    yellow: 'bg-yellow-300',
  };

  return (
    <button
      className={`h-6 w-10 rounded-md border border-black ${showSymbol ? 'bg-white text-black' : colors[color] || colors.gray} flex items-center justify-center`}
      onClick={onClick}
    >
      {showSymbol ? '?' : ''}
    </button>
  );
};





export const Arrow = ({ direction = 'right' }) => {
  const isVertical = direction === 'up' || direction === 'down';

  return (
    <div
      className={
        isVertical
          ? 'h-8 w-0.5 bg-gray-400 my-2 relative'
          : 'w-8 h-0.5 bg-gray-400 mx-2 relative'
      }
    >
      {/* Arrowhead */}
      <div
        className={`absolute ${
          isVertical
            ? direction === 'down'
              ? 'bottom-0 left-1/2 -translate-x-1/2'
              : 'top-0 left-1/2 -translate-x-1/2'
            : direction === 'right'
            ? 'right-0 top-1/2 -translate-y-1/2'
            : 'left-0 top-1/2 -translate-y-1/2'
        }`}
      >
        <div
          className={`w-0 h-0 ${
            direction === 'right'
              ? 'w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-gray-390'
              : direction === 'left'
              ? 'border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-390'
              : direction === 'down'
              ? 'border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-390'
              : 'border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-gray-390'
          }`}
        ></div>
      </div>
    </div>
  );
};