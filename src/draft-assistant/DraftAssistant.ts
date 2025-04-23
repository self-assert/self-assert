import type { LabelId, LabeledRule } from "../rule";
import type { ModelFromContainer, DraftViewer } from "../types";

/**
 * Provides an assistant to guide the completion of a model.
 *
 * A `DraftAssistant` encapsulates the logic needed to:
 *
 * - track the current state of a form field or group of fields,
 * - validate the model being built,
 * - handle and route failed assertions,
 * - notify observers (viewers) of changes or validation failures.
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
export abstract class DraftAssistant<Model = any, ContainerModel = any> {
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
  static topLevelModelFromContainer<Model = any>(): ModelFromContainer<Model, unknown> {
    return () => {
      throw new Error("No container to get model from");
    };
  }

  protected model: Model;
  protected brokenRules!: LabeledRule[];
  protected viewers: DraftViewer<Model>[];

  constructor(
    protected labelIds: LabelId[],
    protected modelFromContainer: ModelFromContainer<Model, ContainerModel>,
    protected initialModel: Model
  ) {
    this.model = this.initialModel;
    this.viewers = [];
    this.removeBrokenRules();
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

  getModel(): Model {
    return this.model;
  }

  setModel(newModel: Model): void {
    this.model = newModel;
    this.notifyViewersOnChange(newModel);
  }

  /**
   * Resets the model to its initial value.
   */
  resetModel(): void {
    this.model = this.initialModel;
    this.notifyViewersOnChange(this.model);
  }

  /**
   * Sets the model from its container.
   */
  setModelFrom(containerModel: ContainerModel) {
    return this.setModel(this.modelFromContainer(containerModel));
  }

  /**
   * Adds a viewer to the list of observers.
   */
  accept(aViewer: DraftViewer<Model>) {
    this.viewers.push(aViewer);
  }

  /**
   * Removes a viewer from the list of observers.
   */
  removeViewer(aViewer: DraftViewer<never>) {
    this.viewers = this.viewers.filter((viewer) => viewer !== aViewer);
  }

  /**
   * @returns The number of viewers currently observing the assistant.
   */
  numberOfViewers() {
    return this.viewers.length;
  }

  /**
   * Adds an assertion to the list of failed assertions.
   */
  addBrokenRule(aBrokenRuleLabel: LabeledRule) {
    this.brokenRules.push(aBrokenRuleLabel);
    this.forEachViewer((viewer) => viewer.onFailure?.(aBrokenRuleLabel));
  }

  /**
   * Adds a list of assertions to the list of failed assertions.
   */
  addBrokenRules(brokenRules: LabeledRule[]) {
    brokenRules.forEach((failure) => {
      this.addBrokenRule(failure);
    });
  }

  /**
   * @returns `true` if the list of failed assertions is not empty
   */
  hasBrokenRules() {
    return this.brokenRules.length > 0;
  }

  /**
   * Opposite of {@link hasBrokenRules}.
   */
  doesNotHaveBrokenRules() {
    return !this.hasBrokenRules();
  }

  /**
   * @returns The descriptions of the failed assertions
   */
  brokenRulesDescriptions() {
    return this.brokenRules
      .map((brokenRule) => brokenRule.getDescription())
      .filter((description) => description !== "");
  }

  /**
   * @returns `true` if this assistant handles the given `Assertion`.
   */
  handles(aRule: LabeledRule) {
    return this.labelIds.some((labelId) => aRule.hasLabelId(labelId));
  }

  /**
   * Adds an assertion id to the list of handled assertions.
   */
  addLabelId(aLabelId: LabelId) {
    this.labelIds.push(aLabelId);
  }

  /**
   * @returns `true` if this assistant has only one failed assertion that
   * is identified as the given `assertionId`.
   *
   * @remarks
   * Used mostly for testing.
   */
  hasOnlyOneRuleBrokenIdentifiedAs(assertionId: LabelId) {
    return this.brokenRules.length === 1 && this.brokenRules[0].hasLabelId(assertionId);
  }

  removeBrokenRules() {
    this.brokenRules = [];
    this.forEachViewer((viewer) => viewer.onFailuresReset?.());
  }

  protected forEachViewer(action: (viewer: DraftViewer<Model>) => void) {
    this.viewers.forEach(action);
  }

  protected notifyViewersOnChange(aModel: Model) {
    this.forEachViewer((viewer) => viewer.onDraftChanged?.(aModel));
  }
}
