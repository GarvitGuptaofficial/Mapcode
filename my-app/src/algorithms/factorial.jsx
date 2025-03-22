export const factorialConfig = {
    name: 'Factorial',
    calculateNextState: (i, a) => {
      if (i === 0) return [0, a];
      return [i - 1, a * i];
    },
    calculateRho: (n) => [n, 1],
    calculatePi: (i, a) => a,
  };