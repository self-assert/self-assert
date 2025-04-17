import type { AssertionId, SelfContainedAssertion } from "./types";
import type { Assertion } from "./Assertion";
import type { AssertionLabel } from "./AssertionLabel";

/**
 * Represents the evaluation of an assertion on a given value.
 *
 * It can also be created using the {@link Assertion.evaluateFor} method.
 *
 * @template ValueType The type of value this assertion applies to.
 *
 * @example
 * ```ts
 * const nameNotBlank = Assertion.for<string>(
 *   "customer.name.notBlank",
 *   "Name must not be blank",
 *   (name) => name.trim().length > 0
 * );
 * const evaluation = AssertionEvaluation.for(nameNotBlank, "John");
 *
 * evaluation.doesHold(); // true
 * ```
 *
 * @example
 *
 * ```ts
 * const evaluation = nameNotBlank.evaluateFor("John"); // AssertionEvaluation
 *
 * evaluation.doesHold(); // true
 * ```
 */
export class AssertionEvaluation<ValueType> implements SelfContainedAssertion {
  static for<ValueType>(assertion: Assertion<ValueType>, value: ValueType) {
    return new this(assertion, value);
  }

  protected constructor(protected assertion: Assertion<ValueType>, protected value: ValueType) {}

  doesHold() {
    return this.assertion.doesHold(this.value);
  }

  hasFailed() {
    return this.assertion.hasFailed(this.value);
  }

  assert() {
    return this.assertion.assert(this.value);
  }

  collectFailureInto(failed: AssertionLabel[]): void {
    this.assertion.collectFailureInto(failed, this.value);
  }

  isIdentifiedAs(assertionId: AssertionId): boolean {
    return this.assertion.isIdentifiedAs(assertionId);
  }

  getId(): AssertionId {
    return this.assertion.getId();
  }

  isIdentifiedAsWith(assertionId: AssertionId, assertionDescription: string): boolean {
    return this.assertion.isIdentifiedAsWith(assertionId, assertionDescription);
  }

  getDescription(): string {
    return this.assertion.getDescription();
  }

  hasDescription(assertionDescription: string): boolean {
    return this.assertion.hasDescription(assertionDescription);
  }
}
