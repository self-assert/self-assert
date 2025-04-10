import type { Assertion, AssertionId } from "../Assertion/Assertion";
import type { ModelFromContainer, AssistantMirror } from "./types";

/**
 * @template Model - The type of the model the assistant helps to create.
 * @template ContainerModel - The type of the container model the assistant works on.
 *
 * @remarks
 * The name was chosen employing the metaphor of an assistant guiding form completion.
 */
export abstract class FormCompletionAssistant<Model, ContainerModel> {
  /**
   * See {@link https://github.com/microsoft/TypeScript/issues/3841 #3841} for
   * more information.
   */
  declare ["constructor"]: typeof FormCompletionAssistant;

  /**
   * This object is used as a token for an invalid model.
   * This allows running all validations on a composed model.
   */
  static INVALID_MODEL = new Object();

  static isInvalidModel(potentialModel: unknown) {
    return potentialModel === FormCompletionAssistant.INVALID_MODEL;
  }

  static topLevelContainerModelGetter<Model>(): ModelFromContainer<Model, never> {
    return () => {
      throw new Error("No container to get model from");
    };
  }

  protected failedAssertions!: Assertion[];
  protected mirrors: AssistantMirror<Model>[];

  constructor(
    protected assertionIds: AssertionId[],
    protected fromContainerModelGetter: ModelFromContainer<Model, ContainerModel>
  ) {
    this.mirrors = [];
    this.removeFailedAssertions();
  }

  /**
   * Attempts to create a model. It fails if any of the assertions fail.
   * @see {@link withCreatedModelDo}.
   *
   * @throws {AssertionsFailed} if the model is invalid
   */
  abstract createModel(): Model;

  abstract getModel(): Model;

  abstract setModel(newModel: Model): void;

  abstract resetModel(): void;

  /**
   * @template ReturnType - The type of the value returned by the closures.
   * @param validModelClosure - A closure that will be called with the created model
   * if it's valid.
   * @param invalidModelClosure - A closure that will be called if the model is invalid.
   * @returns The return value of the closure that was called.
   */
  withCreatedModelDo<ReturnType>(
    validModelClosure: (model: Model) => ReturnType,
    invalidModelClosure: () => ReturnType
  ) {
    const createdModel = this.createModel();
    if (this.constructor.isInvalidModel(createdModel)) return invalidModelClosure();

    return validModelClosure(createdModel);
  }

  setModelFrom(containerModel: ContainerModel) {
    return this.setModel(this.fromContainerModelGetter(containerModel));
  }

  accept(aMirror: AssistantMirror<Model>) {
    this.mirrors.push(aMirror);
  }

  protected reflect(anImage: Model) {
    this.mirrors.forEach((mirror) => mirror.onReflection(anImage));
  }

  numberOfMirrors() {
    return this.mirrors.length;
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

  handles(anAssertion: Assertion) {
    return this.assertionIds.some((assertionId) => anAssertion.isIdentifiedAs(assertionId));
  }

  protected removeFailedAssertions() {
    this.failedAssertions = [];
  }
}
