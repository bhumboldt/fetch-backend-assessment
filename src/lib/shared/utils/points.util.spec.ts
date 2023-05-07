import {
  getItemDescriptionPoints,
  getItemPairPoints,
  getOddDayPoints,
  getRetailerNamePoints,
  getTimeBetween2And4PMPoints,
  getTotalPriceIsMultipleOfPoints,
  getTotalPriceIsRoundPoints,
} from './points.util';
import {
  ITEM_PAIR_POINTS_MULTIPLE,
  ODD_DAY_POINTS,
  ROUND_TOTAL_PRICE_POINTS,
  TIME_OF_DAY_POINTS,
  TOTAL_PRICE_MOD_25_POINTS,
} from './constants.util';

describe('Points Utils', () => {
  describe('getRetailerNamePoints', () => {
    it('should return correct points for retailer with no special characters', () => {
      const retailer = 'AbcDef90';
      const points = getRetailerNamePoints(retailer);
      expect(points).toBe(8);
    });

    it('should return correct points for retailer with alphanumeric and white space characters', () => {
      const retailer = '  \t\t abAB98  \r\n';
      const points = getRetailerNamePoints(retailer);
      expect(points).toBe(6);
    });

    it('should return correct points for retailer with alphanumeric and special characters', () => {
      const retailer = '\t\t&&*#&!^#($#))___---ABC123abc     ';
      const points = getRetailerNamePoints(retailer);
      expect(points).toBe(9);
    });
  });

  describe('getTotalPriceIsRoundPoints', () => {
    it('should return no points for decimal price', () => {
      const totalPrice = 9.99;
      const points = getTotalPriceIsRoundPoints(totalPrice);
      expect(points).toBe(0);
    });

    it('should return correct points for non decimal price', () => {
      const totalPrice = 10.0;
      const points = getTotalPriceIsRoundPoints(totalPrice);
      expect(points).toBe(ROUND_TOTAL_PRICE_POINTS);
    });
  });

  describe('getTotalPriceIsMultipleOfPoints', () => {
    it('should return no points for not being a 0.25 multiple', () => {
      const totalPrice = 1.26;
      const points = getTotalPriceIsMultipleOfPoints(totalPrice);
      expect(points).toBe(0);
    });

    it('should return correct points for being a 0.25 multiple', () => {
      const totalPrice = 2.25;
      const points = getTotalPriceIsMultipleOfPoints(totalPrice);
      expect(points).toBe(TOTAL_PRICE_MOD_25_POINTS);
    });
  });

  describe('getItemPairPoints', () => {
    it('should return no points for 1 item', () => {
      const items = [{}];
      const points = getItemPairPoints(items);
      expect(points).toBe(0);
    });

    it('should return 1 multiple of points for 2 items', () => {
      const items = [{}, {}];
      const points = getItemPairPoints(items);
      expect(points).toBe(1 * ITEM_PAIR_POINTS_MULTIPLE);
    });

    it('should return 1 multiple of points for 3 items', () => {
      const items = [{}, {}, {}];
      const points = getItemPairPoints(items);
      expect(points).toBe(1 * ITEM_PAIR_POINTS_MULTIPLE);
    });

    it('should return 2 multiple of points for 4 items', () => {
      const items = [{}, {}, {}, {}];
      const points = getItemPairPoints(items);
      expect(points).toBe(2 * ITEM_PAIR_POINTS_MULTIPLE);
    });
  });

  describe('getItemDescriptionPoints', () => {
    it('should return no points for no items', () => {
      const items = [];
      const points = getItemDescriptionPoints(items);
      expect(points).toBe(0);
    });

    it('should return correct points for 1 item', () => {
      const items = [
        {
          shortDescription: 'Emils Cheese Pizza',
          price: '12.25',
        },
      ];

      const points = getItemDescriptionPoints(items);

      expect(points).toBe(3);
    });

    it('should return correct points for 1 item with whitespace', () => {
      const items = [
        {
          shortDescription: '   Klarbrunn 12-PK 12 FL OZ  ',
          price: '12.00',
        },
      ];

      const points = getItemDescriptionPoints(items);

      expect(points).toBe(3);
    });

    it('should return no points for an item with a description that is not a multiple of 3', () => {
      const items = [
        {
          shortDescription: '1234',
          price: '15.00',
        },
      ];

      const points = getItemDescriptionPoints(items);

      expect(points).toBe(0);
    });

    it('should return correct points for multiple items that have descriptions that are multiples of 3', () => {
      const items = [
        {
          shortDescription: '   Klarbrunn 12-PK 12 FL OZ  ',
          price: '12.00',
        },
        {
          shortDescription: 'Emils Cheese Pizza',
          price: '12.25',
        },
      ];

      const points = getItemDescriptionPoints(items);

      expect(points).toBe(6);
    });
  });

  describe('getOddDayPoints', () => {
    it('should return no points for an even date', () => {
      const date = '2023-03-02';
      const points = getOddDayPoints(date);
      expect(points).toBe(0);
    });

    it('should return correct points for an odd date', () => {
      const date = '2025-05-31';
      const points = getOddDayPoints(date);
      expect(points).toBe(ODD_DAY_POINTS);
    });
  });

  describe('getTimeBetween2And4PMPoints', () => {
    it('should return no points for being before 2pm', () => {
      const time = '13:15';
      const points = getTimeBetween2And4PMPoints(time);
      expect(points).toBe(0);
    });

    it('should return no points for being 2pm', () => {
      const time = '14:00';
      const points = getTimeBetween2And4PMPoints(time);
      expect(points).toBe(0);
    });

    it('should return no points for being 4pm', () => {
      const time = '16:00';
      const points = getTimeBetween2And4PMPoints(time);
      expect(points).toBe(0);
    });

    it('should return correct points for being after 2pm and before 4pm', () => {
      const time = '15:47';
      const points = getTimeBetween2And4PMPoints(time);
      expect(points).toBe(TIME_OF_DAY_POINTS);
    });
  });
});
