import type { AssertionLabel } from "./AssertionLabel";
import type { AssertionId, LabeledAssertion } from "./types";

type MaybeAsync<aType> = aType | Promise<aType>;

export type RulePredicate<ReturnType extends MaybeAsync<boolean>, ValueType = void> = (value: ValueType) => ReturnType;

export abstract class Rule<PredicateReturnType extends MaybeAsync<boolean>, ValueType = void>
  implements LabeledAssertion
{
  protected readonly conditions: RulePredicate<PredicateReturnType, ValueType>[];

  protected constructor(protected label: AssertionLabel) {
    this.conditions = [];
  }

  abstract doesHold(value: ValueType): PredicateReturnType;

  /**
   * Adds a necessary condition for the assertion to hold.
   *
   * @returns `this` for chaining
   */
  require(condition: RulePredicate<PredicateReturnType, ValueType>): this {
    this.conditions.push(condition);
    return this;
  }

  hasLabel(anId: AssertionId, aDescription: string) {
    return this.label.hasLabel(anId, aDescription);
  }

  hasDescription(aDescription: string) {
    return this.label.hasDescription(aDescription);
  }

  hasLabelId(anId: AssertionId) {
    return this.label.hasLabelId(anId);
  }

  getId(): AssertionId {
    return this.label.getId();
  }

  getDescription() {
    return this.label.getDescription();
  }
}
