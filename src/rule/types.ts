export type LabelId = string;

/**
 * Describes an assertion by its id and description.
 *
 * @group Assertions
 */
export interface LabeledRule {
  /**
   * Compares the id of the assertion with the given one.
   */
  hasLabelId(anId: LabelId): boolean;

  /**
   * Compare the id and description of the assertion with the given ones.
   */
  hasLabel(anId: LabelId, aDescription: string): boolean;

  /**
   * Checks if the assertion has the given description.
   *
   * @remarks
   * This method is used mostly for testing.
   */
  hasDescription(aDescription: string): boolean;

  getId(): LabelId;
  getDescription(): string;
}

export interface CollectableRule<ValueType, CollectionType extends void | Promise<void>> extends LabeledRule {
  collectFailureInto(failed: LabeledRule[], value: ValueType): CollectionType;
}

export type MaybeAsync<Type = void> = Type | Promise<Type>;

export type RuleRequirement<ReturnType extends MaybeAsync<boolean>, ValueType = any> = (value: ValueType) => ReturnType;

export type SelfContainedRule<EvaluationType extends MaybeAsync = MaybeAsync> = CollectableRule<void, EvaluationType>;

export type SelfContainedRules = SelfContainedRule | SelfContainedRule[];

export type SelfContainedAssertion = SelfContainedRule<void>;

export type ValueParam<Type> = Type extends void ? [] : [Type];
