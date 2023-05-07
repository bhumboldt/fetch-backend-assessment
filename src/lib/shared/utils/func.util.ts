export const add = (...numbers: number[]): number =>
  numbers.reduce((prev, curr) => prev + curr, 0);
