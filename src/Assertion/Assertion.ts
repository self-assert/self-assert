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
  /**
   * @todo
   * Cuando se serializa un Assertion no habría que mandar values y condition
   * o lo que habría que reificar es AssertionFailed con solo el id y description
   * para no tener que andar transmitiendo todo
   */
  static fromJson(assertionAsJson: AssertionAsJson) {
    return new this(assertionAsJson.id, () => false, assertionAsJson.description);
  }

  static forAll(id: AssertionId, condition: () => boolean, description: string) {
    return new this(id, condition, description);
  }

  static for(id: AssertionId, condition: () => boolean, description: string) {
    return this.forAll(id, condition, description);
  }

  static assertForAll(id: AssertionId, condition: () => boolean, description: string) {
    AssertionsRunner.assertAll([this.forAll(id, condition, description)]);
  }

  static assertFor(id: AssertionId, condition: () => boolean, description: string) {
    return this.assertForAll(id, condition, description);
  }

  constructor(protected id: AssertionId, protected condition: () => boolean, protected description: string) {}

  /**
   * Evaluates the condition of the assertion.
   */
  doesHold() {
    return this.condition();
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
