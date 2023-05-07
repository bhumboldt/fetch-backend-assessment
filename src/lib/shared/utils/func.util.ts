export const sum = (...numbers: number[]): number =>
  numbers.reduce((prev, curr) => prev + curr, 0);
