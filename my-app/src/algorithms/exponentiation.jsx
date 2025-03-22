export const exponentiationConfig = {
    name: 'exponentiation',
    numInputs: 2,
    inputLabels: ['Enter base', 'Enter power'],
    calculateRho(base, power) {
      return [power, 1];
    },
    calculateNextState(i, result) {
      const base = this.base;
      return [i - 1, result * base];
    },
    calculatePi(i, result) {
      return result;
    },
  };