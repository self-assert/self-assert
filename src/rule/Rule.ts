import { RuleEvaluation } from "./RuleEvaluation";
import { RuleLabel } from "./RuleLabel";
import type { LabelId, LabeledRule, MaybeAsync, RuleRequirement } from "./types";

/**
 * Represents a validation rule in the problem domain.
 *
 * This is the base class for all rules.
 * - Use {@link Assertion} for rules that can be evaluated **synchronously**.
 * - Use {@link Inquiry} for rules that need to be evaluated **asynchronously**.
 *
 * Rules are identified by a unique identifier ({@link LabelId}) and a human-readable description.
 * These identifiers are meant to be meaningful within the domain,
 * and can be used to route or display validation errors.
 *
 * @template PredicateReturnType The return type of the predicate functions.
 * Specifically, `true` or `Promise<true>`.
 * @template ValueType The type of value this rule applies to.
 *
 * @category Rules
 * @categoryDescription Rule evaluation
 * Related to the definition of business rules and their evaluation.
 * @categoryDescription Rule definition
 * Related to the definition of requirements for business rules.
 */
export abstract class Rule<PredicateReturnType extends MaybeAsync<boolean>, ValueType = any> implements LabeledRule {
  protected readonly requirements: RuleRequirement<PredicateReturnType, ValueType>[];

  protected constructor(protected label: RuleLabel) {
    this.requirements = [];
  }

  /**
   * Evaluates the requirements for the given value,
   * and returns whether the rule holds or not.
   *
   * @category Rule evaluation
   */
  abstract doesHold(value: ValueType): PredicateReturnType;

  /**
   * Opposite of {@link doesHold}
   *
   * @category Rule evaluation
   */
  abstract hasFailed(value: ValueType): PredicateReturnType;

  /**
   * Evaluates the requirements for the given value.
   * If any condition is not met, throws a {@link RulesBroken} exception.
   *
   * @category Rule evaluation
   */
  abstract mustHold(value: ValueType): PredicateReturnType extends boolean ? void : Promise<void>;

  /**
   * Updates the list of failed assertions with its label
   * if the rule has failed for the given value.
   *
   * @category Rule evaluation
   */
  abstract collectFailureInto(
    failed: LabeledRule[],
    value: ValueType
  ): PredicateReturnType extends boolean ? void : Promise<void>;

  /**
   * Adds a necessary requirement for the rule to hold.
   *
   * @example
   * ```ts
   * const nameNotBlank = Assertion.requiring<string>(
   *   "customer.name.notBlank",
   *   "Name must not be blank",
   *   Requirements.isNotBlank
   * );
   * nameNotBlank.require((name) => name !== "John");
   * ```
   *
   * @returns `this` for chaining
   * @category Rule definition
   */
  require(aConditionToBeMet: RuleRequirement<PredicateReturnType, ValueType>): this {
    this.requirements.push(aConditionToBeMet);
    return this;
  }

  /**
   * Prepares a {@link RuleEvaluation} for the given value.
   *
   * This is the same as `new RuleEvaluation(rule, value)`.
   *
   * @example
   *
   * ```ts
   * const nameNotBlank = Assertion.requiring<string>(
   *   "customer.name.notBlank",
   *   "Name must not be blank",
   *   Requirements.isNotBlank
   * );
   * const evaluation = nameNotBlank.evaluateFor("John");
   *
   * evaluation.doesHold(); // true
   * ```
   *
   * @category Rule evaluation
   */
  evaluateFor(aValue: ValueType) {
    return new RuleEvaluation(this, aValue);
  }

  isLabeledAs(aBrokenRuleLabel: LabeledRule) {
    return aBrokenRuleLabel.hasLabel(this.label.getId(), this.label.getDescription());
  }

  hasLabel(anId: LabelId, aDescription: string) {
    return this.label.hasLabel(anId, aDescription);
  }

  hasDescription(aDescription: string) {
    return this.label.hasDescription(aDescription);
  }

  hasLabelId(anId: LabelId) {
    return this.label.hasLabelId(anId);
  }

  getId(): LabelId {
    return this.label.getId();
  }

  getDescription() {
    return this.label.getDescription();
  }
}
