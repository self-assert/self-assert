/**
 * category Rule labeling
 * @hidden
 */
export type LabelId = string;

/**
 * Describes a rule by its id and description.
 *
 * @category Rule labeling
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

/**
 * Describes a rule that knows how to collect failures into a list.
 *
 * @category Rules
 */
export interface CollectableRule<ValueType, CollectionType extends void | Promise<void>> extends LabeledRule {
  collectFailureInto(failed: LabeledRule[], value: ValueType): CollectionType;
}

/**
 * @category Supporting types
 */
export type MaybeAsync<Type = void> = Type | Promise<Type>;

/**
 * @category Supporting types
 */
export type RuleRequirement<ReturnType extends MaybeAsync<boolean>, ValueType = any> = (value: ValueType) => ReturnType;

/**
 * @category Supporting types
 */
export type SelfContainedRule<EvaluationType extends MaybeAsync = MaybeAsync> = CollectableRule<void, EvaluationType>;

/**
 * @category Supporting types
 */
export type SelfContainedRules = SelfContainedRule | SelfContainedRule[];

/**
 * @category Supporting types
 */
export type SelfContainedAssertion = SelfContainedRule<void>;

/**
 * @category Supporting types
 */
export type ValueParam<Type> = Type extends void ? [] : [Type];

/**
 * @category Supporting types
 */
export type SelfContainedAssertions = SelfContainedAssertion | SelfContainedAssertion[];
