import type { AssertionId, SelfContainedAssertion } from "./types";
import type { Assertion } from "./Assertion";

export class AssertionEvaluation<ValueType> implements SelfContainedAssertion {
  static for<ValueType>(assertion: Assertion<ValueType>, value: ValueType) {
    return new this(assertion, value);
  }

  constructor(protected assertion: Assertion<ValueType>, protected value: ValueType) {}

  doesHold() {
    return this.assertion.doesHold(this.value);
  }

  hasFailed() {
    return this.assertion.hasFailed(this.value);
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
