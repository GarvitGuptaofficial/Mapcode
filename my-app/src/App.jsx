import React, { useState, useEffect } from 'react';
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
  const [futureState, setFutureState] = useState(null);
  const [first_time_T_final_state, setFirstTimeTFinalState] = useState(true);
  const state = controller.getState();

  useEffect(() => {
    controller.changeAlgorithm(algorithm);
    setInputs(Array(algorithm.numInputs || 1).fill(''));
    setEndOfAlgo(false);
    setHistory([]);
    setFutureState(null);
    setRenderTrigger((prev) => prev + 1);
  }, [algorithm, controller]);

  useEffect(() => {
    setRenderTrigger((prev) => prev + 1);
    console.log('State updated:', state);
  }, [state.step, state.inputs, state.fNodes, state.result, state.showT, state.showInitialState, state.showFinalState, state.computationText]);



  const handleUndo = () => {
    if (history.length === 0) return;
  
    console.log('Undo button clicked, history length:', history.length);
    
    // Create future state before changing anything
    setFutureState({
      state: { ...state },
      inputs: [...inputs],
      endOfAlgo,
      first_time_T: first_time_T_final_state
    });
  
    const newHistory = [...history];
    const previousState = newHistory.pop();
    
    // Directly update controller's model state instead of object assign
    controller.model.inputs = [...previousState.state.inputs];
    controller.model.initialState = previousState.state.initialState;
    controller.model.step = previousState.state.step;
    controller.model.fNodes = [...previousState.state.fNodes];
    controller.model.result = previousState.state.result;
    controller.model.showT = previousState.state.showT;
    controller.model.showInitialState = previousState.state.showInitialState;
    controller.model.showFinalResult = previousState.state.showFinalResult;
    controller.model.computationText = previousState.state.computationText;
    
    // Update the app's state variables
    setInputs(previousState.inputs);
    setEndOfAlgo(previousState.endOfAlgo);
    setFirstTimeTFinalState(previousState.first_time_T || true);
    setHistory(newHistory);
    
    // Force a render update
    setRenderTrigger((prev) => prev + 1);
    console.log('State after undo:', controller.getState());
  };

  const handleRedo = () => {
    if (!futureState) return;
  
    console.log('Redo button clicked, future state:', futureState);
    setHistory((prev) => [
      ...prev,
      {
        state: { ...state },
        inputs: [...inputs],
        endOfAlgo,
        first_time_T: first_time_T_final_state
      },
    ]);
  
    // Directly update controller's model state
    controller.model.inputs = [...futureState.state.inputs];
    controller.model.initialState = futureState.state.initialState;
    controller.model.step = futureState.state.step;
    controller.model.fNodes = [...futureState.state.fNodes];
    controller.model.result = futureState.state.result;
    controller.model.showT = futureState.state.showT;
    controller.model.showInitialState = futureState.state.showInitialState;
    controller.model.showFinalResult = futureState.state.showFinalResult;
    controller.model.computationText = futureState.state.computationText;
    
    setInputs(futureState.inputs);
    setEndOfAlgo(futureState.endOfAlgo);
    setFirstTimeTFinalState(futureState.first_time_T || true);
    setFutureState(null);
    
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

    // Reset local state
    setInputs(Array(algorithm.numInputs || 1).fill(''));
    setEndOfAlgo(false);
    setHistory([]);
    setFutureState(null);
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
        endOfAlgo,
        first_time_T: first_time_T_final_state
      },
    ]);
    setFutureState(null);

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
        endOfAlgo,
        first_time_T: first_time_T_final_state
      },
    ]);
    setFutureState(null);
    setEndOfAlgo(true);
  };

  const handleFClick = () => {
    console.log('Clicked f button, current step:', state.step);
    setHistory((prev) => [
      ...prev,
      {
        state: { ...state },
        inputs: [...inputs],
        endOfAlgo,
        first_time_T: first_time_T_final_state
      },
    ]);
    setFutureState(null);
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
        endOfAlgo,
        first_time_T: first_time_T_final_state
      },
    ]);
    setFutureState(null);
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
        endOfAlgo,
        first_time_T: first_time_T_final_state
      },
    ]);
    setFutureState(null);
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
        endOfAlgo,
        first_time_T: first_time_T_final_state
      },
    ]);
    setFutureState(null);
    controller.handleTClick();
    setEndOfAlgo(false);
    setRenderTrigger((prev) => prev + 1);
  };

  // New function to show dialog with custom content
  const showDialogWithContent = (content) => {
    console.log('Showing dialog with content:', content);
    // setHistory((prev) => [
    //   ...prev,
    //   {
    //     state: { ...state },
    //     inputs: [...inputs],
    //     endOfAlgo,
    //     first_time_T: first_time_T_final_state
    //   },
    // ]);
    // setFutureState(null);
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
              className={`p-2 rounded ${futureState ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
              disabled={!futureState}
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
                    color='blue'
                      state={displayInput} 
                      onClick={() => showDialogWithContent({ title: 'Input', values: { input: displayInput } })}
                    />
                    <Arrow direction="down" />
                    <Node
                      label="ρ"
                      onClick={handlePClick}
                      highlight={highlightButton === 'p'}
                    />
                    <Arrow direction="down" />
                    {state.showInitialState ? (
                      <StateRect 
                      // showSymbol={state.step !== 1}
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
                      label="π"
                      onClick={handlePiClick}
                      highlight={highlightButton === 'pi'}
                    />
                    <Arrow direction="up" />
                    {state.step >= 3.5 ? (
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
                    ) : (
                      <StateRect state="?" showSymbol={true}/>
                    )}
                  </div>
                </div>

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
                            label="F"
                            // onClick={() => {
                            //   showDialogWithContent({ 
                            //     title: `Node State ${index + 1}`, 
                            //     values: { 
                            //       state: formatState(stateNode)
                            //     } 
                            //   });
                            // }}
                          />
                          <Arrow direction="right" />
                          <StateRect 
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
                          {index < state.fNodes.length - 1 || state.showT || shouldShowIdentityNode ? (
                            <Arrow direction="right" />
                          ) : null}
                        </React.Fragment>
                      ))}
                      </div>
                      <div className="flex items-center space-x-0 min-w-max">
                      {state.showT && (
                        <>
                        {/* T node */}
                          <Node
                            label="T"
                            onClick={handleTClick}
                            highlight={highlightButton === 't'}
                          />
                          <Arrow direction="right" />
                          {state.step < 3.5 ? (
                            <StateRect state="?" showSymbol={true}/>
                          ) : (
                            <StateRect 
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
                      <div className="flex items-center space-x-0 min-w-max">
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
                    </div>
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