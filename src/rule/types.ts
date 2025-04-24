/**
 * @category Rules
 */
export type LabelId = string;

/**
 * Describes an assertion by its id and description.
 *
 * @category Rules
 * @categoryDescription Labeling
 */
export interface LabeledRule {
  /**
   * Checks if the assertion has the same id and description as the given one.
   * @category Labeling
   */
  isLabeledAs(aBrokenRuleLabel: LabeledRule): boolean;
  /**
   * Compares the id of the assertion with the given one.
   * @category Labeling
   */
  hasLabelId(anId: LabelId): boolean;

  /**
   * Compare the id and description of the assertion with the given ones.
   * @category Labeling
   */
  hasLabel(anId: LabelId, aDescription: string): boolean;

  /**
   * Checks if the assertion has the given description.
   *
   * @remarks
   * This method is used mostly for testing.
   *
   * @category Labeling
   */
  hasDescription(aDescription: string): boolean;

  /**
   * Returns the label identifier.
   * @category Labeling
   */
  getId(): LabelId;
  /**
   * @category Labeling
   */
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

export type SelfContainedAssertions = SelfContainedAssertion | SelfContainedAssertion[];
