import { RuleEvaluation } from "./RuleEvaluation";
import { RuleLabel } from "./RuleLabel";
import type { LabelId, LabeledRule } from "./types";

export type MaybeAsync<Type> = Type | Promise<Type>;

export type RulePredicate<ReturnType extends MaybeAsync<boolean>, ValueType = void> = (value: ValueType) => ReturnType;

export abstract class Rule<PredicateReturnType extends MaybeAsync<boolean>, ValueType = void> implements LabeledRule {
  protected readonly conditions: RulePredicate<PredicateReturnType, ValueType>[];

  protected constructor(protected label: RuleLabel) {
    this.conditions = [];
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
  require(condition: RulePredicate<PredicateReturnType, ValueType>): this {
    this.conditions.push(condition);
    return this;
  }

  /**
   * Prepares an {@link RuleEvaluation} for the given value.
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
