import React, { useState, useEffect ,useRef} from 'react';
import { Controller } from './controller/Controller';
import { Node, StateNode, StateRect, Arrow } from './view/Node';



const App = ({ algorithm }) => {
  const [controller] = useState(() => new Controller(algorithm));
  const [showDialog, setShowDialog] = useState(null);
  const [renderTrigger, setRenderTrigger] = useState(0);
  const [inputs, setInputs] = useState(Array(algorithm.numInputs).fill(''));
  const [endOfAlgo, setEndOfAlgo] = useState(false);
  const [history, setHistory] = useState([]);
  const [futureState, setFutureState] = useState(null);
  const [first_time_T_final_state, setFirstTimeTFinalState] = useState(true);
  const state = controller.getState();



  useEffect(() => {
    controller.changeAlgorithm(algorithm);
    setInputs(Array(algorithm.numInputs).fill(''));
    setEndOfAlgo(false);
    setHistory([]);
    setFutureState(null);
    setRenderTrigger((prev) => prev + 1);
  }, [algorithm, controller]);

  useEffect(() => {
    setRenderTrigger((prev) => prev + 1);
    console.log('State updated:', state);
  }, [state.step, state.n, state.m, state.fNodes, state.result, state.showT, state.showInitialState, state.showFinalResult, state.computationText]);

  const handleUndo = () => {
    if (history.length === 0) return;

    console.log('Undo button clicked, history length:', history.length);
    setFutureState({
      state: { ...state },
      inputs: [...inputs],
      endOfAlgo,
    });

    const newHistory = [...history];
    const previousState = newHistory.pop();
    Object.assign(controller.model, previousState.state);
    setInputs(previousState.inputs);
    setEndOfAlgo(previousState.endOfAlgo);
    setHistory(newHistory);
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
      },
    ]);

    Object.assign(controller.model, futureState.state);
    setInputs(futureState.inputs);
    setEndOfAlgo(futureState.endOfAlgo);
    setFutureState(null);
    setRenderTrigger((prev) => prev + 1);
    console.log('State after redo:', controller.getState());
  };

  const handleReset = () => {
    console.log('Reset button clicked, resetting algorithm');
    // Reset the controller's model to its initial state
    controller.model.step = 0;
    controller.model.n = 0;
    controller.model.m = 0;
    controller.model.fNodes = [];
    controller.model.result = null;
    controller.model.showT = true;
    controller.model.showInitialState = false;
    controller.model.showFinalResult = false;
    controller.model.computationText = '';

    // Reset local state
    setInputs(Array(algorithm.numInputs).fill(''));
    setEndOfAlgo(false);
    setHistory([]);
    setFutureState(null);
    setShowDialog(null);
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
      },
    ]);
    setFutureState(null);

    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    controller.handleInputChange(...newInputs);
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
      },
    ]);
    setFutureState(null);
    controller.handleTClick();
    setEndOfAlgo(false);
    setRenderTrigger((prev) => prev + 1);
  };

  const displayInput = inputs.filter(Boolean).join(',');

  const shouldShowIdentityNode = state.step >= 3 && !state.showT && state.fNodes.length > 0;

 

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
                placeholder={state.algorithm.inputLabels[index] || `Input ${index + 1}`}
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
                <StateRect state={displayInput} />
                <Arrow direction="right" />
                <Node
                  label="f"
                  onClick={handleFClick}
                  highlight={highlightButton === 'f'}
                />
                <Arrow direction="right" />
                <StateRect state={state.showFinalResult ? state.result : '?'} />
              </div>
            </div>

            {state.step >= 1 && (
              <div>
                <div className="absolute left-8 top-20">
                  <div className="flex flex-col items-center">
                    <StateRect state={displayInput} />
                    <Arrow direction="down" />
                    <Node
                      label="ρ"
                      onClick={handlePClick}
                      highlight={highlightButton === 'p'}
                    />
                    <Arrow direction="down" />
                    {state.showInitialState  ? (
                      <StateRect state={controller.model.calculateRho(state.n, state.m)} />
                    ) : (
                      <StateRect state="?" />
                    )}
                  </div>
                </div>

                <div className="absolute right-8 top-20">
                  <div className="flex flex-col items-center">
                    <StateRect state={state.showFinalResult ? state.result : '?'} />
                    <Arrow direction="up" />
                    <Node
                      label="π"
                      onClick={handlePiClick}
                      highlight={highlightButton === 'pi'}
                    />
                    <Arrow direction="up" />
                    {state.step >= 3.5 ? (
                      <StateRect state={state.fNodes[state.fNodes.length - 1]} />
                    ) : (
                      <StateRect state="?" />
                    )}
                  </div>
                </div>

                {(state.step >= 2 || state.showT) && (
                  <div className="flex justify-center items-center mt-70">
                    <div className="flex items-center overflow-x-auto">
                      {state.step >= 2 && (
                        <>
                          <StateRect state={controller.model.calculateRho(state.n, state.m)} />
                          <Arrow direction="right" />
                        </>
                      )}
                      <div className="flex items-center space-x-0 min-w-max">
                      {state.fNodes.map((stateNode, index) => (
                        <React.Fragment key={index}>
                          <Node
                            label="F"
                            onClick={() => {
                              console.log('Clicked F node at index:', index);
                              setHistory((prev) => [
                                ...prev,
                                {
                                  state: { ...state },
                                  inputs: [...inputs],
                                  endOfAlgo,
                                },
                              ]);
                              setFutureState(null);
                              setShowDialog(index);
                            }}
                          />
                          <Arrow direction="right" />
                          <StateRect state={stateNode} />
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
                            <StateRect state="?" />
                          ) : (
                            <StateRect state={state.fNodes[state.fNodes.length - 1]} />
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
                          <Node
                          label="I"
                          onClick={handleIClick}
                          highlight={false}
                        />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                )}

                {showDialog !== null && (
                  <div className="absolute left-0 right-0 mt-15 flex justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-400">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Current State</h3>
                        <button
                          className="cursor-pointer"
                          onClick={() => {
                            console.log('Closing dialog');
                            setShowDialog(null);
                          }}
                        >
                          X
                        </button>
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

        <div className="text-center mt-40 p-4 bg-gray-100 rounded">
          {endOfAlgo
            ? 'End of Algorithm'
            : state.computationText ||
              (!inputs.some(Boolean)
                ? 'Enter a number to start'
                : inputs.some(Boolean) && state.step === 0
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
    </div>
  );
};

export default App;