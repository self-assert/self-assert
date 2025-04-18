import { LogicalConditions } from "../LogicalConditions";
import { NumbersConditions } from "../numbers/NumbersConditions";
import type { Predicate } from "../Conditions";

const { identical, not, and } = LogicalConditions;

export class ListsConditions {
  static hasExactly = (aNumber: number) => (list: ArrayLike<unknown>) => identical(aNumber)(list.length);

  static isEmpty: Predicate<ArrayLike<unknown>> = this.hasExactly(0);

  static isNotEmpty = not(this.isEmpty);

  static hasMoreThan = (aNumber: number) => (list: ArrayLike<unknown>) =>
    NumbersConditions.greaterThan(aNumber)(list.length);

  static hasAtMost = (aNumber: number) => not(this.hasMoreThan(aNumber));

  static hasLessThan = (aNumber: number) => and(this.hasAtMost(aNumber), not(this.hasExactly(aNumber)));

  static hasAtLeast = (aNumber: number) => not(this.hasLessThan(aNumber));

  static includes: <ElementType>(element: ElementType) => Predicate<{ includes: Predicate<ElementType> }> =
    (element) => (list) =>
      list.includes(element);

  static doesNotInclude = <ElementType>(element: ElementType) => not(this.includes(element));

  static allSatisfy =
    <ElementType>(predicate: Predicate<ElementType>) =>
    (list: Iterable<ElementType>) => {
      for (const element of list) {
        if (!predicate(element)) {
          return false;
        }
      }
      return true;
    };

  static anySatisfy =
    <ElementType>(predicate: Predicate<ElementType>) =>
    (list: Iterable<ElementType>) => {
      for (const element of list) {
        if (predicate(element)) {
          return true;
        }
      }
      return false;
    };

  static noneSatisfy = <ElementType>(predicate: Predicate<ElementType>) => not(this.anySatisfy(predicate));
}
