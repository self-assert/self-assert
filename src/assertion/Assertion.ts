import { AssertionEvaluation } from "./AssertionEvaluation";
import { AssertionLabel, AssertionLabelAsJson } from "./AssertionLabel";
import { AssertionSuite } from "./AssertionSuite";
import type { AssertionId, LabeledAssertion, SelfContainedAssertion } from "./types";

/**
 * Represents a validation rule in the problem domain.
 *
 * An `Assertion` expresses a condition that must hold for a given value.
 * These rules are defined using one or more predicate functions, added via
 * {@link Assertion.require require}. The assertion is considered to "hold" when all the conditions evaluate to `true`.
 *
 * Assertions are identified by a unique identifier (`AssertionId`) and a human-readable description.
 * These identifiers are meant to be meaningful within the domain,
 * and can be used to route or display validation errors.
 *
 * @template ValueType The type of value this assertion applies to.
 *
 * @example
 * Basic usage
 * ```ts
 * const nameNotBlank = Assertion.requiring<string>(
 *   "customer.name.notBlank",
 *   "Name must not be blank",
 *   (name) => name.trim().length > 0
 * );
 *
 * nameNotBlank.doesHold("John"); // true
 * nameNotBlank.hasFailed("   "); // true
 * ```
 *
 */
export class Assertion<ValueType = void> implements LabeledAssertion {
  static fromJson(assertionAsJson: AssertionLabelAsJson) {
    return new this(AssertionLabel.fromJson(assertionAsJson));
  }

  /**
   * Creates a new assertion with the given id and description, without any conditions
   */
  static labeled<ValueType = void>(id: AssertionId, description: string) {
    const label = new AssertionLabel(id, description);
    return new this<ValueType>(label);
  }

  /**
   * Creates a new assertion with the given id, description and condition
   */
  static requiring<ValueType = void>(id: AssertionId, description: string, condition: (value: ValueType) => boolean) {
    return this.labeled<ValueType>(id, description).require(condition);
  }

  protected conditions: ((value: ValueType) => boolean)[];

  protected constructor(protected label: AssertionLabel) {
    this.conditions = [];
  }

  /**
   * Adds a necessary condition for the assertion to hold.
   *
   * @returns `this` for chaining
   */
  require(condition: (value: ValueType) => boolean): this {
    this.conditions.push(condition);
    return this;
  }

  /**
   * Prepares an {@link AssertionEvaluation} for the given value.
   *
   * This is the same as `AssertionEvaluation.for(this, value)`.
   *
   * @example
   *
   * ```ts
   * const nameNotBlank = Assertion.requiring<string>(
   *   "customer.name.notBlank",
   *   "Name must not be blank",
   *   (name) => name.trim().length > 0
   * );
   * const evaluation = nameNotBlank.evaluateFor("John");
   *
   * evaluation.doesHold(); // true
   * ```
   */
  evaluateFor(value: ValueType): SelfContainedAssertion {
    return AssertionEvaluation.for(this, value);
  }

  /**
   * Evaluates the conditions for the given value
   *
   * @returns `true` if all conditions are met
   */
  doesHold(value: ValueType): boolean {
    return this.conditions.every((condition) => condition(value));
  }

  /**
   * Opposite of {@link doesHold}
   *
   * @returns `true` if the conditions are not met
   */
  hasFailed(value: ValueType) {
    return !this.doesHold(value);
  }

  /**
   * Asserts that the conditions for the given value are met.
   *
   * @see {@link SelfContainedAssertion.assert}
   */
  assert(value: ValueType) {
    AssertionSuite.assert(this.evaluateFor(value));
  }

  /**
   * Reports itself to the given list of failed assertions, if the assertion has failed.
   * @see {@link SelfContainedAssertion.collectFailureInto}
   */
  collectFailureInto(failed: unknown[], value: ValueType) {
    if (this.hasFailed(value)) {
      failed.push(this.label);
    }
  }

  hasLabelId(assertionId: AssertionId) {
    return this.label.hasLabelId(assertionId);
  }

  getId(): AssertionId {
    return this.label.getId();
  }

  /**
   * @see {@link SelfContainedAssertion.hasLabel}
   */
  hasLabel(assertionId: AssertionId, assertionDescription: string) {
    return this.label.hasLabel(assertionId, assertionDescription);
  }

  getDescription() {
    return this.label.getDescription();
  }

  /**
   * @see {@link SelfContainedAssertion.hasFailed}
   */
  hasDescription(assertionDescription: string) {
    return this.label.hasDescription(assertionDescription);
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
