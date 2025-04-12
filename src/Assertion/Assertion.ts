import { AssertionsRunner } from "./AssertionsRunner";

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
    return new this(assertionAsJson.id, assertionAsJson.description);
  }

  static for(id: AssertionId, condition: () => boolean, description: string) {
    return new this(id, description).require(condition);
  }

  static assertForAll(id: AssertionId, condition: () => boolean, description: string) {
    AssertionsRunner.assertAll([this.for(id, condition, description)]);
  }

  static assertFor(id: AssertionId, condition: () => boolean, description: string) {
    return this.assertForAll(id, condition, description);
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
