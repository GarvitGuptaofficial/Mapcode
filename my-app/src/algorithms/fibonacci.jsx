export const fibonacciConfig = {
    name: 'Fibonacci',
    numInputs: 1,
    inputLabels: ['Enter n'],
    calculateNextState: (n, a, b) => {
      if (n === 0) return [0, a, b];
      return [n - 1, b, a + b];
    },
    calculateRho: (n) => [n, 0, 1],
    calculatePi: (n, a, b) => a,
    checkTerminationCondition: (state) => state[0] === 0,
    };