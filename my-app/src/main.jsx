import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { SidePanel } from './view/SidePanel.jsx';
import { algorithms } from './algorithms/index.jsx';
import React from 'react';

console.log(algorithms);

const Root = () => {
  const [selectedKey, setSelectedKey] = React.useState('factorial'); // Use key instead of name
  const [showSidePanel, setShowSidePanel] = React.useState(true);

  const handleSelectAlgorithm = (key) => {
    console.log('Selected algorithm key:', key);
    setSelectedKey(key);
  };

  const toggleSidePanel = () => {
    setShowSidePanel(!showSidePanel);
  };

  const selectedAlgorithm = algorithms[selectedKey];

  return (
    <>
      <App algorithm={selectedAlgorithm} />
      {showSidePanel && (
        <SidePanel
          algorithms={algorithms}
          selectedAlgorithm={selectedAlgorithm.name}
          onSelectAlgorithm={handleSelectAlgorithm}
          onClose={toggleSidePanel}
        />
      )}
      {!showSidePanel && (
        <button
          onClick={toggleSidePanel}
          className="fixed right-4 top-4 p-2 bg-blue-500 text-white rounded"
        >
          Open Panel
        </button>
      )}
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);