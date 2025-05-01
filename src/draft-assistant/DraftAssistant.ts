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
 *
 * @category Draft assistants
 */
export abstract class DraftAssistant<Model = any, ContainerModel = any> {
  /**
   * See {@link https://github.com/microsoft/TypeScript/issues/3841 #3841} for
   * more information.
   * @hidden
   */
  declare ["constructor"]: typeof DraftAssistant;

  /**
   * This object is used as a **token** for an invalid model.
   * @category Model creation
   */
  static INVALID_MODEL = new Object();

  /**
   * @category Model creation
   */
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

  protected constructor(
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
   *
   * @category Model creation
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
   *
   * @category Model creation
   */
  withCreatedModelDo<ReturnType>(
    validModelClosure: (model: Model) => ReturnType,
    invalidModelClosure: () => ReturnType
  ) {
    const createdModel = this.createModel();
    if (this.constructor.isInvalidModel(createdModel)) return invalidModelClosure();

    return validModelClosure(createdModel);
  }

  /**
   * @category Model creation
   */
  getModel(): Model {
    return this.model;
  }

  /**
   * @category Model creation
   */
  setModel(newModel: Model): void {
    this.model = newModel;
    this.notifyViewersOnChange(newModel);
  }

  /**
   * Resets the model to its initial value.
   * @category Model creation
   */
  resetModel(): void {
    this.model = this.initialModel;
    this.notifyViewersOnChange(this.model);
  }

  /**
   * Sets the model from its container.
   * @category Model creation
   */
  setModelFrom(containerModel: ContainerModel) {
    return this.setModel(this.modelFromContainer(containerModel));
  }

  /**
   * Adds a viewer to the list of observers.
   * @category Viewers
   */
  accept(aViewer: DraftViewer<Model>) {
    this.viewers.push(aViewer);
  }

  /**
   * Removes a viewer from the list of observers.
   * @category Viewers
   */
  removeViewer(aViewer: DraftViewer<never>) {
    this.viewers = this.viewers.filter((viewer) => viewer !== aViewer);
  }

  /**
   * @returns The number of viewers currently observing the assistant.
   * @category Viewers
   */
  numberOfViewers() {
    return this.viewers.length;
  }

  /**
   * Adds a rule to the list of broken rules.
   * @category Rules
   */
  addBrokenRule(aBrokenRuleLabel: LabeledRule) {
    if (this.hasBrokenRule(aBrokenRuleLabel)) return;

    this.brokenRules.push(aBrokenRuleLabel);
    this.forEachViewer((viewer) => viewer.onFailure?.(aBrokenRuleLabel));
  }

  /**
   * Adds a list of rules to the list of broken rules.
   * @category Rules
   */
  addBrokenRules(brokenRules: LabeledRule[]) {
    brokenRules.forEach((failure) => {
      this.addBrokenRule(failure);
    });
  }

  /**
   * @returns `true` if the list of broken rules is not empty
   * @category Rules
   */
  hasBrokenRules() {
    return this.brokenRules.length > 0;
  }

  /**
   * Opposite of {@link hasBrokenRules}.
   * @category Rules
   */
  doesNotHaveBrokenRules() {
    return !this.hasBrokenRules();
  }

  /**
   * @returns The descriptions of the broken rules
   * @category Rules
   */
  brokenRulesDescriptions() {
    return this.brokenRules
      .map((brokenRule) => brokenRule.getDescription())
      .filter((description) => description !== "");
  }

  /**
   * @returns `true` if this assistant handles the given `Assertion`.
   * @category Rules
   */
  handles(aRule: LabeledRule) {
    return this.labelIds.some((labelId) => aRule.hasLabelId(labelId));
  }

  /**
   * Adds an assertion id to the list of handled assertions.
   * @category Rules
   */
  addLabelId(aLabelId: LabelId) {
    this.labelIds.push(aLabelId);
  }

  /**
   * @category Rules
   */
  hasBrokenRule(aBrokenRuleLabel: LabeledRule) {
    return this.brokenRules.some((brokenRule) => brokenRule.isLabeledAs(aBrokenRuleLabel));
  }

  /**
   * @returns `true` if this assistant has only one failed assertion that
   * is identified as the given `assertionId`.
   *
   * @remarks
   * Used mostly for testing.
   *
   * @category Rules
   */
  hasOnlyOneRuleBrokenIdentifiedAs(assertionId: LabelId) {
    return this.brokenRules.length === 1 && this.brokenRules[0].hasLabelId(assertionId);
  }

  /**
   * @category Rules
   */
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
