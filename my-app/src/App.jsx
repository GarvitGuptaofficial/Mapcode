import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Controller } from './controller/Controller';
import { Node, StateNode, StateRect, Arrow } from './view/Node';
import { SidePanel } from './view/SidePanel';
import { algorithms } from './algorithms';

const App = () => {
  const [controller, setController] = useState(new Controller(algorithms.factorial));
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms.factorial.name);
  const [showDialog, setShowDialog] = useState(null);
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [renderTrigger, setRenderTrigger] = useState(0); // To force re-render
  const [inputN, setInputN] = useState('');
  const [inputM, setInputM] = useState('');

  const state = controller.getState();

  // Force re-render when state changes
  useEffect(() => {
    setRenderTrigger((prev) => prev + 1);
    console.log('State updated:', state);
  }, [state.step, state.n, state.m, state.fNodes, state.result, state.showT, state.showInitialState, state.showFinalResult, state.computationText]);

  const handleSelectAlgorithm = (key) => {
    console.log('Selecting algorithm:', key);
    const currentN = state.n;
    const currentM = state.m;
    controller.changeAlgorithm(algorithms[key]);
    setSelectedAlgorithm(algorithms[key].name);
    setShowDialog(null);
    controller.model.setInput(currentN || '', currentM || '');
    setInputN(currentN || '');
    setInputM(currentM || '');
    setRenderTrigger((prev) => prev + 1);
  };

  const toggleSidePanel = () => {
    console.log('Toggling side panel:', !showSidePanel);
    setShowSidePanel(!showSidePanel);
  };

  const handleUndo = () => {
    console.log('Undo button clicked, Current History length:', controller.model.history.length);
    controller.undo();
    setInputN(state.n.toString());
    setInputM(state.m.toString());
    setRenderTrigger((prev) => prev + 1); // Force re-render
  };

  const getHighlightButton = () => {
    if (state.step === 0) return 'f';
    if (state.step === 1) return 'p';
    if (state.step === 2 || state.step === 3) return 't';
    if (state.step === 3.5) return 'pi';
    return null;
  };

  const highlightButton = getHighlightButton();

  const isTwoInputAlgorithm = state.algorithmName === 'exponentiation' || state.algorithmName === 'gcd';

  const displayInput = isTwoInputAlgorithm ? `${state.n},${state.m}` : state.n;

  return (
    <div className="flex">
      <div className="flex-1 max-w-5xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={handleUndo}
            className={`p-2 rounded ${controller.model.history.length > 1 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
            disabled={controller.model.history.length <= 1} // Enable only if history has more than initial state
          >
            Undo
          </button>
          <div className="flex space-x-2">
            <input
              type="number"
              value={inputN}
              onChange={(e) => {
                const value = e.target.value;
                setInputN(value);
                controller.handleInputChange(value, inputM);
                setRenderTrigger((prev) => prev + 1);
              }}
              placeholder={isTwoInputAlgorithm ? "Enter base (or first number)" : "Enter a number"}
              className="p-2 border rounded"
              min="0"
            />
            {isTwoInputAlgorithm && (
              <input
                type="number"
                value={inputM}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputM(value);
                  controller.handleInputChange(inputN, value);
                  setRenderTrigger((prev) => prev + 1);
                }}
                placeholder={state.algorithmName === 'exponentiation' ? "Enter power" : "Enter second number"}
                className="p-2 border rounded"
                min="0"
              />
            )}
          </div>
        </div>

        {(state.n !== '' || state.m !== '') && (
          <div className="relative mb-8 bg-white">
            <div className="flex items-center justify-center mb-16">
              <div className="flex items-center">
                <Node label={displayInput} />
                <Arrow direction="right" />
                <Node
                  label="f"
                  onClick={() => {
                    console.log('Clicked f button, current step:', state.step);
                    controller.handleFClick();
                    setRenderTrigger((prev) => prev + 1);
                  }}
                  highlight={highlightButton === 'f'}
                />
                <Arrow direction="right" />
                <Node label={state.showFinalResult ? state.result : '?'} />
              </div>
            </div>

            {state.step >= 1 && (
              <div>
                <div className="absolute left-8 top-20">
                  <div className="flex flex-col items-center">
                    <Node label={displayInput} />
                    <Arrow vertical />
                    <Node
                      label="ρ"
                      onClick={() => {
                        console.log('Clicked ρ button, current step:', state.step);
                        controller.handlePClick();
                        setRenderTrigger((prev) => prev + 1);
                      }}
                      highlight={highlightButton === 'p'}
                    />
                    <Arrow vertical />
                    {state.showInitialState ? (
                      <StateNode state={controller.model.calculateRho(state.n, state.m)} />
                    ) : (
                      <Node label="?" />
                    )}
                  </div>
                </div>

                <div className="absolute right-8 top-20">
                  <div className="flex flex-col items-center">
                    <Node label={state.showFinalResult ? state.result : '?'} />
                    <Arrow vertical direction="down" />
                    <Node
                      label="π"
                      onClick={() => {
                        console.log('Clicked π button, current step:', state.step);
                        controller.handlePiClick();
                        setRenderTrigger((prev) => prev + 1);
                      }}
                      highlight={highlightButton === 'pi'}
                    />
                    <Arrow vertical direction="down" />
                    {state.step >= 3.5 ? (
                      <StateNode state={state.fNodes[state.fNodes.length - 1]} />
                    ) : (
                      <Node label="?" />
                    )}
                  </div>
                </div>

                {/* Render F chain and prior states when step >= 2, T and next ? only when showT is true */}
                {(state.step >= 2 || state.showT) && (
                  <div className="flex justify-center items-center mt-70">
                    <div className="flex items-center overflow-x-auto">
                      {state.step >= 2 && (
                        <>
                          <StateRect state={controller.model.calculateRho(state.n, state.m)} />
                          <Arrow direction="right" />
                        </>
                      )}
                      {state.fNodes.map((stateNode, index) => (
                        <React.Fragment key={index}>
                          <Node
                            label="F"
                            onClick={() => {
                              console.log('Clicked F node at index:', index);
                              setShowDialog(index);
                            }}
                          />
                          <Arrow direction="right" />
                          <StateRect state={stateNode} />
                          {index < state.fNodes.length - 1 || state.showT ? (
                            <Arrow direction="right" />
                          ) : null}
                        </React.Fragment>
                      ))}
                      {state.showT && (
                        <>
                          <Node
                            label="T"
                            onClick={() => {
                              console.log('Clicked T button, current step:', state.step);
                              controller.handleTClick();
                              setRenderTrigger((prev) => prev + 1);
                            }}
                            highlight={highlightButton === 't'}
                          />
                          <Arrow direction="right" />
                          {state.step < 3.5 ? (
                            <Node label="?" /> // Show '?' until final iteration is done
                          ) : (
                            <StateRect state={state.fNodes[state.fNodes.length - 1]} />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {showDialog !== null && (
                  <div className="absolute left-0 right-0 mt-15 flex justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Current State</h3>
                        <X
                          className="cursor-pointer"
                          onClick={() => {
                            console.log('Closing dialog');
                            setShowDialog(null);
                          }}
                        />
                      </div>
                      <p className="text-lg">i: {state.fNodes[showDialog][0]}</p>
                      <p className="text-lg">a: {state.fNodes[showDialog][1]}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Move instruction box further below the computation flow */}
        <div className="text-center mt-40 p-4 bg-gray-100 rounded">
          {state.computationText ||
            (!state.n && !state.m
              ? 'Enter a number to start'
              : (state.n !== '' || state.m !== '') && state.step === 0
              ? "Click 'f' to start the computation visualization"
              : state.step === 1
              ? "Click 'ρ' to initialize the state"
              : state.step === 2
              ? "Click 'T' to begin state transitions"
              : state.step === 3.5
              ? "Click 'π' to extract the final result"
              : state.step === 4
              ? `Result: ${state.result}`
              : '')}
        </div>
      </div>

      {showSidePanel && (
        <SidePanel
          algorithms={algorithms}
          selectedAlgorithm={selectedAlgorithm}
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
    </div>
  );
};

export default App;