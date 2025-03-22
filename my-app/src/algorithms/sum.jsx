export const sumConfig = {
    name: 'Cumulative Sum',
    numInputs: 1,
    inputLabels: ['Enter number'],
    calculateNextState: (i, a) => {
      if (i === 0) return [0, a];
      return [i - 1, a + i];
    },
    calculateRho: (n) => [n, 0],
    calculatePi: (i, a) => a,
  };