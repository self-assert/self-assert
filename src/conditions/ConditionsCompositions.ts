import { Predicate } from "./Conditions";

export const ConditionsCompositions = {
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
};
