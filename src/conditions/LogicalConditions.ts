import type { Predicate } from "./Conditions";

export const LogicalConditions = {
  and:
    <ValueType>(...conditions: Predicate<ValueType>[]): Predicate<ValueType> =>
    (value) =>
      conditions.every((condition) => condition(value)),

  or:
    <ValueType>(...conditions: Predicate<ValueType>[]): Predicate<ValueType> =>
    (value) =>
      conditions.some((condition) => condition(value)),

  not:
    <ValueType>(condition: Predicate<ValueType>): Predicate<ValueType> =>
    (value) =>
      !condition(value),

  identical:
    <ValueType>(expected: ValueType): Predicate<ValueType> =>
    (value) =>
      value === expected,
};
