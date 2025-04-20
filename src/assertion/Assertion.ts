import { AssertionEvaluation } from "./AssertionEvaluation";
import { AssertionLabel, AssertionLabelAsJson } from "./AssertionLabel";
import { Ruleset } from "./Ruleset";
import { Rule } from "./Rule";
import type { AssertionId, SelfContainedAssertion } from "./types";

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
 * @see
 * - {@link Conditions} provides a list of built-in conditions.
 *
 * @template ValueType The type of value this assertion applies to.
 *
 * @example
 * Basic usage
 * ```ts
 * const nameNotBlank = Assertion.requiring<string>(
 *   "customer.name.notBlank",
 *   "Name must not be blank",
 *   Conditions.isNotBlank
 * );
 *
 * nameNotBlank.doesHold("John"); // true
 * nameNotBlank.hasFailed("   "); // true
 * ```
 */
export class Assertion<ValueType = void> extends Rule<boolean, ValueType> {
  static fromJson(assertionAsJson: AssertionLabelAsJson) {
    return new this(AssertionLabel.fromJson(assertionAsJson));
  }

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

  protected constructor(label: AssertionLabel) {
    super(label);
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

  doesHold(value: ValueType): boolean {
    return this.conditions.every((condition) => condition(value));
  }

  /**
   * Asserts that the conditions for the given value are met.
   *
   * @see {@link SelfContainedAssertion.mustHold}
   */
  mustHold(value: ValueType) {
    Ruleset.assert(this.evaluateFor(value));
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
