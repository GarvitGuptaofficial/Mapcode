import { Model } from '../model/Model';

// let first_time_T_final_state = true;

export class Controller {
  constructor(config) {
    console.log('Initializing controller with config:', config.name);
    this.model = new Model(config);
    this.first_time_T_final_state = true; // Move it into the class
  }
  

  handleInputChange(inputs) {
    // Reset transition state
    this.first_time_T_final_state = true;
    console.log('Handling input change:', inputs);
    
    // Pass all inputs to the model
    this.model.setInputs(inputs.filter(input => input !== ''));
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
      
      // Calculate initial state based on inputs
      const inputs = state.inputs;
      const initialState = this.model.calculateRho(...inputs);
      this.model.setInitialState(initialState);
      
      // Generate computation text description
      let computationText = `ρ(${inputs.join(',')}) = (${Array.isArray(initialState) ? initialState.join(',') : initialState}) : Initial state setup`;
      this.model.setComputationText(computationText);
      
      this.model.saveState(); // Save state after all updates
      console.log('Updated step to 2, initial state:', initialState);
    }
  }

  handleTClick() {
    const state = this.model.getState();
    console.log('handleTClick called, current step:', state.step);
    
    if (state.step === 2 && state.fNodes.length === 0) {
      // First transition from initial state
      const initialState = state.initialState;
      const firstTransition = this.model.calculateNextState(...(Array.isArray(initialState) ? initialState : [initialState]));
      this.model.setFNodes([firstTransition]);
      
      // Generate computation text
      let computationText = `Iteration 1: F(${Array.isArray(initialState) ? initialState.join(',') : initialState}) = (${Array.isArray(firstTransition) ? firstTransition.join(',') : firstTransition})`;
      this.model.setComputationText(computationText);
      
      this.model.setStep(3);
      this.model.saveState(); // Save state after all updates
      console.log('Updated step to 3, first transition:', firstTransition);
    } else if (state.step === 3) {
      // Subsequent transitions
      const lastState = state.fNodes[state.fNodes.length - 1];
      const nextState = this.model.calculateNextState(...(Array.isArray(lastState) ? lastState : [lastState]));
      
      if(this.first_time_T_final_state){ // Use class member
        // console.log('asdhfloarhuefuerhocviuewoirfuvhioefuhviohef');
        this.model.setFNodes([...state.fNodes, nextState]);
      }
      console.log('value of first_time_T_final_state:', this.first_time_T_final_state);
      // Generate computation text
      let computationText = `Iteration ${state.fNodes.length + 1}: F(${Array.isArray(lastState) ? lastState.join(',') : lastState}) = (${Array.isArray(nextState) ? nextState.join(',') : nextState})`;
      this.model.setComputationText(computationText);
      
      // Check for fixed point using algorithm's termination condition
      const reachedFixedPoint = this.model.checkTerminationCondition(nextState);
      
     if (reachedFixedPoint) {
        this.model.setShowT(false);
        this.model.setStep(3.5);
        const result = this.model.calculatePi(...(Array.isArray(nextState) ? nextState : [nextState]));
        this.model.setResult(result);
        console.log('Reached fixed point, result:', result);
      } else {
        this.setFirstTimeTFinalState(true); // Use class member
        console.log('Next state:', nextState);
      }


      // if(this.first_time_T_final_state){ // Use class member
        // this.model.saveState(); // Save state after all updates
      // }
      this.model.saveState(); // Save state after all updates
    }
  }

  // Add a method to set the first_time_T_final_state directly
  setFirstTimeTFinalState(value) {
    this.first_time_T_final_state = value;
  }

  // Update the undo method
  undo() {
    this.first_time_T_final_state = true; // Reset this flag on undo
    this.model.undo();
  }

  // Add a method to get the first_time_T_final_state
  getFirstTimeTFinalState() {
    return this.first_time_T_final_state;
  }

  handlePiClick() {
    const state = this.model.getState();
    console.log('handlePiClick called, current step:', state.step);
    
    if (state.step === 3.5) {
      this.model.setShowFinalResult(true);
      this.model.setStep(4);
      
      const lastState = state.fNodes[state.fNodes.length - 1];
      const result = state.result;
      
      // Generate computation text
      let computationText = `π(${Array.isArray(lastState) ? lastState.join(',') : lastState}) = ${Array.isArray(result) ? result.join(',') : result} : Final result extraction`;
      this.model.setComputationText(computationText);
      
      this.model.saveState(); // Save state after all updates
      console.log('Updated step to 4, final result:', result);
    }
  }

  changeAlgorithm(config) {
    console.log('Changing algorithm to:', config.name);
    const currentInputs = this.model.getState().inputs || [];
    this.model = new Model(config);
    this.model.setInputs(currentInputs);
  }

  getState() {
    return this.model.getState();
  }
}