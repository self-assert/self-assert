import { Assertion } from "./Assertion";

export class AssertionEvaluation<ValueType> {
  static for<ValueType = void>(assertion: Assertion<ValueType>, value: ValueType) {
    return new this(assertion, value);
  }

  constructor(protected assertion: Assertion<ValueType>, protected value: ValueType) {}

  doesHold() {
    return this.assertion.doesHold(this.value);
  }

  hasFailed() {
    return this.assertion.hasFailed(this.value);
  }
}
