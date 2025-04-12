import React, { useState, useEffect, useRef } from 'react';
import { Controller } from './controller/Controller';
import { StateRect, Edge, DiagonalEdge } from './view/Node';

const App = ({ algorithm }) => {
  const [controller] = useState(() => new Controller(algorithm));
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [renderTrigger, setRenderTrigger] = useState(0);
  const [inputs, setInputs] = useState(Array(algorithm.numInputs || 1).fill(''));
  const [endOfAlgo, setEndOfAlgo] = useState(false);
  const [history, setHistory] = useState([]);
  const [futureStates, setFutureStates] = useState([]);
  const state = controller.getState();

  useEffect(() => {
    controller.changeAlgorithm(algorithm);
    setInputs(Array(algorithm.numInputs || 1).fill(''));
    setEndOfAlgo(false);
    setHistory([]);
    setFutureStates([]);
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
      ...prevFutureStates
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
    
    setInputs(previousState.inputs);
    setEndOfAlgo(previousState.endOfAlgo);
    setHistory(newHistory);
    
    setRenderTrigger((prev) => prev + 1);
    console.log('State after undo:', controller.getState());
  };

  const handleRedo = () => {
    if (futureStates.length === 0) return;
  
    console.log('Redo button clicked, future states available:', futureStates.length);
    
    const nextFutureState = futureStates[0];
    const remainingFutureStates = futureStates.slice(1);
    
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
    setFutureStates(remainingFutureStates);
    
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
    controller.model.first_time_T_final_state = true;

    // Reset local state
    setInputs(Array(algorithm.numInputs || 1).fill(''));
    setEndOfAlgo(false);
    setHistory([]);
    setFutureStates([]);
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
    setFutureStates([]);

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
    setFutureStates([]);
    setEndOfAlgo(true);
  };

  const handleFClick = () => {
    console.log('Clicked f edge, current step:', state.step);
    setHistory((prev) => [
      ...prev,
      {
        state: { ...state },
        inputs: [...inputs],
        endOfAlgo
      },
    ]);
    setFutureStates([]);
    controller.handleFClick();
    setEndOfAlgo(false);
    setRenderTrigger((prev) => prev + 1);
  };

  const handlePClick = () => {
    console.log('Clicked ρ edge, current step:', state.step);
    setHistory((prev) => [
      ...prev,
      {
        state: { ...state },
        inputs: [...inputs],
        endOfAlgo
      },
    ]);
    setFutureStates([]);
    controller.handlePClick();
    setEndOfAlgo(false);
    setRenderTrigger((prev) => prev + 1);
  };

  const handlePiClick = () => {
    console.log('Clicked π edge, current step:', state.step);
    setHistory((prev) => [
      ...prev,
      {
        state: { ...state },
        inputs: [...inputs],
        endOfAlgo
      },
    ]);
    setFutureStates([]);
    controller.handlePiClick();
    setEndOfAlgo(false);
    setRenderTrigger((prev) => prev + 1);
  };

  const handleTClick = () => {
    console.log('Clicked T edge, current step:', state.step);
    setHistory((prev) => [
      ...prev,
      {
        state: { ...state },
        inputs: [...inputs],
        endOfAlgo
      },
    ]);
    setFutureStates([]);
    controller.handleTClick();
    setEndOfAlgo(false);
    setRenderTrigger((prev) => prev + 1);
  };

  const showDialogWithContent = (content) => {
    console.log('Showing dialog with content:', content);
    setDialogContent(content);
    setShowDialog(true);
  };

  const displayInput = inputs.filter(Boolean).join(',');

  // Function to format display of state arrays
  const formatState = (stateArray) => {
    if (!Array.isArray(stateArray)) return stateArray;
    return stateArray.join(',');
  };

  // Create refs for the nodes we want to connect
  const topLeftNodeRef = useRef(null);
  const topRightNodeRef = useRef(null);
  const bottomLeftNodeRef = useRef(null);
  const bottomRightNodeRef = useRef(null);
  
  // Calculate diagram dimensions based on content
  // Base width for the diagram
  const baseWidth = 500;
  
  // Calculate width needed for F chain (if any)
  const fChainWidth = state.fNodes.length > 0 ? state.fNodes.length * 100 : 100;
  
  // Total width is the maximum of base width or F chain width plus some padding
  const totalWidth = Math.max(baseWidth, fChainWidth + 200);
  
  // Calculate positions for the rectangular layout
  const margin = 50;
  const width = totalWidth - (2 * margin);
  const height = 200;
  
  // Calculate coordinates for the rectangular structure
  const topY = 80;
  const bottomY = topY + height;
  const leftX = margin;
  const rightX = totalWidth - margin;
  
  // Calculate midpoints for T edge
  const midX = (leftX + rightX) / 2;

  // Check if there's valid input and step > 0 to determine if bottom edges are visible
  const showBottomStructure = inputs.some(Boolean) && state.step > 0;
  
  // Calculate the dynamic width for f edge based on F chain length
  const fEdgeWidth = state.fNodes.length > 0 
    ? leftX + 20 + (state.fNodes.length * 100) - (leftX + 40)
    : rightX - leftX - 40;
  
  // Calculate positions for the T edge
  const tEdgeStartX = leftX + 20;
  const tEdgeStartY = bottomY + 10; // Slightly below the bottom nodes
  const tEdgeEndX = rightX - 20;
  const tEdgeEndY = topY - 10; // Slightly above the top nodes

  // Calculate positions for the dynamic π edge
  const piEdgeStartX = state.fNodes.length > 0 
    ? leftX + 20 + (state.fNodes.length * 100) 
    : leftX + 60;
  const piEdgeStartY = bottomY - 5;
  const piEdgeEndX = rightX - 5;
  const piEdgeEndY = topY + 5;
  
  return (
    <div className="flex">
      <div className="flex-1 max-w-6xl mx-auto p-4">
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

        <div className="relative mb-8 bg-white" style={{ height: "500px", width: "100%" , transform: "translateX(200px)translateY(-15px)"}}>
          {/* Top Rectangle Structure */}
          <div className="absolute" style={{ top: topY, width: "100%" }}>
            <div className="flex items-center">
              {/* Top Left Node */}
              {inputs.some(Boolean) && (
                <div style={{ top:topY,position: 'absolute', left: leftX }}>
                  <StateRect 
                    ref={topLeftNodeRef}
                    color='blue'
                    state={displayInput} 
                    onClick={() => showDialogWithContent({ title: 'Input', values: { input: displayInput } })}
                  />
                </div>
              )}
              
              {/* Main f edge between left and right nodes - Made diagonal */}
              {inputs.some(Boolean) && state.step<3.5 && (
                <DiagonalEdge
                  label="f"
                  onClick={handleFClick}
                  highlight={highlightButton === 'f'}
                  startX={leftX + 50}
                  startY={topY+10}
                  endX={rightX-30+(state.fNodes.length > 0 ? (state.fNodes.length * 138) : 0)}
                  endY={topY +10}
                  style={{}}
                />
              )}

              {inputs.some(Boolean) && state.step>=3.5 && (
                <DiagonalEdge
                  label="f"
                  onClick={handleFClick}
                  highlight={highlightButton === 'f'}
                  startX={leftX + 50}
                  startY={topY+10}
                  endX={leftX-10  + (state.fNodes.length > 0 ? (state.fNodes.length * 138) : 0)}
                  endY={topY +10}
                  style={{}}
                />
              )}
              
              {/* Top Right Node */}
              {inputs.some(Boolean) && state.step<3.5 && (
                <div style={{ top:topY,position: 'absolute', left: rightX-20+(state.fNodes.length > 0 ? (state.fNodes.length * 138) : 0)}}>
                  <StateRect 
                    ref={topRightNodeRef}
                    showSymbol={state.step !== 4}
                    state={state.showFinalResult ? formatState(state.result) : '?'} 
                    onClick={state.showFinalResult ? () => showDialogWithContent({ title: 'Result', values: { result: formatState(state.result) } }) : null}
                  />
                </div>
              )}


            {inputs.some(Boolean) && state.step>=3.5 && (
                <div style={{ top:topY,position: 'absolute', left: leftX-10  + (state.fNodes.length > 0 ? (state.fNodes.length * 138) : 0)}}>
                  <StateRect 
                    ref={topRightNodeRef}
                    showSymbol={state.step !== 4}
                    state={state.showFinalResult ? formatState(state.result) : '?'} 
                    onClick={state.showFinalResult ? () => showDialogWithContent({ title: 'Result', values: { result: formatState(state.result) } }) : null}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Structure - Only show after f is clicked (step > 0) */}
          {showBottomStructure && (
  <div className="absolute" style={{ top: bottomY + 100, left: leftX }}>
    <div className="flex items-center">
      {/* Bottom Left Node - Initially ? */}
      <StateRect 
        ref={bottomLeftNodeRef}
        color={state.step >= 2 ? 'green' : 'gray'}
        showSymbol={state.step < 2}
        state={state.step >= 2 ? formatState(state.initialState) : '?'} 
        onClick={state.step >= 2 ? () => showDialogWithContent({ 
          title: 'Initial State', 
          values: { 
            inputs: formatState(inputs.filter(Boolean)),
            state: formatState(state.initialState)
          }
        }) : null}
      />
      
      {/* F Chain (shown after step 2) */}
      {state.fNodes.length > 0 && (
        <div className="flex items-center">
          {state.fNodes.map((stateNode, index) => (
            <React.Fragment key={index}>
              <Edge
                label="F"
                className="w-16"
              />
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
            </React.Fragment>
          ))}
        </div>
      )}
      
      {/* Bottom Right Node with ? (positioned after T edge) */}
      {state.showT && (
        <div style={{ position: 'absolute', left: rightX - 70 + (state.fNodes.length > 0 ? (state.fNodes.length * 138) : 0)}}>
          <StateRect 
            ref={bottomRightNodeRef}
            showSymbol={true}
            state="?" 
          />
        </div>
      )}
      
      {/* Final Node after T (only show if there are F nodes) */}
      {/* {state.step >= 3.5 && state.fNodes.length > 0 && (
        <StateRect 
          ref={bottomRightNodeRef}
          color='red'
          state={formatState(state.fNodes[state.fNodes.length - 1] || [])} 
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
      )} */}
    </div>
  </div>
)}

{showBottomStructure && state.showT && (
  <div>
    <DiagonalEdge
      label="T"
      onClick={handleTClick}
      highlight={highlightButton === 't'}
      startX={leftX + (state.fNodes.length > 0 ? leftX+(state.fNodes.length * 138) : leftX)}
      startY={bottomY + 113}
      endX={rightX - 30 + (state.fNodes.length > 0 ? (state.fNodes.length * 138) : 0)}
      endY={bottomY + 113}
      style={{}}
    />
  </div>
)}

{showBottomStructure && state.step<3.5&& (
  <div>
    <DiagonalEdge
      label="π"
      onClick={handlePiClick}
      highlight={highlightButton === 'pi'}
      startX={rightX  + (state.fNodes.length > 0 ? (state.fNodes.length * 138) : 0)}
      startY={bottomY + 90}
      endX={rightX  + (state.fNodes.length > 0 ? (state.fNodes.length * 138) : 0)}
      endY={topY + 110}
      style={{}}
    />
  </div>
)}

{showBottomStructure && state.step>=3.5&& (
  <div>
    <DiagonalEdge
      label="π"
      onClick={handlePiClick}
      highlight={highlightButton === 'pi'}
      startX={leftX+10+(state.fNodes.length > 0 ? (state.fNodes.length * 138) : 0)}
      startY={bottomY + 90}
      endX={leftX+10  + (state.fNodes.length > 0 ? (state.fNodes.length * 138) : 0)}
      endY={topY + 110}
      style={{}}
    />
  </div>
)}


          {/* Diagonal ρ Edge - from top left to bottom left - only show after f is clicked */}
          {showBottomStructure && (
            <div>
              <DiagonalEdge
                label="ρ"
                onClick={handlePClick}
                highlight={highlightButton === 'p'}
                startX={leftX + 20}
                startY={topY + 110}
                endX={leftX + 20}
                endY={bottomY + 90}
                style={{}}
              />
            </div>
          )}


          {/* Dialog */}
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

        <div className="text-center mt-8 p-4 bg-gray-100 rounded">
          {endOfAlgo
            ? 'End of Algorithm'
            : state.computationText ||
              (!inputs.some(Boolean)
                ? 'Enter values to start'
                : inputs.some(Boolean) && state.step === 0
                ? "Click the 'f' edge to start the computation visualization"
                : state.step === 1
                ? "Click the 'ρ' edge to initialize the state"
                : state.step === 2
                ? "Click the 'T' edge to begin state transitions"
                : state.step === 3.5
                ? "Click the 'π' edge to extract the final result"
                : state.step === 4
                ? `Result: ${formatState(state.result)}`
                : '')}
        </div>
      </div>
    </div>
  );
};

export default App;