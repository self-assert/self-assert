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

  static topLevelWith<Model, ComposedModels extends any[]>(
    assistants: AssistantsIn<ComposedModels, Model>,
    creationClosure: CreationClosure<Model, ComposedModels>,
    assertionIds: AssertionId[]
  ) {
    return this.with(
      assistants,
      creationClosure,
      (() => {
        throw new Error("Should not be called");
      }) as ModelFromContainer<Model, never>,
      assertionIds
    );
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
      this.handleCreateModelError(error);
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

  routeFailedAssertionsOf(creationError: AssertionsFailed) {
    creationError.forEachAssertionFailed((failedAssertion) => this.routeFailedAssertion(failedAssertion));
  }

  routeFailedAssertion(failedAssertion: Assertion) {
    if (this.handles(failedAssertion)) this.addFailedAssertion(failedAssertion);
    else this.routeNotHandledByThisFailedAssertion(failedAssertion);
  }

  routeNotHandledByThisFailedAssertion(failedAssertion: Assertion) {
    const assistantsHandlingAssertion = this.assistantsHandling(failedAssertion);

    if (assistantsHandlingAssertion.length === 0) this.addFailedAssertion(failedAssertion);
    else this.addFailedAssertionToAll(assistantsHandlingAssertion, failedAssertion);
  }

  /**
   * @todo Better type check
   */
  addFailedAssertionToAll(
    assistantsHandlingAssertion: FormCompletionAssistant<any, any>[],
    failedAssertion: Assertion<unknown>
  ) {
    assistantsHandlingAssertion.forEach((assistant) => assistant.addFailedAssertion(failedAssertion));
  }

  protected assistantsHandling(assertion: Assertion) {
    return this.assistants.filter((assistant) => assistant.handles(assertion));
  }

  protected invalidateModel() {
    // @ts-expect-error MUST FIX
    this.model = this.constructor.INVALID_MODEL;
  }

  protected createComposedModels(): ComposedModels {
    // TypeScript can't infer the tuple type directly.
    return this.assistants.map((assistant) => assistant.createModel()) as ComposedModels;
  }

  protected handleCreateModelError(error: unknown) {
    if (error instanceof AssertionsFailed) return this.routeFailedAssertionsOf(error);

    throw error;
  }
}
