import { DraftAssistant } from "./DraftAssistant";
import { RulesBroken } from "../rule";

import type { LabelId, LabeledRule } from "../rule";
import type { ModelFromContainer, AssistantsIn } from "../types";

/**
 * @category Supporting types
 */
export type CreationClosure<Model, ComposedModels extends unknown[]> = (...models: ComposedModels) => Model;

/**
 * Assists in the creation of complex models by coordinating multiple inner `DraftAssistant`.
 *
 * It uses a {@link CreationClosure} function to combine the models created by its
 * assistants into a single composed model.
 *
 * @template ComposedModels - An array of types representing the types of the models created by the inner assistants,
 * in the same order as the `assistants` array.
 *
 * @category Draft assistants
 */
export class SectionDraftAssistant<
  Model = any,
  ContainerModel = any,
  ComposedModels extends unknown[] = any[]
> extends DraftAssistant<Model, ContainerModel> {
  static with<Model = any, ContainerModel = any, ComposedModels extends unknown[] = any[]>(
    assistants: AssistantsIn<ComposedModels, Model>,
    creationClosure: CreationClosure<Model, ComposedModels>,
    modelFromContainer: ModelFromContainer<Model, ContainerModel>,
    assertionIds: LabelId[]
  ) {
    return new this(assistants, creationClosure, modelFromContainer, assertionIds);
  }

  static topLevelContainerWith<Model = any, ComposedModels extends unknown[] = any[]>(
    assistants: AssistantsIn<ComposedModels, Model>,
    creationClosure: CreationClosure<Model, ComposedModels>,
    assertionIds: LabelId[] = []
  ) {
    return this.with(assistants, creationClosure, this.topLevelModelFromContainer<Model>(), assertionIds);
  }

  constructor(
    protected assistants: AssistantsIn<ComposedModels, Model>,
    protected creationClosure: CreationClosure<Model, ComposedModels>,
    modelFromContainer: ModelFromContainer<Model, ContainerModel>,
    assertionIds: LabelId[]
  ) {
    /** @ts-expect-error See {@link DraftAssistant.INVALID_MODEL} */
    super(assertionIds, modelFromContainer, DraftAssistant.INVALID_MODEL);
  }

  createModel() {
    this.removeBrokenRules();
    const models = this.createComposedModels();
    try {
      super.setModel(this.creationClosure(...models));
    } catch (error) {
      super.resetModel();
      this.handleError(error);
    }

    return this.model;
  }

  setModel(newModel: Model) {
    super.setModel(newModel);
    this.assistants.forEach((assistant) => assistant.setModelFrom(newModel));
  }

  resetModel() {
    super.resetModel();
    this.assistants.forEach((assistant) => assistant.resetModel());
  }

  /**
   * @category Error handling
   */
  handleError(possibleCreateModelError: unknown) {
    if (possibleCreateModelError instanceof RulesBroken) return this.routeBrokenRulesOf(possibleCreateModelError);

    throw possibleCreateModelError;
  }

  /**
   * @category Error handling
   */
  routeBrokenRulesOf(aRulesBrokenError: RulesBroken) {
    aRulesBrokenError.forEachRuleBroken((brokenRule) => this.routeBrokenRule(brokenRule));
  }

  /**
   * @category Error handling
   */
  routeBrokenRule(brokenRule: LabeledRule) {
    if (this.handles(brokenRule)) this.addBrokenRule(brokenRule);
    else this.routeNotHandledByThisBrokenRule(brokenRule);
  }

  /**
   * @deprecated Use {@link routeBrokenRulesOf} instead
   * @category Error handling
   */
  routeFailedAssertionsOf(creationError: RulesBroken) {
    creationError.forEachRuleBroken((failedAssertion) => this.routeBrokenRule(failedAssertion));
  }

  /**
   * @deprecated Use {@link routeBrokenRule} instead
   * @category Error handling
   */
  routeFailedAssertion(failedAssertion: LabeledRule) {
    return this.routeBrokenRule(failedAssertion);
  }

  protected routeNotHandledByThisBrokenRule(brokenRule: LabeledRule) {
    const assistantsHandlingRule = this.assistantsHandling(brokenRule);

    if (assistantsHandlingRule.length === 0) this.addBrokenRule(brokenRule);
    else this.addBrokenRuleToAll(assistantsHandlingRule, brokenRule);
  }

  protected addBrokenRuleToAll(assistantsHandlingAssertion: DraftAssistant<unknown, Model>[], brokenRule: LabeledRule) {
    assistantsHandlingAssertion.forEach((assistant) => assistant.addBrokenRule(brokenRule));
  }

  protected assistantsHandling(assertion: LabeledRule) {
    return this.assistants.filter((assistant) => assistant.handles(assertion));
  }

  protected createComposedModels(): ComposedModels {
    // @ts-expect-error TypeScript can't infer the tuple type directly.
    return this.assistants.map((assistant) => assistant.createModel());
  }
}
