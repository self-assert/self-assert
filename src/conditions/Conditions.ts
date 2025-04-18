import { ConditionsCompositions } from "./ConditionsCompositions";
import { NumbersConditions } from "./NumbersConditions";

export type Predicate<ValueType> = (value: ValueType) => boolean;



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
 * const assertion = Assertion.requiring("isAdult", "Can't be under 18", Conditions.greaterThanOrEqual(18));
 * ```
 *
 */
export const Conditions = {
  hold: () => true,
  fail: () => false,
  ...ConditionsCompositions,
  // eslint-disable-next-line @typescript-eslint/no-misused-spread
  ...NumbersConditions,
};
