import {
  ALPHANUMERIC_REGEX,
  ITEM_PAIR_POINTS_MULTIPLE,
  MOMENT_HOURS_MINUTES_FORMAT,
  ODD_DAY_POINTS,
  ROUND_TOTAL_PRICE_POINTS,
  TIME_OF_DAY_POINTS,
  TOTAL_PRICE_MOD_25_POINTS,
} from './constants.util';
import { getMoment } from './time.util';

export const getRetailerNamePoints = (name: string) =>
  name.match(ALPHANUMERIC_REGEX)?.length ?? 0;

export const getTotalPriceIsRoundPoints = (price: number): number =>
  price % 1 === 0 ? ROUND_TOTAL_PRICE_POINTS : 0;

export const getTotalPriceIsMultipleOfPoints = (price: number): number =>
  price % 0.25 === 0 ? TOTAL_PRICE_MOD_25_POINTS : 0;

export const getItemPairPoints = <T>(items: T[]): number =>
  Math.floor(items.length / 2.0) * ITEM_PAIR_POINTS_MULTIPLE;

export const getItemDescriptionPoints = <
  T extends {
    shortDescription: string;
    price: string;
  },
>(
  items: T[],
): number =>
  items
    .map((item) => ({
      price: parseFloat(item.price),
      trimmedDescriptionLength: item.shortDescription.trim().length,
    }))
    .reduce(
      (prev, { trimmedDescriptionLength, price }) =>
        prev +
        (trimmedDescriptionLength % 3 === 0 ? Math.ceil(price * 0.2) : 0),
      0,
    );

export const getOddDayPoints = (date: string): number =>
  getMoment(date).date() % 2 === 1 ? ODD_DAY_POINTS : 0;

export const getTimeBetween2And4PMPoints = (date: string): number =>
  getMoment(date, MOMENT_HOURS_MINUTES_FORMAT).isBetween(
    getMoment('14:00', MOMENT_HOURS_MINUTES_FORMAT),
    getMoment('16:00', MOMENT_HOURS_MINUTES_FORMAT),
  )
    ? TIME_OF_DAY_POINTS
    : 0;
