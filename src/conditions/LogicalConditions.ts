import type { Predicate } from "./Conditions";

export class LogicalConditions {
  static and =
    <ValueType>(...conditions: Predicate<ValueType>[]): Predicate<ValueType> =>
    (value) =>
      conditions.every((condition) => condition(value));

  static or =
    <ValueType>(...conditions: Predicate<ValueType>[]): Predicate<ValueType> =>
    (value) =>
      conditions.some((condition) => condition(value));

  static not =
    <ValueType>(condition: Predicate<ValueType>): Predicate<ValueType> =>
    (value) =>
      !condition(value);

  static identical =
    <ValueType>(expected: ValueType): Predicate<ValueType> =>
    (value) =>
      value === expected;

  static differentFrom = <ValueType>(forbiddenValue: ValueType) => this.not(this.identical(forbiddenValue));
}
