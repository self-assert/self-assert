import { DraftAssistant } from "./DraftAssistant";
import { RulesBroken } from "@/assertion";

import type { LabelId, LabeledRule } from "@/assertion";
import type { ModelFromContainer, AssistantsIn } from "@/types";

export type CreationClosure<Model, ComposedModels extends unknown[]> = (...models: ComposedModels) => Model;

/**
 * Assists in the creation of complex models by coordinating multiple inner `DraftAssistant`.
 *
 * It uses a `creationClosure` function to combine the models created by its
 * assistants into a single composed model.
 *
 * @extends DraftAssistant {@link DraftAssistant link}
 * @template ComposedModels - An array of types representing the types of the models created by the inner assistants,
 * in the same order as the `assistants` array.
 *
 */
export class SectionDraftAssistant<Model, ContainerModel, ComposedModels extends unknown[]> extends DraftAssistant<
  Model,
  ContainerModel
> {
  static with<Model, ContainerModel, ComposedModels extends unknown[]>(
    assistants: AssistantsIn<ComposedModels, Model>,
    creationClosure: CreationClosure<Model, ComposedModels>,
    modelFromContainer: ModelFromContainer<Model, ContainerModel>,
    assertionIds: LabelId[]
  ) {
    return new this(assistants, creationClosure, modelFromContainer, assertionIds);
  }

  static topLevelContainerWith<Model, ComposedModels extends unknown[]>(
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
    this.removeFailedAssertions();
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

  handleError(possibleCreateModelError: unknown) {
    if (possibleCreateModelError instanceof RulesBroken) return this.routeFailedAssertionsOf(possibleCreateModelError);

    throw possibleCreateModelError;
  }

  routeFailedAssertionsOf(creationError: RulesBroken) {
    creationError.forEachRuleBroken((failedAssertion) => this.routeFailedAssertion(failedAssertion));
  }

  routeFailedAssertion(failedAssertion: LabeledRule) {
    if (this.handles(failedAssertion)) this.addFailedAssertion(failedAssertion);
    else this.routeNotHandledByThisFailedAssertion(failedAssertion);
  }

  protected routeNotHandledByThisFailedAssertion(failedAssertion: LabeledRule) {
    const assistantsHandlingAssertion = this.assistantsHandling(failedAssertion);

    if (assistantsHandlingAssertion.length === 0) this.addFailedAssertion(failedAssertion);
    else this.addFailedAssertionToAll(assistantsHandlingAssertion, failedAssertion);
  }

  protected addFailedAssertionToAll(
    assistantsHandlingAssertion: DraftAssistant<unknown, Model>[],
    failedAssertion: LabeledRule
  ) {
    assistantsHandlingAssertion.forEach((assistant) => assistant.addFailedAssertion(failedAssertion));
  }

  protected assistantsHandling(assertion: LabeledRule) {
    return this.assistants.filter((assistant) => assistant.handles(assertion));
  }

  protected createComposedModels(): ComposedModels {
    // @ts-expect-error TypeScript can't infer the tuple type directly.
    return this.assistants.map((assistant) => assistant.createModel());
  }
}
