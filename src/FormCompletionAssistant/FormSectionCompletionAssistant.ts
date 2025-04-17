import { FormCompletionAssistant } from "./FormCompletionAssistant";
import { AssertionsFailed } from "@/assertion";

import type { AssertionId, SelfContainedAssertion } from "@/assertion";
import type { ModelFromContainer, AssistantsIn } from "@/types";

type CreationClosure<Model, ComposedModels extends unknown[]> = (...models: ComposedModels) => Model;

/**
 * Assists in the creation of complex models by coordinating multiple inner `FormCompletionAssistant`.
 *
 * @extends FormCompletionAssistant {@link FormCompletionAssistant link}
 * @template ComposedModels - An array of types representing the types of the models created by the inner assistants,
 * in the same order as the `assistants` array.
 *
 * @remarks
 * It uses a `creationClosure` function to combine the models created by its
 * assistants into a single composed model.
 */
export class FormSectionCompletionAssistant<
  Model,
  ContainerModel,
  ComposedModels extends unknown[]
> extends FormCompletionAssistant<Model, ContainerModel> {
  static with<Model, ContainerModel, ComposedModels extends unknown[]>(
    assistants: AssistantsIn<ComposedModels, Model>,
    creationClosure: CreationClosure<Model, ComposedModels>,
    fromContainerModelGetter: ModelFromContainer<Model, ContainerModel>,
    assertionIds: AssertionId[]
  ) {
    return new this(assistants, creationClosure, fromContainerModelGetter, assertionIds);
  }

  static topLevelContainerWith<Model, ComposedModels extends unknown[]>(
    assistants: AssistantsIn<ComposedModels, Model>,
    creationClosure: CreationClosure<Model, ComposedModels>,
    assertionIds: AssertionId[] = []
  ) {
    return this.with(assistants, creationClosure, this.topLevelContainerModelGetter<Model>(), assertionIds);
  }

  constructor(
    protected assistants: AssistantsIn<ComposedModels, Model>,
    protected creationClosure: CreationClosure<Model, ComposedModels>,
    fromContainerModelGetter: ModelFromContainer<Model, ContainerModel>,
    assertionIds: AssertionId[]
  ) {
    /** @ts-expect-error See {@link FormCompletionAssistant.INVALID_MODEL} */
    super(assertionIds, fromContainerModelGetter, FormCompletionAssistant.INVALID_MODEL);
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
    if (possibleCreateModelError instanceof AssertionsFailed)
      return this.routeFailedAssertionsOf(possibleCreateModelError);

    throw possibleCreateModelError;
  }

  routeFailedAssertionsOf(creationError: AssertionsFailed) {
    creationError.forEachAssertionFailed((failedAssertion) => this.routeFailedAssertion(failedAssertion));
  }

  routeFailedAssertion(failedAssertion: SelfContainedAssertion) {
    if (this.handles(failedAssertion)) this.addFailedAssertion(failedAssertion);
    else this.routeNotHandledByThisFailedAssertion(failedAssertion);
  }

  protected routeNotHandledByThisFailedAssertion(failedAssertion: SelfContainedAssertion) {
    const assistantsHandlingAssertion = this.assistantsHandling(failedAssertion);

    if (assistantsHandlingAssertion.length === 0) this.addFailedAssertion(failedAssertion);
    else this.addFailedAssertionToAll(assistantsHandlingAssertion, failedAssertion);
  }

  protected addFailedAssertionToAll(
    assistantsHandlingAssertion: FormCompletionAssistant<unknown, Model>[],
    failedAssertion: SelfContainedAssertion
  ) {
    assistantsHandlingAssertion.forEach((assistant) => assistant.addFailedAssertion(failedAssertion));
  }

  protected assistantsHandling(assertion: SelfContainedAssertion) {
    return this.assistants.filter((assistant) => assistant.handles(assertion));
  }

  protected createComposedModels(): ComposedModels {
    // @ts-expect-error TypeScript can't infer the tuple type directly.
    return this.assistants.map((assistant) => assistant.createModel());
  }
}
