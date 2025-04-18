import { LogicalConditions } from "../LogicalConditions";

import type { Predicate } from "../Conditions";

const { and, or, not, identical } = LogicalConditions;

export class NumbersConditions {
  static greaterThan =
    (aNumber: number): Predicate<number> =>
    (value) =>
      value > aNumber;

  static greaterThanOrEqual = (aNumber: number) => or(this.greaterThan(aNumber), identical(aNumber));

  static lessThan = (aNumber: number) => not(this.greaterThanOrEqual(aNumber));

  static lessThanOrEqual = (aNumber: number) => not(this.greaterThan(aNumber));

  static between = (min: number, max: number) => and(this.greaterThanOrEqual(min), this.lessThanOrEqual(max));

  static isInteger = Number.isInteger;

  static isFloat = and(Number.isFinite, not(this.isInteger));

  static isPositive = this.greaterThan(0);

  static isNegative = this.lessThan(0);

  static isPositiveInteger = and(this.isInteger, this.isPositive);

  static isNegativeInteger = and(this.isInteger, this.isNegative);

  static isIntegerBetween = (min: number, max: number) => and(this.isInteger, this.between(min, max));
}
