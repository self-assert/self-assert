export type AssertionId = string;

export interface SelfContainedAssertion {
  doesHold(): boolean;
  hasFailed(): boolean;
  isIdentifiedAs(assertionId: AssertionId): boolean;
  getId(): AssertionId;
  isIdentifiedAsWith(assertionId: AssertionId, assertionDescription: string): boolean;
  getDescription(): string;
  isDescription(assertionDescription: string): boolean;
}
