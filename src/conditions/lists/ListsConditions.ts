import { LogicalConditions } from "../LogicalConditions";

const { identical, not, and } = LogicalConditions;

import type { Predicate } from "../Conditions";
import { NumbersConditions } from "../numbers/NumbersConditions";

export class ListsConditions {
  static hasExactly = (aNumber: number) => (list: ArrayLike<unknown>) => identical(aNumber)(list.length);

  static isEmpty: Predicate<ArrayLike<unknown>> = this.hasExactly(0);

  static isNotEmpty = not(this.isEmpty);

  static hasMoreThan = (aNumber: number) => (list: ArrayLike<unknown>) =>
    NumbersConditions.greaterThan(aNumber)(list.length);

  static hasUpTo = (aNumber: number) => not(this.hasMoreThan(aNumber));

  static hasLessThan = (aNumber: number) => and(this.hasUpTo(aNumber), not(this.hasExactly(aNumber)));

  static includes: <ElementType>(element: ElementType) => Predicate<{ includes: Predicate<ElementType> }> =
    (element) => (list) =>
      list.includes(element);

  static doesNotInclude = <ElementType>(element: ElementType) => not(this.includes(element));
}
