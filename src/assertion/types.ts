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

/**
 * An assertion that can be evaluated without a value.
 *
 * @remarks
 * `Assertion<void>` and `AssertionEvaluation` are both `SelfContainedAssertion`
 *
 * @group Assertions
 */
export interface SelfContainedAssertion extends LabeledRule {
  /**
   * Returns `true` if the assertion conditions are met.
   */
  doesHold(): boolean;
  /**
   * Returns `true` if the assertion conditions are not met.
   *
   * @remarks
   * Inverse of `doesHold`
   */
  hasFailed(): boolean;

  /**
   * Throws an error if the assertion conditions are not met.
   */
  mustHold(): void;

  /**
   * Reports itself to the given list of failed assertions, if the assertion has failed.
   * @param failed - the list to report the assertion to.
   */
  collectFailureInto(failed: LabeledRule[]): void;
}
