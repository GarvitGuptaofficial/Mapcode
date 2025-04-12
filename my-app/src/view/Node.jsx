import React, { forwardRef } from 'react';

export const Edge = forwardRef(({ label, onClick, className = '', highlight = false }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    className={`relative h-0.5 bg-gray-400 mx-4 group ${className}`}
    style={{ minWidth: '50px' }}
  >
    {/* Clickable overlay on the edge with the label */}
    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     h-8 w-8 rounded-full bg-white border-2 
                     ${highlight ? 'border-green-500 ring-4 ring-green-300' : 'border-gray-400'} 
                     flex items-center justify-center cursor-pointer hover:bg-gray-100 z-10`}>
      {label}
    </div>
    
    {/* Arrowhead */}
    <div className="absolute right-0 top-1/2 -translate-y-1/2">
      <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-gray-400"></div>
    </div>
  </div>
));

export const DiagonalEdge = forwardRef(({ label, onClick, startX, startY, endX, endY, highlight = false, style }, ref) => {
  // Calculate the absolute width and height of the SVG
  const width = Math.abs(endX - startX) + 20; // Add padding
  const height = Math.abs(endY - startY) + 20; // Add padding
  
  // Determine the position of the SVG
  const left = Math.min(startX, endX) - 10; // Subtract padding/2
  const top = Math.min(startY, endY) - 10; // Subtract padding/2
  
  // Calculate the position of the line within the SVG
  const x1 = startX < endX ? 10 : width - 10;
  const y1 = startY < endY ? 10 : height - 10;
  const x2 = startX < endX ? width - 10 : 10;
  const y2 = startY < endY ? height - 10 : 10;
  
  // Calculate the midpoint of the line for placing the button
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  return (
    <div style={{ position: 'absolute', left, top, ...style }}>
      <svg
        width={width}
        height={height}
        style={{ position: 'absolute' }}
      >
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
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
      
      {/* Clickable overlay with label */}
      <div 
        ref={ref}
        onClick={onClick}
        className={`absolute rounded-full bg-white border-2 
                   ${highlight ? 'border-green-500 ring-4 ring-green-300' : 'border-gray-400'} 
                   h-8 w-8 flex items-center justify-center cursor-pointer hover:bg-gray-100 z-10`}
        style={{ 
          left: midX - 16, 
          top: midY - 16
        }}
      >
        {label}
      </div>
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