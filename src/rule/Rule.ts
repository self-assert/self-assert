import { RuleEvaluation } from "./RuleEvaluation";
import { RuleLabel } from "./RuleLabel";
import type { LabelId, LabeledRule, MaybeAsync, RuleRequirement } from "./types";

export abstract class Rule<PredicateReturnType extends MaybeAsync<boolean>, ValueType = any> implements LabeledRule {
  protected readonly requirements: RuleRequirement<PredicateReturnType, ValueType>[];

  protected constructor(protected label: RuleLabel) {
    this.requirements = [];
  }

  /**
   * Evaluates the conditions for the given value
   *
   * @returns `true` or `Promise<true>` if all conditions are met
   */
  abstract doesHold(value: ValueType): PredicateReturnType;

  /**
   * Opposite of {@link doesHold}
   *
   * @returns `true` or `Promise<true>` if any condition is not met
   */
  abstract hasFailed(value: ValueType): PredicateReturnType;

  abstract mustHold(value: ValueType): PredicateReturnType extends boolean ? void : Promise<void>;

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
   *   (name) => name.trim().length > 0
   * );
   * const evaluation = nameNotBlank.evaluateFor("John");
   *
   * evaluation.doesHold(); // true
   * ```
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
