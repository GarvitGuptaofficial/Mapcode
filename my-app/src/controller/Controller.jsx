import { Model } from '../model/Model';

export class Controller {
  constructor(config) {
    console.log('Initializing controller with config:', config.name);
    this.model = new Model(config);
  }

  handleInputChange(...inputs) {
    console.log('Handling input change:', inputs);
    // Pass the first two inputs (n and m) to setInput, ignore extras for now
    this.model.setInput(inputs[0] || '', inputs[1] || '');
  }

  handleFClick() {
    const state = this.model.getState();
    console.log('handleFClick called, current step:', state.step);
    if (state.step === 0) {
      this.model.setStep(1);
      this.model.setShowT(true);
      this.model.setComputationText('');
      this.model.saveState(); // Save state after all updates
      console.log('Updated step to 1, showT:', true);
    }
  }

  handlePClick() {
    const state = this.model.getState();
    console.log('handlePClick called, current step:', state.step);
    if (state.step === 1) {
      this.model.setStep(2);
      this.model.setShowInitialState(true);
      const n = state.n;
      const m = state.m;
      const initialState = this.model.calculateRho(n, m);
      let computationText = '';
      if (this.model.config.name === 'exponentiation' || this.model.config.name === 'gcd') {
        computationText = `ρ(${n},${m}) = (${initialState.join(',')}) : Initial state setup`;
      } else {
        computationText = `ρ(${n}) = (${initialState[0]},${initialState[1]}) : Initial state setup`;
      }
      this.model.setComputationText(computationText);
      this.model.saveState(); // Save state after all updates
      console.log('Updated step to 2, initial state:', initialState);
    }
  }

  handleTClick() {
    const state = this.model.getState();
    console.log('handleTClick called, current step:', state.step);
    if (state.step === 2 && state.fNodes.length === 0) {
      const initialState = this.model.calculateRho(state.n, state.m);
      const firstTransition = this.model.calculateNextState(...initialState);
      this.model.setFNodes([firstTransition]);
      let computationText = '';
      if (this.model.config.name === 'exponentiation' || this.model.config.name === 'gcd') {
        computationText = `Iteration 1: F(${initialState.join(',')}) = (${firstTransition.join(',')})`;
      } else {
        computationText = `Iteration 1: F(${initialState[0]},${initialState[1]}) = (${firstTransition[0]},${firstTransition[1]})`;
      }
      this.model.setComputationText(computationText);
      this.model.setStep(3);
      this.model.saveState(); // Save state after all updates
      console.log('Updated step to 3, first transition:', firstTransition);
    } else if (state.step === 3) {
      const lastState = state.fNodes[state.fNodes.length - 1];
      const nextState = this.model.calculateNextState(...lastState);
      this.model.setFNodes([...state.fNodes, nextState]);
      let computationText = '';
      if (this.model.config.name === 'exponentiation' || this.model.config.name === 'gcd') {
        computationText = `Iteration ${state.fNodes.length + 1}: F(${lastState.join(',')}) = (${nextState.join(',')})`;
      } else {
        computationText = `Iteration ${state.fNodes.length + 1}: F(${lastState[0]},${lastState[1]}) = (${nextState[0]},${nextState[1]})`;
      }
      this.model.setComputationText(computationText);

      // Check for fixed point
      let reachedFixedPoint = false;
      if (this.model.config.name === 'factorial' || this.model.config.name === 'exponentiation') {
        reachedFixedPoint = nextState[0] === 0;
      } else if (this.model.config.name === 'gcd') {
        reachedFixedPoint = nextState[1] === 0;
      } else {
        reachedFixedPoint = nextState[0] === 0; // Default for sum
      }

      if (reachedFixedPoint) {
        this.model.setShowT(false);
        this.model.setStep(3.5);
        const result = this.model.calculatePi(...nextState);
        this.model.setResult(result);
        console.log('Reached fixed point, result:', result);
      } else {
        console.log('Next state:', nextState);
      }
      this.model.saveState(); // Save state after all updates
    }
  }

  handlePiClick() {
    const state = this.model.getState();
    console.log('handlePiClick called, current step:', state.step);
    if (state.step === 3.5) {
      this.model.setShowFinalResult(true);
      this.model.setStep(4);
      const lastState = state.fNodes[state.fNodes.length - 1];
      const result = state.result;
      let computationText = '';
      if (this.model.config.name === 'exponentiation' || this.model.config.name === 'gcd') {
        computationText = `π(${lastState.join(',')}) = ${result} : Final result extraction`;
      } else {
        computationText = `π(${lastState[0]},${lastState[1]}) = ${result} : Final result extraction`;
      }
      this.model.setComputationText(computationText);
      this.model.saveState(); // Save state after all updates
      console.log('Updated step to 4, final result:', result);
    }
  }

  undo() {
    this.model.undo();
  }

  changeAlgorithm(config) {
    console.log('Changing algorithm to:', config.name);
    const currentN = this.model.getState().n;
    const currentM = this.model.getState().m;
    this.model = new Model(config);
    this.model.setInput(currentN || '', currentM || '');
  }

  getState() {
    return this.model.getState();
  }
}