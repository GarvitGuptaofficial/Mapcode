export const exponentiationConfig = {
  name: 'Exponentiation',
  numInputs: 2,
  inputLabels: ['Base (a)', 'Exponent (n)'],
  calculateNextState: (n, a, result) => {
    if (n === 0) return [0, a, result];
    return [n - 1, a, result * a];
  },
  calculateRho: (a, n) => [n, a, 1],
  calculatePi: (n, a, result) => result,
  checkTerminationCondition: (state) => state[0] === 0
};