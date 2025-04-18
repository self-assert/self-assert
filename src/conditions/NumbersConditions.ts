import { ConditionsCompositions } from "./ConditionsCompositions";

import type { Predicate } from "./Conditions";

const { and, or, not } = ConditionsCompositions;

export class NumbersConditions {
  static greaterThan =
    (aNumber: number): Predicate<number> =>
    (value) =>
      value > aNumber;

  static greaterThanOrEqual = (aNumber: number) => or(this.greaterThan(aNumber), (value: number) => value === aNumber);

  static lessThan = (aNumber: number) => not(this.greaterThanOrEqual(aNumber));

  static lessThanOrEqual = (aNumber: number) => not(this.greaterThan(aNumber));

  static between = (min: number, max: number) => and(this.greaterThanOrEqual(min), this.lessThanOrEqual(max));

  static isInteger = Number.isInteger;

  static isFloat = and(Number.isFinite, not(this.isInteger));
}
