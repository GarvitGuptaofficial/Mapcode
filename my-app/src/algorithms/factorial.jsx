export const factorialConfig = {
  name: 'Factorial',
  numInputs: 1,
  inputLabels: ['Enter number'],
  calculateNextState: (i, a) => {
    if (i === 0) return [0, a];
    return [i - 1, a * i];
  },
  calculateRho: (n) => [n, 1],
  calculatePi: (i, a) => a,
  checkTerminationCondition: (state) => state[0] === 0
};