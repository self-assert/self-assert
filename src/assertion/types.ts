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
