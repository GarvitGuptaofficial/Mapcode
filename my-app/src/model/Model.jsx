export class Model {
  constructor(config) {
    console.log('Initializing model with config:', config.name);
    this.config = config;
    this.inputs = []; // Array to store all inputs
    this.initialState = null; // Store the initial state
    this.step = 0;
    this.fNodes = [];
    this.result = null;
    this.showT = true;
    this.showInitialState = false;
    this.showFinalResult = false;
    this.computationText = '';
    this.history = [];
    this.history.push(this.getState()); // Initialize with initial state
  }

  setInputs(inputs) {
    console.log('Setting inputs:', inputs);
    if (Array.isArray(inputs)) {
      this.inputs = inputs.map(input => {
        const parsed = parseInt(input);
        return !isNaN(parsed) && parsed >= 0 ? parsed : '';
      }).filter(input => input !== '');
    } else {
      this.inputs = [];
    }
    this.reset();
    this.history.push(this.getState()); // Save state after update
    console.log('Inputs set to:', this.inputs, 'History length:', this.history.length);
  }

  reset() {
    console.log('Resetting model state');
    this.step = 0;
    this.initialState = null;
    this.fNodes = [];
    this.result = null;
    this.showT = true;
    this.showInitialState = false;
    this.showFinalResult = false;
    this.computationText = '';
  }

  setStep(step) {
    console.log('Setting step:', step);
    this.step = step;
  }

  setShowT(show) {
    console.log('Setting showT:', show);
    this.showT = show;
  }

  setShowInitialState(show) {
    console.log('Setting showInitialState:', show);
    this.showInitialState = show;
  }

  setShowFinalResult(show) {
    console.log('Setting showFinalResult:', show);
    this.showFinalResult = show;
  }

  setComputationText(text) {
    console.log('Setting computationText:', text);
    this.computationText = text;
  }

  setFNodes(nodes) {
    console.log('Setting fNodes:', nodes);
    this.fNodes = nodes;
  }

  setInitialState(state) {
    console.log('Setting initialState:', state);
    this.initialState = state;
  }

  setResult(result) {
    console.log('Setting result:', result);
    this.result = result;
  }

  saveState() {
    console.log('Saving state to history');
    this.history.push(this.getState());
    console.log('History length:', this.history.length);
    console.log('Current state:', this.getState());
  }

  undo() {
    console.log('Undoing to previous state, Current History length:', this.history.length);
    if (this.history.length > 1) { // Leave at least the initial state
      this.history.pop(); // Remove current state
      const previousState = this.history[this.history.length - 1]; // Get previous state
      
      if (previousState) {
        // Copy previous state properties
        this.inputs = [...previousState.inputs];
        this.initialState = previousState.initialState;
        this.step = previousState.step;
        this.fNodes = [...previousState.fNodes];
        this.result = previousState.result;
        this.showT = previousState.showT;
        this.showInitialState = previousState.showInitialState;
        this.showFinalResult = previousState.showFinalResult;
        this.computationText = previousState.computationText;
        
        console.log('Undone to step:', this.step, 'History length:', this.history.length);
      }
    } else {
      console.log('No previous state to undo');
    }
  }

  calculateNextState(...args) {
    if (typeof this.config.calculateNextState === 'function') {
      const nextState = this.config.calculateNextState(...args);
      console.log(`Calculating next state for args=${args}:`, nextState);
      return nextState;
    }
    console.error('calculateNextState not defined in algorithm config');
    return args;
  }

  calculateRho(...args) {
    if (typeof this.config.calculateRho === 'function') {
      const rho = this.config.calculateRho(...args);
      console.log(`Calculating ρ(${args}):`, rho);
      return rho;
    }
    console.error('calculateRho not defined in algorithm config');
    return args;
  }

  calculatePi(...args) {
    if (typeof this.config.calculatePi === 'function') {
      const pi = this.config.calculatePi(...args);
      console.log(`Calculating π(${args}):`, pi);
      return pi;
    }
    console.error('calculatePi not defined in algorithm config');
    return args[0];
  }

  checkTerminationCondition(state) {
    if (typeof this.config.checkTerminationCondition === 'function') {
      return this.config.checkTerminationCondition(state);
    }
    
    // Default termination condition if not specified in config
    if (this.fNodes.length > 0) {
      const previousState = this.fNodes[this.fNodes.length - 1];
      
      // Compare arrays or simple values
      if (Array.isArray(state) && Array.isArray(previousState)) {
        return state.length === previousState.length && 
               state.every((val, idx) => val === previousState[idx]);
      } else {
        return state === previousState;
      }
    }
    return false;
  }

  getState() {
    return {
      inputs: this.inputs,
      initialState: this.initialState,
      step: this.step,
      fNodes: this.fNodes,
      result: this.result,
      showT: this.showT,
      showInitialState: this.showInitialState,
      showFinalResult: this.showFinalResult,
      computationText: this.computationText,
      algorithmName: this.config.name,
      algorithm: this.config, // Include the full config object
    };
  }
}