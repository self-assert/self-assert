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
 * @template PredicateReturnType The return type of the predicate functions.
 * Specifically, `true` or `Promise<true>`.
 * @template ValueType The type of value this rule applies to.
 *
 * @category Rules
 * @categoryDescription Rule evaluation
 * Related to the definition of business rules and their evaluation.
 */
export abstract class Rule<PredicateReturnType extends MaybeAsync<boolean>, ValueType = any> implements LabeledRule {
  protected readonly requirements: RuleRequirement<PredicateReturnType, ValueType>[];

  protected constructor(protected label: RuleLabel) {
    this.requirements = [];
  }

  /**
   * Evaluates the requirements for the given value
   *
   * @returns `true` or `Promise<true>` if all conditions are met
   * @category Rule evaluation
   */
  abstract doesHold(value: ValueType): PredicateReturnType;

  /**
   * Opposite of {@link doesHold}
   *
   * @returns `true` or `Promise<true>` if any condition is not met
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
   * Adds a necessary condition for the rule to hold.
   *
   * @returns `this` for chaining
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
