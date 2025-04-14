export type AssertionId = string;

export interface SelfContainedAssertion {
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
