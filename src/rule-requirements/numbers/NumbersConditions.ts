import { LogicalConditions } from "../LogicalConditions";

import type { Predicate } from "../Conditions";

const { and, or, not, identical } = LogicalConditions;

export class NumbersConditions {
  /**
   * Returns a predicate that is `true` if the value is greater than the given number
   * @function @category Numbers
   */
  static greaterThan =
    (aNumber: number): Predicate<number> =>
    (value) =>
      value > aNumber;

  /**
   * Returns a predicate that is `true` if the value is greater than or equal to the given number
   * @function @category Numbers
   */
  static greaterThanOrEqual = (aNumber: number) => or(this.greaterThan(aNumber), identical(aNumber));

  /**
   * Returns a predicate that is `true` if the value is less than the given number
   * @function @category Numbers
   */
  static lessThan = (aNumber: number) => not(this.greaterThanOrEqual(aNumber));

  /**
   * Returns a predicate that is `true` if the value is less than or equal to the given number
   * @function @category Numbers
   */
  static lessThanOrEqual = (aNumber: number) => not(this.greaterThan(aNumber));

  /**
   * Returns a predicate that is `true` if the value is between two numbers (inclusive)
   * @function @category Numbers
   */
  static between = (min: number, max: number) => and(this.greaterThanOrEqual(min), this.lessThanOrEqual(max));

  /**
   * Returns a predicate that is `true` if the value is an integer
   * @function @category Numbers
   */
  static isInteger = Number.isInteger;

  /**
   * Returns a predicate that is `true` if the value is a float
   * @function @category Numbers
   */
  static isFloat = and(Number.isFinite, not(this.isInteger));

  /**
   * Returns a predicate that is `true` if the value is positive
   * @function @category Numbers
   */
  static isPositive = this.greaterThan(0);

  /**
   * Returns a predicate that is `true` if the value is negative
   * @function @category Numbers
   */
  static isNegative = this.lessThan(0);

  /**
   * Returns a predicate that is `true` if the value is a positive integer
   * @function @category Numbers
   */
  static isPositiveInteger = and(this.isInteger, this.isPositive);

  /**
   * Returns a predicate that is `true` if the value is a negative integer
   * @function @category Numbers
   */
  static isNegativeInteger = and(this.isInteger, this.isNegative);

  /**
   * Returns a predicate that is `true` if the value is an integer between two numbers (inclusive)
   * @function @category Numbers
   */
  static isIntegerBetween = (min: number, max: number) => and(this.isInteger, this.between(min, max));
}
