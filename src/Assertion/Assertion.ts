import type { AssertionId, SelfContainedAssertion } from "./types";

export interface AssertionAsJson {
  id: AssertionId;
  description: string;
}

/**
 * Represents a rule that must be met in order for
 * an object to be considered valid.
 */
export class Assertion<ValueType = void> {
  static fromJson(assertionAsJson: AssertionAsJson) {
    return this.identifiedAs(assertionAsJson.id, assertionAsJson.description);
  }

  static identifiedAs<ValueType = void>(id: AssertionId, description: string) {
    return new this<ValueType>(id, description);
  }

  static for<ValueType = void>(id: AssertionId, description: string, condition: (value: ValueType) => boolean) {
    return this.identifiedAs<ValueType>(id, description).require(condition);
  }

  protected conditions: ((value: ValueType) => boolean)[];

  protected constructor(protected id: AssertionId, protected description: string) {
    this.conditions = [];
  }

  require(condition: (value: ValueType) => boolean) {
    this.conditions.push(condition);
    return this;
  }

  /**
   * Evaluates the condition of the assertion.
   */
  doesHold(value: ValueType) {
    return this.conditions.every((condition) => condition(value));
  }

  hasFailed(value: ValueType) {
    return !this.doesHold(value);
  }

  isIdentifiedAs(assertionId: AssertionId) {
    return this.id === assertionId;
  }

  getId(): AssertionId {
    return this.id;
  }

  isIdentifiedAsWith(assertionId: AssertionId, assertionDescription: string) {
    return this.isIdentifiedAs(assertionId) && this.isDescription(assertionDescription);
  }

  getDescription() {
    return this.description;
  }

  isDescription(assertionDescription: string) {
    return this.description === assertionDescription;
  }
}

/**
 * **Type check only**
 *
 * This dummy class exists solely to ensure at compile time that `Assertion<void>`
 * structurally satisfies the `SelfContainedAssertion` interface.
 *
 * It is never instantiated or exported.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unnecessary-type-arguments
class VoidAssertionIsSelfContained extends Assertion<void> implements SelfContainedAssertion {}
