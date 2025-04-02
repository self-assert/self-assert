import type { Assertion, AssertionId } from "../Assertion/Assertion";

/**
 * @todo better name
 */
export type ModelFromContainer<Model> = (containerModel: unknown) => Model;

/**
 * The name was chosen employing the metaphor of an assistant guiding form completion.
 */
export abstract class FormCompletionAssistant<Model = unknown> {
  /**
   * See {@link https://github.com/microsoft/TypeScript/issues/3841 #3841} for
   * more information.
   */
  declare ["constructor"]: typeof FormCompletionAssistant;

  // Este objeto es usado como token de modelo inválido y de esta
  // manera poder correr todas las validaciones en objetos compuestos
  static INVALID_MODEL = new Object();

  protected failedAssertions!: Assertion[];

  static isInvalidModel(potentialModel: unknown) {
    return potentialModel === FormCompletionAssistant.INVALID_MODEL;
  }

  constructor(protected assertionIds: AssertionId[], protected fromContainerModelGetter: ModelFromContainer<Model>) {
    this.removeFailedAssertions();
  }

  abstract createModel(): Model;

  abstract getModel(): Model;

  abstract setModel(newModel: Model): void;

  /**
   * @todo Check if it's being used
   */
  abstract resetModel(): void;

  withCreatedModelDo<ReturnType>(
    validModelClosure: (model: Model) => ReturnType,
    invalidModelClosure: () => ReturnType
  ) {
    const createdModel = this.createModel();
    if (this.constructor.isInvalidModel(createdModel)) return invalidModelClosure();

    return validModelClosure(createdModel);
  }

  setModelFrom(containerModel: unknown) {
    return this.setModel(this.fromContainerModelGetter(containerModel));
  }

  removeFailedAssertions() {
    this.failedAssertions = [];
  }

  handles(anAssertion: Assertion) {
    return this.assertionIds.some((assertionId) => anAssertion.isIdentifiedAs(assertionId));
  }

  hasOnlyOneAssertionFailedIdentifiedAs(assertionId: AssertionId) {
    return this.failedAssertions.length === 1 && this.failedAssertions[0].isIdentifiedAs(assertionId);
  }

  addFailedAssertion(assertionFailed: Assertion) {
    this.failedAssertions.push(assertionFailed);
  }

  doesNotHaveFailedAssertions() {
    return !this.hasFailedAssertions();
  }

  hasFailedAssertions() {
    return this.failedAssertions.length > 0;
  }

  failedAssertionsDescriptions() {
    return this.failedAssertions
      .map((failedAssertion) => failedAssertion.getDescription())
      .filter((description) => description !== "");
  }

  addAssertionId(anAssertionId: AssertionId) {
    this.assertionIds.push(anAssertionId);
  }
}
