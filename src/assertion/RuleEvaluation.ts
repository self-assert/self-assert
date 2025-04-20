import type { MaybeAsync, Rule } from "./Rule";
import type { LabeledRule, LabelId } from "./types";

/**
 * Represents the evaluation of a rule on a given value.
 * TODO: complete
 *
 * It can also be created using the {@link Assertion.evaluateFor} method.
 *
 * @template ValueType The type of value this assertion applies to.
 *
 * @example
 * ```ts
 * const nameNotBlank = Assertion.requiring<string>(
 *   "customer.name.notBlank",
 *   "Name must not be blank",
 *   (name) => name.trim().length > 0
 * );
 * const evaluation = AssertionEvaluation.for(nameNotBlank, "John");
 *
 * evaluation.doesHold(); // true
 * ```
 *
 * @example
 *
 * ```ts
 * const evaluation = nameNotBlank.evaluateFor("John"); // AssertionEvaluation
 *
 * evaluation.doesHold(); // true
 * ```
 */
export class RuleEvaluation<PredicateReturnType extends MaybeAsync<boolean>, ValueType> {
  constructor(protected rule: Rule<PredicateReturnType, ValueType>, protected value: ValueType) {}

  doesHold() {
    return this.rule.doesHold(this.value);
  }

  hasFailed() {
    return this.rule.hasFailed(this.value);
  }

  mustHold() {
    return this.rule.mustHold(this.value);
  }

  collectFailureInto(failed: LabeledRule[]) {
    return this.rule.collectFailureInto(failed, this.value);
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
