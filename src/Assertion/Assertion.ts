export type AssertionId = string;

export interface AssertionAsJson {
  id: AssertionId;
  description: string;
}

/**
 * Represents a rule that must be met in order for
 * an object to be considered valid.
 */
export class Assertion {
  static fromJson(assertionAsJson: AssertionAsJson) {
    return this.identifiedAs(assertionAsJson.id, assertionAsJson.description);
  }

  static identifiedAs(id: AssertionId, description: string) {
    return new this(id, description);
  }

  static for(id: AssertionId, description: string, condition: () => boolean) {
    return this.identifiedAs(id, description).require(condition);
  }

  protected conditions: (() => boolean)[];

  protected constructor(protected id: AssertionId, protected description: string) {
    this.conditions = [];
  }

  require(condition: () => boolean) {
    this.conditions.push(condition);
    return this;
  }

  /**
   * Evaluates the condition of the assertion.
   */
  doesHold() {
    return this.conditions.every((condition) => condition());
  }

  hasFailed() {
    return !this.doesHold();
  }

  isIdentifiedAs(assertionId: AssertionId) {
    return this.id === assertionId;
  }

  getId(): AssertionId {
    return this.id;
  }

  isIdentifiedAsWith(assertionId: AssertionId, assertionDescription: string) {
    return this.isIdentifiedAs(assertionId) && this.isDescription(assertionDescription);
  }

  getDescription() {
    return this.description;
  }

  isDescription(assertionDescription: string) {
    return this.description === assertionDescription;
  }
}
