export class Model {
  constructor(config) {
    console.log('Initializing model with config:', config.name);
    this.config = config;
    this.n = ''; // First input (base or first number)
    this.m = ''; // Second input (power or second number)
    this.step = 0;
    this.fNodes = [];
    this.result = null;
    this.showT = false;
    this.showInitialState = false;
    this.showFinalResult = false;
    this.computationText = '';
    this.history = [];
    this.history.push(this.getState()); // Initialize with initial state
  }

  setInput(nValue, mValue = '') {
    console.log('Setting inputs:', nValue, mValue);
    const parsedN = parseInt(nValue);
    const parsedM = mValue ? parseInt(mValue) : '';
    if (!isNaN(parsedN) && parsedN >= 0) {
      this.n = parsedN;
      this.m = parsedM !== '' && !isNaN(parsedM) && parsedM >= 0 ? parsedM : '';
      // For exponentiation and gcd, set the base in the config
      if (this.config.name === 'exponentiation' || this.config.name === 'gcd') {
        this.config.base = parsedN; // Store base for exponentiation
      }
      this.reset();
      this.history.push(this.getState()); // Save state after update
    } else {
      this.n = '';
      this.m = '';
    }
    console.log('Inputs set to:', this.n, this.m, 'History length:', this.history.length);
  }

  reset() {
    console.log('Resetting model state');
    this.step = 0;
    this.fNodes = [];
    this.result = null;
    this.showT = false;
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

  setResult(result) {
    console.log('Setting result:', result);
    this.result = result;
  }

  saveState() {
    console.log('Saving state to history');
    this.history.push(this.getState());
    console.log('History length:', this.history.length);
  }

  undo() {
    console.log('Undoing to previous state, Current History length:', this.history.length);
    if (this.history.length > 1) { // Leave at least the initial state
      const previousState = this.history.pop(); // Pop the previous state
      if (previousState) {
        this.n = previousState.n;
        this.m = previousState.m;
        this.step = previousState.step;
        this.fNodes = [...previousState.fNodes];
        this.result = previousState.result;
        this.showT = previousState.showT;
        this.showInitialState = previousState.showInitialState;
        this.showFinalResult = previousState.showFinalResult;
        this.computationText = previousState.computationText;
        // Restore config.base if applicable
        if (this.config.name === 'exponentiation' || this.config.name === 'gcd') {
          this.config.base = previousState.n;
        }

        // Special handling for specific undo cases
        if (this.step === 1 && previousState.step === 2) {
          // Undo from ρ: Reset initial state and remove T input
          this.showInitialState = false;
          this.fNodes = [];
          console.log('Undid ρ, reset initial state and T input');
        } else if (this.step === 3 && previousState.step === 3 && this.fNodes.length > previousState.fNodes.length) {
          // Undo from T: Remove the last F node
          this.fNodes.pop();
          this.computationText = this.fNodes.length > 0 
            ? `Iteration ${this.fNodes.length}: F(${this.fNodes[this.fNodes.length - 1][0]},${this.fNodes[this.fNodes.length - 1][1]}) = (?)`
            : 'Click T to begin state transitions';
          console.log('Undid T, removed last F node');
        } else if (this.step === 3.5 && previousState.step === 4) {
          // Undo from π: Reset final result and show ?
          this.showFinalResult = false;
          this.result = null;
          this.computationText = 'Click π to extract the final result';
          console.log('Undid π, reset final result');
        }

        console.log('Undone to step:', this.step, 'History length:', this.history.length);
      }
    } else {
      console.log('No previous state to undo');
    }
  }

  calculateNextState(...args) {
    const nextState = this.config.calculateNextState(...args);
    console.log(`Calculating next state for args=${args}:`, nextState);
    return nextState;
  }

  calculateRho(n, m) {
    let rho;
    if (this.config.name === 'exponentiation' || this.config.name === 'gcd') {
      rho = this.config.calculateRho(n, m);
    } else {
      rho = this.config.calculateRho(n);
    }
    console.log(`Calculating ρ(${n}${m !== '' ? `,${m}` : ''}):`, rho);
    return rho;
  }

  calculatePi(...args) {
    const pi = this.config.calculatePi(...args);
    console.log(`Calculating π(${args}):`, pi);
    return pi;
  }

  getState() {
    return {
      n: this.n,
      m: this.m,
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