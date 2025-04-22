import { RuleLabel, RuleLabelAsJson } from "./RuleLabel";
import { Ruleset } from "./Ruleset";
import { Rule } from "./Rule";
import type { CollectableRule, LabeledRule, LabelId, RuleRequirement } from "./types";

/**
 * Represents a validation rule in the problem domain.
 *
 * An `Assertion` expresses a condition that must hold for a given value.
 * These rules are defined using one or more predicate functions, added via
 * {@link Rule.require require}. The assertion is considered to "hold" when all the conditions evaluate to `true`.
 *
 * Assertions are identified by a unique identifier (`AssertionId`) and a human-readable description.
 * These identifiers are meant to be meaningful within the domain,
 * and can be used to route or display validation errors.
 *
 * @see
 * - {@link Requirements} provides a list of built-in requirements.
 *
 * @template ValueType The type of value this assertion applies to.
 *
 * @example
 * Basic usage
 * ```ts
 * const nameNotBlank = Assertion.requiring<string>(
 *   "customer.name.notBlank",
 *   "Name must not be blank",
 *   Requirements.isNotBlank
 * );
 *
 * nameNotBlank.doesHold("John"); // true
 * nameNotBlank.hasFailed("   "); // true
 * ```
 */
export class Assertion<ValueType = any> extends Rule<boolean, ValueType> {
  static fromJson(assertionAsJson: RuleLabelAsJson) {
    return new this(RuleLabel.fromJson(assertionAsJson));
  }

  static labeled<ValueType = any>(id: LabelId, description: string) {
    const label = new RuleLabel(id, description);
    return new this<ValueType>(label);
  }

  /**
   * Creates a new assertion with the given id, description and requirement.
   *
   * If the requirement does not depend on a value (i.e., a function with no parameters),
   * the rule will be typed as `Assertion<void>`.
   *
   * @example
   * // Without a value
   * const systemIsReady = Assertion.requiring("sys.ready", "System must be ready", () => isReady());
   *
   * @example
   * // With a value
   * const greaterThan18 = Assertion.requiring("age.min", "Must be over 18", (age: number) => age > 18);
   */
  static requiring(anId: LabelId, aDescription: string, aCondition: () => boolean): Assertion<void>;
  static requiring<ValueType = any>(
    anId: LabelId,
    aDescription: string,
    aCondition: (value: ValueType) => boolean
  ): Assertion<ValueType>;
  static requiring<ValueType = any>(
    id: LabelId,
    description: string,
    aConditionToBeMet: RuleRequirement<boolean, ValueType>
  ) {
    return this.labeled<ValueType>(id, description).require(aConditionToBeMet);
  }

  protected constructor(label: RuleLabel) {
    super(label);
  }

  doesHold(value: ValueType): boolean {
    return this.requirements.every((condition) => condition(value));
  }

  hasFailed(value: ValueType): boolean {
    return !this.doesHold(value);
  }

  mustHold(value: ValueType): void {
    Ruleset.ensureAll(this.evaluateFor(value));
  }

  collectFailureInto(failed: LabeledRule[], value: ValueType): void {
    if (this.hasFailed(value)) {
      failed.push(this.label);
    }
  }
}

/**
 * **Type check only**
 *
 * This dummy class exists solely to ensure at compile time that `Assertion<void>`
 * structurally satisfies the {@link CollectableRule} interface.
 *
 * It is never instantiated or exported.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class VoidAssertionIsSelfContained extends Assertion<void> implements CollectableRule<void, void> {}
