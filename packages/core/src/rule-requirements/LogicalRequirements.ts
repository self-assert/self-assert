import type { Predicate } from "./Requirements";

export class LogicalRequirement {
  /**
   * Combines multiple conditions using logical AND
   * @function @category Composition
   */
  static and =
    <ValueType>(...conditions: Predicate<ValueType>[]): Predicate<ValueType> =>
    (value) =>
      conditions.every((condition) => condition(value));

  /**
   * Combines multiple conditions using logical OR
   * @function @category Composition
   */
  static or =
    <ValueType>(...conditions: Predicate<ValueType>[]): Predicate<ValueType> =>
    (value) =>
      conditions.some((condition) => condition(value));

  /**
   * Negates a condition
   * @function @category Composition
   */
  static not =
    <ValueType>(condition: Predicate<ValueType>): Predicate<ValueType> =>
    (value) =>
      !condition(value);

  /**
   * Returns a predicate that checks if the value is equal to the expected value.
   * @function @category Comparison
   */
  static identical = <ValueType>(expected: ValueType) => this.isIn(expected);

  /**
   * Returns a predicate that checks if the value is not equal to the forbidden value.
   * @function @category Comparison
   */
  static differentFrom = <ValueType>(forbiddenValue: ValueType) => this.not(this.identical(forbiddenValue));

  /**
   * Returns a predicate that checks if the value is in the allowed set.
   * @function @category Comparison
   */
  static isIn =
    <ValueType>(...allowedSet: ValueType[]): Predicate<ValueType> =>
    (value) =>
      allowedSet.includes(value);

  /**
   * Returns a predicate that checks if the value is not in the forbidden set.
   * @function @category Comparison
   */
  static isNotIn = <ValueType>(...forbiddenSet: ValueType[]) => this.not(this.isIn(...forbiddenSet));
}
