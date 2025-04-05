import { FormCompletionAssistant } from "./FormCompletionAssistant";
import { AssertionsFailed } from "../Assertion/AssertionsFailed";
import type { AssertionId, Assertion } from "../Assertion/Assertion";
import type { ModelFromContainer, AssistantsIn } from "./types";

type CreationClosure<Model, ComposedModels extends any[]> = (...models: ComposedModels) => Model;

/**
 * Assists in the creation of complex models by coordinating multiple inner `FormCompletionAssistant` instances.
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
  ComposedModels extends any[]
> extends FormCompletionAssistant<Model, ContainerModel> {
  protected model!: Model; //| typeof FormCompletionAssistant.INVALID_MODEL;

  static with<Model, ContainerModel, ComposedModels extends any[]>(
    assistants: AssistantsIn<ComposedModels, Model>,
    creationClosure: CreationClosure<Model, ComposedModels>,
    fromContainerModelGetter: ModelFromContainer<Model, ContainerModel>,
    assertionIds: AssertionId[]
  ) {
    return new this(assistants, creationClosure, fromContainerModelGetter, assertionIds);
  }

  static topLevelContainerWith<Model, ComposedModels extends any[]>(
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
    super(assertionIds, fromContainerModelGetter);
    this.resetModel();
  }

  createModel() {
    this.removeFailedAssertions();
    const models = this.createComposedModels();
    try {
      this.model = this.creationClosure(...models);
    } catch (error) {
      this.invalidateModel();
      this.handleError(error);
    }

    return this.model;
  }

  getModel() {
    return this.model;
  }

  setModel(newModel: Model) {
    this.model = newModel;
    this.assistants.forEach((assistant) => assistant.setModelFrom(newModel));
  }

  resetModel() {
    this.invalidateModel();
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

  routeFailedAssertion(failedAssertion: Assertion) {
    if (this.handles(failedAssertion)) this.addFailedAssertion(failedAssertion);
    else this.routeNotHandledByThisFailedAssertion(failedAssertion);
  }

  protected routeNotHandledByThisFailedAssertion(failedAssertion: Assertion) {
    const assistantsHandlingAssertion = this.assistantsHandling(failedAssertion);

    if (assistantsHandlingAssertion.length === 0) this.addFailedAssertion(failedAssertion);
    else this.addFailedAssertionToAll(assistantsHandlingAssertion, failedAssertion);
  }

  protected addFailedAssertionToAll(
    assistantsHandlingAssertion: FormCompletionAssistant<any, Model>[],
    failedAssertion: Assertion<unknown>
  ) {
    assistantsHandlingAssertion.forEach((assistant) => assistant.addFailedAssertion(failedAssertion));
  }

  protected assistantsHandling(assertion: Assertion) {
    return this.assistants.filter((assistant) => assistant.handles(assertion));
  }

  protected invalidateModel() {
    /** @ts-expect-error See {@link FormCompletionAssistant.INVALID_MODEL} */
    this.model = this.constructor.INVALID_MODEL;
  }

  protected createComposedModels(): ComposedModels {
    // @ts-expect-error TypeScript can't infer the tuple type directly.
    return this.assistants.map((assistant) => assistant.createModel());
  }
}
