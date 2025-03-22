export const exponentiation = {
    name: 'exponentiation',
    calculateRho(base, power) {
      // ρ initializes the state: [i, result], where i is the current power, result is the accumulated value
      return [power, 1]; // Start with power and result = 1
    },
    calculateNextState(i, result) {
      // F(i, result) = [i-1, result * base]
      const base = this.base; // Access base from the config (set in Model)
      return [i - 1, result * base];
    },
    calculatePi(i, result) {
      // π extracts the final result
      return result;
    },
  };