import { Predicate, Conditions } from "./Conditions";
import { ConditionsCompositions } from "./ConditionsCompositions";

const { and, or, not } = ConditionsCompositions;

export class NumbersConditions {
  static greaterThan =
    (aNumber: number): Predicate<number> =>
    (value) =>
      value > aNumber;

  static greaterThanOrEqual = (aNumber: number) => or(this.greaterThan(aNumber), (value: number) => value === aNumber);

  static lessThan = (aNumber: number) => not(Conditions.greaterThanOrEqual(aNumber));

  static lessThanOrEqual = (aNumber: number) => not(Conditions.greaterThan(aNumber));

  static between = (min: number, max: number) => and(this.greaterThanOrEqual(min), this.lessThanOrEqual(max));
}
