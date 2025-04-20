import type { AssertionLabel } from "./RuleLabel";
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

  protected constructor(protected label: AssertionLabel) {
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
