import type { Predicate } from "./Conditions";


export class LogicalConditions {
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

  static identical = <ValueType>(expected: ValueType) => this.isIn(expected);

  static differentFrom = <ValueType>(forbiddenValue: ValueType) => this.not(this.identical(forbiddenValue));

  static isIn =
    <ValueType>(...allowedSet: ValueType[]): Predicate<ValueType> =>
    (value) =>
      allowedSet.includes(value);

  static isNotIn = <ValueType>(...forbiddenSet: ValueType[]) => this.not(this.isIn(...forbiddenSet));
}
