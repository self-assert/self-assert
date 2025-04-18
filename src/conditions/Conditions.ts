type Predicate<ValueType> = (value: ValueType) => boolean;

const ConditionsCompositions = {
  or:
    <ValueType>(...conditions: Predicate<ValueType>[]): Predicate<ValueType> =>
    (value) =>
      conditions.some((condition) => condition(value)),
  and:
    <ValueType>(...conditions: Predicate<ValueType>[]): Predicate<ValueType> =>
    (value) =>
      conditions.every((condition) => condition(value)),
  not:
    <ValueType>(condition: Predicate<ValueType>): Predicate<ValueType> =>
    (value) =>
      !condition(value),
};

export const Conditions = {
  hold: () => true,
  fail: () => false,
  ...ConditionsCompositions,
  greaterThan:
    (aNumber: number): Predicate<number> =>
    (value) =>
      value > aNumber,
  greaterThanOrEqual(aNumber: number) {
    return this.or(this.greaterThan(aNumber), (value: number) => value === aNumber);
  },
  lessThan(aNumber: number) {
    return this.not(this.greaterThanOrEqual(aNumber));
  },
  lessThanOrEqual(aNumber: number) {
    return this.not(this.greaterThan(aNumber));
  },
};
