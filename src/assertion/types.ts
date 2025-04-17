export type AssertionId = string;

/**
 * Describes an assertion by its id and description.
 */
export interface LabeledAssertion {
  /**
   * Compares the id of the assertion with the given one.
   */
  isIdentifiedAs(assertionId: AssertionId): boolean;

  /**
   * Compare the id and description of the assertion with the given ones.
   */
  isIdentifiedAsWith(assertionId: AssertionId, assertionDescription: string): boolean;

  /**
   * Checks if the assertion has the given description.
   *
   * @remarks
   * This method is used mostly for testing.
   */
  hasDescription(assertionDescription: string): boolean;

  getId(): AssertionId;
  getDescription(): string;
}

/**
 * An assertion that can be evaluated without a value.
 *
 * @extends LabeledAssertion
 *
 * @remarks
 * `Assertion<void>` and `AssertionEvaluation` are both `SelfContainedAssertion`
 */
export interface SelfContainedAssertion extends LabeledAssertion {
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
   * Reports itself to the given list of failed assertions, if the assertion has failed.
   * @param failed - the list to report the assertion to.
   */
  collectFailureInto(failed: LabeledAssertion[]): void;
}
