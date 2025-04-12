import { AssertionsRunner } from "./AssertionsRunner";

export type AssertionId = string;

export interface AssertionAsJson {
  id: AssertionId;
  description: string;
}

/**
 * Represents a rule that must be met in order for
 * an object to be considered valid.
 *
 * @todo
 * Analyze coupling with FormCompletionAssistant {@link shouldNotRun}
 */
export class Assertion<T = unknown> {
  /**
   * @todo
   * Cuando se serializa un Assertion no habría que mandar values y condition
   * o lo que habría que reificar es AssertionFailed con solo el id y description
   * para no tener que andar transmitiendo todo
   */
  static fromJson(assertionAsJson: AssertionAsJson) {
    return new this([], assertionAsJson.id, () => false, assertionAsJson.description);
  }

  static forAll<T = unknown>(values: T[], id: AssertionId, condition: () => boolean, description: string) {
    return new this(values, id, condition, description);
  }

  static for<T = unknown>(value: T, id: AssertionId, condition: () => boolean, description: string) {
    return this.forAll([value], id, condition, description);
  }

  static assertForAll(values: unknown[], id: AssertionId, condition: () => boolean, description: string) {
    AssertionsRunner.assertAll([this.forAll(values, id, condition, description)]);
  }

  static assertFor(value: unknown, id: AssertionId, condition: () => boolean, description: string) {
    return this.assertForAll([value], id, condition, description);
  }

  constructor(
    protected values: T[],
    protected id: AssertionId,
    protected condition: () => boolean,
    protected description: string
  ) {}

  /**
   * Evaluates the condition of the assertion.
   */
  doesHold() {
    return this.condition();
  }

  /**
   * @see {@link doesHold}
   */
  doesNotHold() {
    return !this.doesHold();
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
