import React, { useState } from 'react';
import { X } from 'lucide-react';

const FactorialVisualization = () => {
  const [n, setN] = useState('');
  const [step, setStep] = useState(0);
  const [fNodes, setFNodes] = useState([]);
  const [showDialog, setShowDialog] = useState(null);
  const [result, setResult] = useState(null);
  const [showT, setShowT] = useState(false);
  const [showInitialState, setShowInitialState] = useState(false);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [computationText, setComputationText] = useState('');

  const calculateNextState = (i, a) => {
    if (i === 0) return [0, a];
    return [i - 1, a * i];
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setN(value);
      setStep(0);
      setFNodes([]);
      setResult(null);
      setShowT(false);
      setShowInitialState(false);
      setShowFinalResult(false);
      setComputationText('');
    } else {
      setN('');
    }
  };

  const handleFClick = () => {
    if (step === 0) {
      setStep(1);
      setShowT(true);
      setComputationText('');
    }
  };

  const handlePClick = () => {
    if (step === 1) {
      setStep(2);
      setShowInitialState(true);
      setComputationText(`ρ(${n}) = (${n},1) : Initial state setup`);
    }
  };

  const handleTClick = () => {
    if (step === 2 && !fNodes.length) {
      setFNodes([[n, 1]]);
      setStep(3);
      setComputationText(`Iteration 1: F(${n},1) = (${n-1},${n})`);
    } else if (step === 3) {
      const lastState = fNodes[fNodes.length - 1];
      const nextState = calculateNextState(lastState[0], lastState[1]);
      setFNodes([...fNodes, nextState]);
      setComputationText(
        `Iteration ${fNodes.length + 1}: F(${lastState[0]},${lastState[1]}) = (${nextState[0]},${nextState[1]})`
      );
      
      if (nextState[0] === 0) {
        setShowT(false);
        setStep(3.5);
        setResult(nextState[1]);
      }
    }
  };

  const handlePiClick = () => {
    if (step === 3.5) {
      setShowFinalResult(true);
      setStep(4);
      setComputationText(`π(0,${result}) = ${result} : Final result extraction`);
    }
  };

  const Node = ({ label, onClick, className = "" }) => (
    <div 
      onClick={onClick}
      className={`h-12 w-12 rounded-full border-2 border-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-100 ${className}`}
    >
      {label}
    </div>
  );

  const StateNode = ({ state }) => (
    <div className="h-12 w-12 rounded-full border-2 border-gray-400 flex items-center justify-center">
      [{state[0]},{state[1]}]
    </div>
  );

  const Arrow = ({ vertical = false, direction = 'right' }) => (
    <div className={vertical ? 
      "h-8 w-0.5 bg-gray-400 my-2" : 
      `w-8 h-0.5 bg-gray-400 mx-2 relative ${direction === 'right' ? 'arrow-right' : 'arrow-left'}`
    }>
      {!vertical && (
        <div className={`absolute top-0 ${direction === 'right' ? 'right-0' : 'left-0'} transform -translate-y-1/2`}>
          <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-gray-400"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-4 text-center">
        <input
          type="number"
          value={n}
          onChange={handleInputChange}
          placeholder="Enter a number"
          className="p-2 border rounded"
          min="0"
        />
      </div>

      {n !== '' && (
        <div className="relative mb-8 bg-white">
          {/* Top row with n → f → result */}
          <div className="flex items-center justify-center mb-16">
            <div className="flex items-center">
              <Node label={n} />
              <Arrow direction="right" />
              <Node label="f" onClick={handleFClick} />
              <Arrow direction="right" />
              <Node label={showFinalResult ? result : "?"} />
            </div>
          </div>

          {step >= 1 && (
            <div>
              {/* Left column */}
              <div className="absolute left-8 top-20">
                <div className="flex flex-col items-center">
                  <Node label={n} />
                  <Arrow vertical />
                  <Node label="P" onClick={handlePClick} />
                  <Arrow vertical />
                  {showInitialState ? (
                    <StateNode state={[n, 1]} />
                  ) : (
                    <Node label="?" />
                  )}
                </div>
              </div>

              {/* Right column */}
              <div className="absolute right-8 top-20">
                <div className="flex flex-col items-center">
                  <Node label={showFinalResult ? result : "?"} />
                  <Arrow vertical direction="down" />
                  <Node label="π" onClick={handlePiClick} />
                  <Arrow vertical direction="down" />
                  {step >= 3.5 ? (
                    <StateNode state={[0, result]} />
                  ) : (
                    <Node label="?" />
                  )}
                </div>
              </div>

              {/* Center row with F chain */}
              <div className="flex justify-center items-center mt-70">
                <div className="flex items-center">
                  {fNodes.map((state, index) => (
                    <React.Fragment key={index}>
                      <Node 
                        label="F"
                        onClick={() => setShowDialog(index)}
                      />
                      <Arrow direction="right" />
                    </React.Fragment>
                  ))}
                  {showT ? (
                    <>
                      <Node label="T" onClick={handleTClick} />
                      <Arrow direction="right" />
                      <Node label="?" />
                    </>
                  ) : (
                    step >= 3.5 && (
                      <StateNode state={fNodes[fNodes.length-1]} />
                    )
                  )}
                </div>
              </div>

              {showDialog !== null && (
                <div className="absolute left-0 right-0 mt-15 flex justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">Current State</h3>
                      <X 
                        className="cursor-pointer" 
                        onClick={() => setShowDialog(null)}
                      />
                    </div>
                    <p className="text-lg">i: {fNodes[showDialog][0]}</p>
                    <p className="text-lg">a: {fNodes[showDialog][1]}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-15 p-4 bg-gray-100 rounded">
        {computationText || (!n ? "Enter a number to start" : 
          n !== '' && step === 0 ? "Click 'f' to start the factorial computation visualization" :
          step === 1 ? "Click 'P' to initialize the state" :
          step === 2 ? "Click 'T' to begin state transitions" :
          step === 3.5 ? "Click 'π' to extract the final result" :
          step === 4 ? `${n}! = ${result}` : ""
        )}
      </div>
    </div>
  );
};

export default FactorialVisualization;