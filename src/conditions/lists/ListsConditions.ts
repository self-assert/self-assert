import { LogicalConditions } from "../LogicalConditions";
import { NumbersConditions } from "../numbers/NumbersConditions";
import type { Predicate } from "../Conditions";

const { identical, not, and } = LogicalConditions;

export class ListsConditions {
  /**
   * Returns a predicate that holds when the list has exactly the given number of elements
   * @function @category Lists
   */
  static hasExactly = (aNumber: number) => (list: ArrayLike<unknown>) => identical(aNumber)(list.length);

  /**
   * Returns a predicate that holds when the list has no elements
   * @function @category Lists
   */
  static isEmpty: Predicate<ArrayLike<unknown>> = this.hasExactly(0);

  /**
   * Returns a predicate that holds when the list has at least one element
   * @function @category Lists
   */
  static isNotEmpty = not(this.isEmpty);

  /**
   * Returns a predicate that holds when the list has more than the given number of elements
   * @function @category Lists
   */
  static hasMoreThan = (aNumber: number) => (list: ArrayLike<unknown>) =>
    NumbersConditions.greaterThan(aNumber)(list.length);

  /**
   * Returns a predicate that holds when the list has at most the given number of elements
   * @function @category Lists
   */
  static hasAtMost = (aNumber: number) => not(this.hasMoreThan(aNumber));

  /**
   * Returns a predicate that holds when the list has less than the given number of elements
   * @function @category Lists
   */
  static hasLessThan = (aNumber: number) => and(this.hasAtMost(aNumber), not(this.hasExactly(aNumber)));

  /**
   * Returns a predicate that holds when the list has at least the given number of elements
   * @function @category Lists
   */
  static hasAtLeast = (aNumber: number) => not(this.hasLessThan(aNumber));

  /**
   * Returns a predicate that holds when the list contains the given element
   * @function @category Lists
   */
  static includes: <ElementType>(element: ElementType) => Predicate<{ includes: Predicate<ElementType> }> =
    (element) => (list) =>
      list.includes(element);

  /**
   * Opposite of {@link includes}
   * @function @category Lists
   */
  static doesNotInclude = <ElementType>(element: ElementType) => not(this.includes(element));

  /**
   * Returns a predicate that holds when all elements of the list satisfy the given condition
   * @function @category Lists
   */
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

  /**
   * Returns a predicate that holds when any element of the list satisfies the given condition
   * @function @category Lists
   */
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

  /**
   * Returns a predicate that holds when no element of the list satisfies the given condition.
   * Opposite of {@link anySatisfy}
   * @function @category Lists
   */
  static noneSatisfy = <ElementType>(predicate: Predicate<ElementType>) => not(this.anySatisfy(predicate));
}
