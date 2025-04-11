import React, { useState, useEffect, useRef } from 'react';
import { Controller } from './controller/Controller';
import { Node, StateNode, StateRect, Arrow } from './view/Node';

const App = ({ algorithm }) => {
  const [controller] = useState(() => new Controller(algorithm));
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [renderTrigger, setRenderTrigger] = useState(0);
  const [inputs, setInputs] = useState(Array(algorithm.numInputs || 1).fill(''));
  const [endOfAlgo, setEndOfAlgo] = useState(false);
  const [history, setHistory] = useState([]);
  const [futureStates, setFutureStates] = useState([]);
  // const [first_time_T_final_state, setFirstTimeTFinalState] = useState(true);
  const state = controller.getState();

  useEffect(() => {
    controller.changeAlgorithm(algorithm);
    setInputs(Array(algorithm.numInputs || 1).fill(''));
    setEndOfAlgo(false);
    setHistory([]);
    setFutureStates([]); // Reset future states array
    setRenderTrigger((prev) => prev + 1);
  }, [algorithm, controller]);

  useEffect(() => {
    setRenderTrigger((prev) => prev + 1);
    console.log('State updated:', state);
  }, [state.step, state.inputs, state.fNodes, state.result, state.showT, state.showInitialState, state.showFinalState, state.computationText]);

  const handleUndo = () => {
    if (history.length === 0) return;
  
    console.log('Undo button clicked, history length:', history.length);
    
    // Save current state to future states for redo
    setFutureStates(prevFutureStates => [
      {
        state: { ...state },
        inputs: [...inputs],
        endOfAlgo
      },
      ...prevFutureStates // Add to beginning of array
    ]);
  
    const newHistory = [...history];
    const previousState = newHistory.pop();
    
    // Directly update controller's model state
    controller.model.inputs = [...previousState.state.inputs];
    controller.model.initialState = previousState.state.initialState;
    controller.model.step = previousState.state.step;
    controller.model.fNodes = [...previousState.state.fNodes];
    controller.model.result = previousState.state.result;
    controller.model.showT = previousState.state.showT;
    controller.model.showInitialState = previousState.state.showInitialState;
    controller.model.showFinalResult = previousState.state.showFinalResult;
    controller.model.computationText = previousState.state.computationText;
    controller.model.first_time_T_final_state = previousState.state.first_time_T_final_state;
    // Update the app's state variables
    setInputs(previousState.inputs);
    setEndOfAlgo(previousState.endOfAlgo);
    // setFirstTimeTFinalState(previousState.first_time_T || true);
    setHistory(newHistory);
    
    // Force a render update
    setRenderTrigger((prev) => prev + 1);
    console.log('State after undo:', controller.getState());
  };

  const handleRedo = () => {
    if (futureStates.length === 0) return;
  
    console.log('Redo button clicked, future states available:', futureStates.length);
    
    // Get the next future state (from the beginning of the array)
    const nextFutureState = futureStates[0];
    const remainingFutureStates = futureStates.slice(1);
    
    // Save current state to history before applying the redo
    setHistory((prev) => [
      ...prev,
      {
        state: { ...state },
        inputs: [...inputs],
        endOfAlgo
      },
    ]);
  
    // Apply the future state
    controller.model.inputs = [...nextFutureState.state.inputs];
    controller.model.initialState = nextFutureState.state.initialState;
    controller.model.step = nextFutureState.state.step;
    controller.model.fNodes = [...nextFutureState.state.fNodes];
    controller.model.result = nextFutureState.state.result;
    controller.model.showT = nextFutureState.state.showT;
    controller.model.showInitialState = nextFutureState.state.showInitialState;
    controller.model.showFinalResult = nextFutureState.state.showFinalResult;
    controller.model.computationText = nextFutureState.state.computationText;
    controller.model.first_time_T_final_state = nextFutureState.state.first_time_T_final_state;
    setInputs(nextFutureState.inputs);
    setEndOfAlgo(nextFutureState.endOfAlgo);
    // setFirstTimeTFinalState(nextFutureState.first_time_T || true);
    
    // Update future states
    setFutureStates(remainingFutureStates);
    
    // Force a render update
    setRenderTrigger((prev) => prev + 1);
    console.log('State after redo:', controller.getState());
  };

  const handleReset = () => {
    console.log('Reset button clicked, resetting algorithm');
    // Reset the controller's model to its initial state
    controller.model.step = 0;
    controller.model.inputs = [];
    controller.model.fNodes = [];
    controller.model.result = null;
    controller.model.showT = true;
    controller.model.showInitialState = false;
    controller.model.showFinalResult = false;
    controller.model.computationText = '';
    controller.model.first_time_T_final_state = true; // Reset flag

    // Reset local state
    setInputs(Array(algorithm.numInputs || 1).fill(''));
    setEndOfAlgo(false);
    setHistory([]);
    setFutureStates([]); // Clear future states
    setShowDialog(false);
    setDialogContent(null);
    setRenderTrigger((prev) => prev + 1);
    console.log('State after reset:', controller.getState());
  };

  const getHighlightButton = () => {
    if (state.step === 0) return 'f';
    if (state.step === 1) return 'p';
    if (state.step === 2 || state.step === 3) return 't';
    if (state.step === 3.5) return 'pi';
    return null;
  };

  const highlightButton = getHighlightButton();

  const handleInputChange = (index, value) => {
    setHistory((prev) => [
      ...prev,
      {
        state: { ...state },
        inputs: [...inputs],
        endOfAlgo
      },
    ]);
    setFutureStates([]); // Clear future states on new action

    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    controller.handleInputChange(newInputs);
    setEndOfAlgo(false);
    setRenderTrigger((prev) => prev + 1);
  };

  const handleIClick = () => {
    console.log('Clicked I button, ending algorithm');
    setHistory((prev) => [
      ...prev,
      {
        state: { ...state },
        inputs: [...inputs],
        endOfAlgo
      },
    ]);
    setFutureStates([]); // Clear future states on new action
    setEndOfAlgo(true);
  };

  const handleFClick = () => {
    console.log('Clicked f button, current step:', state.step);
    setHistory((prev) => [
      ...prev,
      {
        state: { ...state },
        inputs: [...inputs],
        endOfAlgo
      },
    ]);
    setFutureStates([]); // Clear future states on new action
    controller.handleFClick();
    setEndOfAlgo(false);
    setRenderTrigger((prev) => prev + 1);
  };

  const handlePClick = () => {
    console.log('Clicked ρ button, current step:', state.step);
    setHistory((prev) => [
      ...prev,
      {
        state: { ...state },
        inputs: [...inputs],
        endOfAlgo
      },
    ]);
    setFutureStates([]); // Clear future states on new action
    controller.handlePClick();
    setEndOfAlgo(false);
    setRenderTrigger((prev) => prev + 1);
  };

  const handlePiClick = () => {
    console.log('Clicked π button, current step:', state.step);
    setHistory((prev) => [
      ...prev,
      {
        state: { ...state },
        inputs: [...inputs],
        endOfAlgo
      },
    ]);
    setFutureStates([]); // Clear future states on new action
    controller.handlePiClick();
    setEndOfAlgo(false);
    setRenderTrigger((prev) => prev + 1);
  };

  const handleTClick = () => {
    console.log('Clicked T button, current step:', state.step);
    setHistory((prev) => [
      ...prev,
      {
        state: { ...state },
        inputs: [...inputs],
        endOfAlgo
            },
    ]);
    setFutureStates([]); // Clear future states on new action
    controller.handleTClick();
    setEndOfAlgo(false);
    setRenderTrigger((prev) => prev + 1);
  };

  // New function to show dialog with custom content
  const showDialogWithContent = (content) => {
    console.log('Showing dialog with content:', content);
    setDialogContent(content);
    setShowDialog(true);
  };

  const displayInput = inputs.filter(Boolean).join(',');

  const shouldShowIdentityNode = state.step >= 3 && !state.showT && state.fNodes.length > 0;

  // Function to format display of state arrays
  const formatState = (stateArray) => {
    if (!Array.isArray(stateArray)) return stateArray;
    return stateArray.join(',');
  };

  // Create refs for the nodes we want to connect
  const topInputRef = useRef(null);
  const leftInputRef = useRef(null);
  const rhoNodeRef = useRef(null);
  const rightResultRef = useRef(null);
  const piNodeRef = useRef(null);
  const initialStateNodeRef = useRef(null);
  const finalStateNodeRef = useRef(null);
  const firstFChainNodeRef = useRef(null);
  const lastFChainNodeRef = useRef(null);
  const tNodeRef = useRef(null);
  
  // State for arrow coordinates
  const [arrowCoords, setArrowCoords] = useState({
    input_to_rho: { startX: 0, startY: 0, endX: 0, endY: 0 },
    pi_to_result: { startX: 0, startY: 0, endX: 0, endY: 0 },
    rho_to_fchain: { startX: 0, startY: 0, endX: 0, endY: 0 },
    fchain_to_pi: { startX: 0, startY: 0, endX: 0, endY: 0 }
  });

  useEffect(() => {
    const calculateArrowCoordinates = () => {
      if (!topInputRef.current || !rhoNodeRef.current || !piNodeRef.current || !rightResultRef.current) return;
      
      const containerRect = document.querySelector('.flex-1').getBoundingClientRect();
      
      // Get element positions
      const topInputRect = topInputRef.current.getBoundingClientRect();
      const rhoRect = rhoNodeRef.current.getBoundingClientRect();
      const piRect = piNodeRef.current.getBoundingClientRect();
      const rightResultRect = rightResultRef.current.getBoundingClientRect();
      
      // Calculate coordinates relative to container
      const input_to_rho = {
        startX: topInputRect.left - containerRect.left + topInputRect.width/2,
        startY: topInputRect.top - containerRect.top + topInputRect.height,
        endX: rhoRect.left - containerRect.left + rhoRect.width/2,
        endY: rhoRect.top - containerRect.top
      };
      
      const pi_to_result = {
        startX: piRect.left - containerRect.left + piRect.width/2,
        startY: piRect.top - containerRect.top,
        endX: rightResultRect.left - containerRect.left,
        endY: rightResultRect.top - containerRect.top + rightResultRect.height/2
      };
      
      // Initialize with default values
      let rho_to_fchain = { startX: 0, startY: 0, endX: 0, endY: 0 };
      let fchain_to_pi = { startX: 0, startY: 0, endX: 0, endY: 0 };
      
      // Calculate coordinates for rho to first F chain node
      if (initialStateNodeRef.current && state.step >= 2) {
        const initialStateRect = initialStateNodeRef.current.getBoundingClientRect();
        rho_to_fchain = {
          startX: initialStateRect.left - containerRect.left + initialStateRect.width/2,
          startY: initialStateRect.top - containerRect.top + initialStateRect.height,
          endX: (firstFChainNodeRef.current ? 
                 firstFChainNodeRef.current.getBoundingClientRect().left - containerRect.left + 25 : 
                 (tNodeRef.current ? 
                   tNodeRef.current.getBoundingClientRect().left - containerRect.left + 25 : 0)),
          endY: (firstFChainNodeRef.current ? 
                 firstFChainNodeRef.current.getBoundingClientRect().top - containerRect.top + 25 : 
                 (tNodeRef.current ? 
                   tNodeRef.current.getBoundingClientRect().top - containerRect.top + 25 : 0))
        };
      }
      
      // Calculate coordinates for last F chain node to pi
      if (finalStateNodeRef.current && state.step >= 3.5) {
        const finalStateRect = finalStateNodeRef.current.getBoundingClientRect();
        fchain_to_pi = {
          startX: finalStateRect.left - containerRect.left + finalStateRect.width/2,
          startY: finalStateRect.top - containerRect.top + finalStateRect.height,
          endX: piRect.left - containerRect.left + piRect.width/2,
          endY: piRect.top - containerRect.top + piRect.height
        };
      }
      
      setArrowCoords({ 
        input_to_rho, 
        pi_to_result,
        rho_to_fchain,
        fchain_to_pi
      });
    };
    
    // Calculate initially and whenever the component updates
    setTimeout(calculateArrowCoordinates, 100);
    window.addEventListener('resize', calculateArrowCoordinates);
    
    return () => window.removeEventListener('resize', calculateArrowCoordinates);
  }, [renderTrigger, inputs.some(Boolean), state.step]);

  // Function to determine the first node in the F chain
  const getFirstFChainNode = () => {
    if (state.step >= 2) {
      if (state.showT && state.fNodes.length === 0) {
        return tNodeRef;
      } else if (state.fNodes.length > 0) {
        return firstFChainNodeRef;
      }
    }
    return null;
  };

  return (
    <div className="flex">
      <div className="flex-1 max-w-5xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <div className="flex space-x-2">
            <button
              onClick={handleUndo}
              className={`p-2 rounded ${history.length > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
              disabled={history.length === 0}
            >
              Undo
            </button>
            <button
              onClick={handleRedo}
              className={`p-2 rounded ${futureStates.length > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
              disabled={futureStates.length === 0}
            >
              Redo
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded bg-red-500 hover:bg-red-600"
            >
              Reset
            </button>
          </div>
          <div className="flex space-x-2">
            {inputs.map((input, index) => (
              <input
                key={index}
                type="number"
                value={input}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder={state.algorithm?.inputLabels?.[index] || `Input ${index + 1}`}
                className="p-2 border rounded"
                min="0"
              />
            ))}
          </div>
        </div>

        {inputs.some(Boolean) && (
          <div className="relative mb-8 bg-white">
            <div className="flex items-center justify-center mb-16">
              <div className="flex items-center">
                <StateRect 
                  ref={topInputRef}
                  color='blue'
                  state={displayInput} 
                  onClick={() => showDialogWithContent({ title: 'Input', values: { input: displayInput } })}
                />
                <Arrow direction="right" />
                <Node
                  label="f"
                  onClick={handleFClick}
                  highlight={highlightButton === 'f'}
                />
                <Arrow direction="right" />
                <StateRect 
                  ref={rightResultRef}
                  showSymbol={state.step !== 4}
                  state={state.showFinalResult ? formatState(state.result) : '?'} 
                  onClick={state.showFinalResult ? () => showDialogWithContent({ title: 'Result', values: { result: formatState(state.result) } }) : null}
                />
              </div>
            </div>

            {state.step >= 1 && (
              <div>
                <div className="absolute left-8 top-20">
                  <div className="flex flex-col items-center">
                    <StateRect 
                      ref={leftInputRef}
                      color='blue'
                      state={displayInput} 
                      onClick={() => showDialogWithContent({ title: 'Input', values: { input: displayInput } })}
                    />
                    <Arrow direction="down" />
                    <Node
                      ref={rhoNodeRef}
                      label="ρ"
                      onClick={handlePClick}
                      highlight={highlightButton === 'p'}
                    />
                    <Arrow direction="down" />
                    {state.showInitialState ? (
                      <StateRect 
                        ref={initialStateNodeRef}
                        color='green'
                        state={formatState(state.initialState)} 
                        onClick={() => showDialogWithContent({ 
                          title: 'Initial State', 
                          values: { 
                            inputs: formatState(inputs.filter(Boolean)),
                            state: formatState(state.initialState)
                          } 
                        })}
                      />
                    ) : (
                      <StateRect state="?" showSymbol={true}/>
                    )}
                  </div>
                </div>

                <div className="absolute right-8 top-20">
                  <div className="flex flex-col items-center">
                    <StateRect 
                      showSymbol={state.step !== 4}
                      state={state.showFinalResult ? formatState(state.result) : '?'} 
                      onClick={state.showFinalResult ? () => showDialogWithContent({ title: 'Result', values: { result: formatState(state.result) } }) : null}
                    />
                    <Arrow direction="up" />
                    <Node
                      ref={piNodeRef}
                      label="π"
                      onClick={handlePiClick}
                      highlight={highlightButton === 'pi'}
                    />
                    <Arrow direction="up" />
                    {state.step >= 3.5 ? (
                      <StateRect 
                        ref={finalStateNodeRef}
                        color='red'
                        state={formatState(state.fNodes[state.fNodes.length - 1])} 
                        onClick={() => {
                          const lastNode = state.fNodes[state.fNodes.length - 1];
                          showDialogWithContent({ 
                            title: 'Final Node State', 
                            values: { 
                              state: formatState(lastNode)
                            } 
                          });
                        }}
                      />
                    ) : (
                      <StateRect state="?" showSymbol={true}/>
                    )}
                  </div>
                </div>
                
                {/* Existing diagonal arrows */}
                {topInputRef.current && rhoNodeRef.current && (
                  <Arrow 
                    direction="custom" 
                    startX={arrowCoords.input_to_rho.startX-50}
                    startY={arrowCoords.input_to_rho.startY-85}
                    endX={arrowCoords.input_to_rho.endX+20}
                    endY={arrowCoords.input_to_rho.endY-150}
                    style={{ zIndex: 10 }}
                  />
                )}
                
                {state.step>=4 && piNodeRef.current && rightResultRef.current && (
                  <Arrow 
                    direction="custom" 
                    startX={arrowCoords.pi_to_result.startX-20}
                    startY={arrowCoords.pi_to_result.startY-155}
                    endX={arrowCoords.pi_to_result.endX+40}
                    endY={arrowCoords.pi_to_result.endY-75}
                    style={{ zIndex: 10 }}
                  />
                )}

                {/* New arrow from initial state (ρ result) to first F chain node */}
                {state.step >= 2 && initialStateNodeRef.current && (firstFChainNodeRef.current || tNodeRef.current) && (
                  <Arrow 
                    direction="custom" 
                    startX={arrowCoords.rho_to_fchain.startX-15}
                    startY={arrowCoords.rho_to_fchain.startY-60}
                    endX={arrowCoords.rho_to_fchain.endX-140}
                    endY={arrowCoords.rho_to_fchain.endY-80}
                    style={{ zIndex: 10 }}
                  />
                )}

                {/* New arrow from last F chain node to π node */}
                {state.step >= 3.5 && finalStateNodeRef.current && piNodeRef.current && (
                  <Arrow 
                    direction="custom" 
                    startX={arrowCoords.fchain_to_pi.startX-60}
                    startY={arrowCoords.fchain_to_pi.startY+10}
                    endX={arrowCoords.fchain_to_pi.endX-15}
                    endY={arrowCoords.fchain_to_pi.endY+5}
                    style={{ zIndex: 10 }}
                  />
                )}

                {(state.step >= 2 || state.showT) && (
                  <div className="flex justify-center items-center mt-70 relative">
                    <div className="flex items-center overflow-x-auto" style={{ scrollbarWidth: 'thin', msOverflowStyle: 'none' }} id="nodeContainer">
                      <div className="flex items-center">
                        {state.step >= 2 && (
                          <>
                            <StateRect 
                              color='green'
                              state={formatState(state.initialState)} 
                              onClick={() => showDialogWithContent({ 
                                title: 'Initial State', 
                                values: { 
                                  inputs: formatState(inputs.filter(Boolean)),
                                  state: formatState(state.initialState)
                                } 
                              })}
                            />
                            <Arrow direction="right" />
                          </>
                        )}
                        <div className="flex items-center space-x-0 min-w-max">
                          {state.fNodes.map((stateNode, index) => (
                            <React.Fragment key={index}>
                              <Node
                                ref={index === 0 ? firstFChainNodeRef : null}
                                label="F"
                              />
                              <Arrow direction="right" />
                              <StateRect 
                                ref={index === state.fNodes.length - 1 ? lastFChainNodeRef : null}
                                color='yellow'
                                state={formatState(stateNode)} 
                                onClick={() => {
                                  showDialogWithContent({ 
                                    title: `Node State ${index + 1}`, 
                                    values: { 
                                      state: formatState(stateNode)
                                    } 
                                  });
                                }}
                              />
                              {index < state.fNodes.length - 1 || state.showT  ? (
                                <Arrow direction="right" />
                              ) : null}
                            </React.Fragment>
                          ))}
                        </div>
                        <div className="flex items-center space-x-0 min-w-max">
                          {state.showT && (
                            <>
                              <Node
                                ref={state.fNodes.length === 0 ? tNodeRef : null}
                                label="T"
                                onClick={handleTClick}
                                highlight={highlightButton === 't'}
                              />
                              <Arrow direction="right" />
                              {state.step < 3.5 ? (
                                <StateRect state="?" showSymbol={true}/>
                              ) : (
                                <StateRect 
                                  ref={finalStateNodeRef}
                                  state={formatState(state.fNodes[state.fNodes.length - 1])} 
                                  onClick={() => {
                                    const lastNode = state.fNodes[state.fNodes.length - 1];
                                    showDialogWithContent({ 
                                      title: 'Final Node State', 
                                      values: { 
                                        state: formatState(lastNode)
                                      } 
                                    });
                                  }}
                                />
                              )}
                            </>
                          )}
                        </div>
                        {/* <div className="flex items-center space-x-0 min-w-max">
                          {shouldShowIdentityNode && !state.showT && (
                            <>
                              <Node
                                label="T"
                                onClick={handleIClick}
                                highlight={false}
                              /> 
                              <Arrow direction="right" />
                              <StateRect 
                                color='red'
                                state={formatState(state.fNodes[state.fNodes.length - 1])} 
                                onClick={() => {
                                  const lastNode = state.fNodes[state.fNodes.length - 1];
                                  showDialogWithContent({ 
                                    title: 'Final Node State', 
                                    values: { 
                                      state: formatState(lastNode)
                                    } 
                                  });
                                }}
                              />
                            </>
                          )}
                        </div> */}
                      </div>
                    </div>
                  </div>
                )}

                {showDialog && dialogContent && (
                  <div className="absolute left-0 right-0 mt-15 flex justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-400">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">{dialogContent.title || 'Information'}</h3>
                        <button
                          className="cursor-pointer"
                          onClick={() => {
                            console.log('Closing dialog');
                            setShowDialog(false);
                            setDialogContent(null);
                          }}
                        >
                          X
                        </button>
                      </div>
                      {dialogContent.values && Object.entries(dialogContent.values).map(([key, value]) => (
                        <p key={key} className="text-lg">{key}: {value}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-40 p-4 bg-gray-100 rounded">
          {endOfAlgo
            ? 'End of Algorithm'
            : state.computationText ||
              (!inputs.some(Boolean)
                ? 'Enter values to start'
                : inputs.some(Boolean) && state.step === 0
                ? "Click 'f' to start the computation visualization"
                : state.step === 1
                ? "Click 'ρ' to initialize the state"
                : state.step === 2
                ? "Click 'T' to begin state transitions"
                : state.step === 3.5
                ? "Click 'π' to extract the final result"
                : state.step === 4
                ? `Result: ${formatState(state.result)}`
                : '')}
        </div>
      </div>
    </div>
  );
};

export default App;