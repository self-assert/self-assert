import type { LabelId, SelfContainedAssertion } from "./types";
import type { Assertion } from "./Assertion";
import type { RuleLabel } from "./RuleLabel";

/**
 * Represents the evaluation of an assertion on a given value.
 *
 * It can also be created using the {@link Assertion.evaluateFor} method.
 *
 * @template ValueType The type of value this assertion applies to.
 *
 * @example
 * ```ts
 * const nameNotBlank = Assertion.requiring<string>(
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

  mustHold() {
    return this.assertion.mustHold(this.value);
  }

  collectFailureInto(failed: RuleLabel[]): void {
    this.assertion.collectFailureInto(failed, this.value);
  }

  hasLabelId(assertionId: LabelId): boolean {
    return this.assertion.hasLabelId(assertionId);
  }

  getId(): LabelId {
    return this.assertion.getId();
  }

  hasLabel(assertionId: LabelId, assertionDescription: string): boolean {
    return this.assertion.hasLabel(assertionId, assertionDescription);
  }

  getDescription(): string {
    return this.assertion.getDescription();
  }

  hasDescription(assertionDescription: string): boolean {
    return this.assertion.hasDescription(assertionDescription);
  }
}
