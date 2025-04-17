import type { AssertionId, SelfContainedAssertion } from "@/assertion";
import type { ModelFromContainer, AssistantMirror } from "@/types";

/**
 * Provides an assistant to guide the completion of a model during form interaction.
 *
 * A `DraftAssistant` encapsulates the logic needed to:
 *
 * - track the current state of a form field or group of fields,
 * - validate the model being built,
 * - handle and route failed assertions,
 * - notify observers (mirrors) of changes or validation failures.
 *
 * Assistants can be nested and composed to build complex models.
 *
 * @template Model The type of the model the assistant helps to create.
 * @template ContainerModel The type of the container model the assistant works on.
 *
 * @remarks
 * Originally, this class was named `ModelCreator`. Later, it was renamed to `FormCompletionAssistant`,
 * employing the metaphor of an assistant guiding form completion. This could have led to confusion,
 * since the class has more use cases than just form completion.
 *
 * It can, for example, be used in a backend context to validate an object before persisting it.
 */
export abstract class DraftAssistant<Model, ContainerModel> {
  /**
   * See {@link https://github.com/microsoft/TypeScript/issues/3841 #3841} for
   * more information.
   */
  declare ["constructor"]: typeof DraftAssistant;

  /**
   * This object is used as a **token** for an invalid model.
   */
  static INVALID_MODEL = new Object();

  static isInvalidModel(potentialModel: unknown) {
    return potentialModel === DraftAssistant.INVALID_MODEL;
  }

  /**
   * @returns A default model getter from a container for the top-level assistant.
   * Since there is no container to get the model from, it throws an error.
   */
  static topLevelContainerModelGetter<Model>(): ModelFromContainer<Model, never> {
    return () => {
      throw new Error("No container to get model from");
    };
  }

  protected model: Model;
  protected failedAssertions!: SelfContainedAssertion[];
  protected mirrors: AssistantMirror<Model>[];

  constructor(
    protected assertionIds: AssertionId[],
    protected fromContainerModelGetter: ModelFromContainer<Model, ContainerModel>,
    protected initialModel: Model
  ) {
    this.model = this.initialModel;
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

  /**
   * Executes a closure depending on whether the model is valid or not after creating it.
   *
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

  getModel() {
    return this.model;
  }

  setModel(newModel: Model) {
    this.model = newModel;
    this.reflectToAll(newModel);
  }

  /**
   * Resets the model to its initial value.
   */
  resetModel() {
    this.model = this.initialModel;
    this.reflectToAll(this.model);
  }

  /**
   * Sets the model from its container.
   */
  setModelFrom(containerModel: ContainerModel) {
    return this.setModel(this.fromContainerModelGetter(containerModel));
  }

  /**
   * Adds a mirror to the list of observers.
   */
  accept(aMirror: AssistantMirror<Model>) {
    this.mirrors.push(aMirror);
  }

  /**
   * Removes a mirror from the list of observers.
   */
  break(aMirror: AssistantMirror<never>) {
    this.mirrors = this.mirrors.filter((mirror) => mirror !== aMirror);
  }

  /**
   * @returns The number of mirrors currently observing the assistant.
   */
  numberOfMirrors() {
    return this.mirrors.length;
  }

  /**
   * Adds an assertion to the list of failed assertions.
   */
  addFailedAssertion(assertionFailed: SelfContainedAssertion) {
    this.failedAssertions.push(assertionFailed);
    this.forEachMirror((mirror) => mirror.onFailure?.(assertionFailed));
  }

  /**
   * @returns `true` if the list of failed assertions is not empty
   */
  hasFailedAssertions() {
    return this.failedAssertions.length > 0;
  }

  /**
   * Opposite of {@link hasFailedAssertions}.
   */
  doesNotHaveFailedAssertions() {
    return !this.hasFailedAssertions();
  }

  /**
   * @returns The descriptions of the failed assertions
   */
  failedAssertionsDescriptions() {
    return this.failedAssertions
      .map((failedAssertion) => failedAssertion.getDescription())
      .filter((description) => description !== "");
  }

  /**
   * @returns `true` if this assistant handles the given `Assertion`.
   */
  handles(anAssertion: SelfContainedAssertion) {
    return this.assertionIds.some((assertionId) => anAssertion.isIdentifiedAs(assertionId));
  }

  /**
   * Adds an assertion id to the list of handled assertions.
   */
  addAssertionId(anAssertionId: AssertionId) {
    this.assertionIds.push(anAssertionId);
  }

  /**
   * @returns `true` if this assistant has only one failed assertion that
   * is identified as the given `assertionId`.
   *
   * @remarks
   * Used mostly for testing.
   */
  hasOnlyOneAssertionFailedIdentifiedAs(assertionId: AssertionId) {
    return this.failedAssertions.length === 1 && this.failedAssertions[0].isIdentifiedAs(assertionId);
  }

  protected removeFailedAssertions() {
    this.failedAssertions = [];
    this.forEachMirror((mirror) => mirror.onFailureReset?.());
  }

  protected forEachMirror(action: (mirror: AssistantMirror<Model>) => void) {
    this.mirrors.forEach(action);
  }

  protected reflectToAll(anImage: Model) {
    this.forEachMirror((mirror) => mirror.reflect?.(anImage));
  }
}
