import type { Rule } from "./Rule";
import type { CollectableRule, MaybeAsync } from "./types";
import type { LabeledRule, LabelId } from "./types";

/**
 * Represents the evaluation of a rule on a given value.
 *
 * It can also be created using the {@link Rule.evaluateFor} method.
 *
 * @template ValueType The type of value the rule applies to.
 *
 * @example
 * {@includeCode ../../../../examples/snippets/rules.ts#evaluateFor,rule-evaluation}
 *
 * @category Rules
 */
export class RuleEvaluation<
  PredicateReturnType extends MaybeAsync<boolean>,
  ValueType
> implements
    CollectableRule<
      void,
      PredicateReturnType extends boolean ? void : Promise<void>
    >
{
  constructor(
    protected rule: Rule<PredicateReturnType, ValueType>,
    protected value: ValueType
  ) {}

  /**
   * @category Rule evaluation
   * @see {@link Rule.doesHold}
   */
  doesHold() {
    return this.rule.doesHold(this.value);
  }

  /**
   * @category Rule evaluation
   * @see {@link Rule.hasFailed}
   */
  hasFailed() {
    return this.rule.hasFailed(this.value);
  }

  /**
   * @category Rule evaluation
   * @see {@link Rule.mustHold}
   */
  mustHold() {
    return this.rule.mustHold(this.value);
  }

  /**
   * @category Rule evaluation
   * @see {@link Rule.collectFailureInto}
   */
  collectFailureInto(failed: LabeledRule[]) {
    return this.rule.collectFailureInto(failed, this.value);
  }

  isLabeledAs(aBrokenRuleLabel: LabeledRule): boolean {
    return this.rule.isLabeledAs(aBrokenRuleLabel);
  }

  hasLabel(anId: LabelId, aDescription: string) {
    return this.rule.hasLabel(anId, aDescription);
  }

  hasDescription(aDescription: string) {
    return this.rule.hasDescription(aDescription);
  }

  hasLabelId(anId: LabelId) {
    return this.rule.hasLabelId(anId);
  }

  getId(): LabelId {
    return this.rule.getId();
  }

  getDescription() {
    return this.rule.getDescription();
  }
}
