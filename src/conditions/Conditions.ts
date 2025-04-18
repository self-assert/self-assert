/* eslint-disable @typescript-eslint/no-misused-spread */
import { ListsConditions } from "./lists/ListsConditions";
import { LogicalConditions } from "./LogicalConditions";
import { NumbersConditions } from "./numbers/NumbersConditions";

export type Predicate<ValueType> = (value: ValueType) => boolean;

const { not } = LogicalConditions;

class StringsConditions {
  static isBlank: Predicate<string> = (value) => ListsConditions.isEmpty(value.trim());

  static isNotBlank = not(this.isBlank);
}

/**
 * A collection of common assertion conditions.
 *
 * It also provides a way to compose conditions using the `and`, `or` and `not` functions.
 *
 * @example
 * ```ts
 * const myCondition = Conditions.and(Conditions.greaterThan(0), (value: number) => value % 42 === 0);
 * myCondition(42); // true
 * ```
 *
 * @example
 * ```ts
 * const assertion = Assertion.requiring("customer.age.over18", "Can't be under 18", Conditions.greaterThanOrEqual(18));
 * ```
 *
 */
export const Conditions = {
  hold: () => true,
  fail: () => false,
  ...LogicalConditions,
  ...NumbersConditions,
  ...ListsConditions,
  ...StringsConditions,
};
