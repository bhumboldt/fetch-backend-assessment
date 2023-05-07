import { sum } from './func.util';

const get10 = () => 10;
describe('Func Utils', () => {
  describe('sum', () => {
    it('should sum all numbers correctly', () => {
      const total = sum(5, 6, get10());

      expect(total).toBe(21);
    });

    it('should sum to 0 with no numbers', () => {
      const total = sum();

      expect(total).toBe(0);
    });
  });
});
