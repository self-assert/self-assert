import { RuleLabel } from "./RuleLabel";
import type { LabelId, LabeledRule } from "./types";

export type RulePredicate<ReturnType extends MaybeAsync<boolean>, ValueType = void> = (value: ValueType) => ReturnType;

type MaybeAsync<Type> = Type | Promise<Type>;

function mapMaybeAsync<Type, ReturnType>(
  value: MaybeAsync<Type>,
  doSomething: (value: Type) => ReturnType
): MaybeAsync<ReturnType> {
  if (value instanceof Promise) {
    return value.then((resolved) => doSomething(resolved));
  }
  return doSomething(value);
}

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

  abstract mustHold(value: ValueType): void | Promise<void>;

  abstract collectFailureInto(failed: LabeledRule[], value: ValueType): void | Promise<void>;

  /**
   * Opposite of {@link doesHold}
   *
   * @returns `true` or `Promise<true>` if any condition is not met
   */
  hasFailed(value: ValueType): PredicateReturnType {
    const result = this.doesHold(value);
    return mapMaybeAsync(result, (r) => !r) as PredicateReturnType;
  }

  /**
   * Adds a necessary condition for the rule to hold.
   *
   * @returns `this` for chaining
   */
  require(condition: RulePredicate<PredicateReturnType, ValueType>): this {
    this.conditions.push(condition);
    return this;
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
