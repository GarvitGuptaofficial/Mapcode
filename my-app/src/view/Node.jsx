import React, { forwardRef } from 'react';
import { useState } from 'react';

export const Node = forwardRef(({ label, onClick, className = '', highlight = false }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    className={`h-12 w-12 rounded-full border-2 ${
      highlight ? 'border-green-500 ring-4 ring-green-300' : 'border-gray-400'
    } flex items-center justify-center cursor-pointer hover:bg-gray-100 ${className}`}
  >
    {label}
  </div>
));

export const StateNode = forwardRef(({ state }, ref) => {
  const displayState = Array.isArray(state)
    ? `[${state.join(',')}]`
    : state?.toString() || '';

  return (
    <div 
      ref={ref}
      className="h-12 rounded-full border-2 border-gray-400 flex items-center justify-center px-2"
    >
      {displayState}
    </div>
  );
});

export const StateRect = forwardRef(({ state, onClick, color = 'gray', showSymbol = false }, ref) => {
  const colors = {
    gray: 'bg-gray-500',
    red: 'bg-red-300',
    blue: 'bg-blue-300',
    green: 'bg-green-300',
    yellow: 'bg-yellow-300',
  };

  return (
    <button
      ref={ref}
      className={`h-6 w-10 rounded-md border border-black ${showSymbol ? 'bg-white text-black' : colors[color] || colors.gray} flex items-center justify-center`}
      onClick={onClick}
    >
      {showSymbol ? '?' : ''}
    </button>
  );
});




export const Arrow = ({ direction = 'right', startX = 0, startY = 0, endX = 0, endY = 0, style }) => {
  const isVertical = direction === 'up' || direction === 'down';

  if (direction === 'custom') {
    // Calculate the length of the line for positioning the arrowhead
    const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    return (
      <svg
        style={{
          position: 'absolute',
          left: Math.min(startX, endX),
          top: Math.min(startY, endY),
          width: Math.abs(endX - startX),
          height: Math.abs(endY - startY),
          ...style,
        }}
      >
        <line
          x1={startX < endX ? 0 : Math.abs(endX - startX)}
          y1={startY < endY ? 0 : Math.abs(endY - startY)}
          x2={startX < endX ? Math.abs(endX - startX) : 0}
          y2={startY < endY ? Math.abs(endY - startY) : 0}
          stroke="gray"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="gray" />
          </marker>
        </defs>
      </svg>
    );
  }

  // Existing rendering for horizontal and vertical arrows
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