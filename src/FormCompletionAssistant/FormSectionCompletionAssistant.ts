import { FormCompletionAssistant, ModelFromContainer } from "./FormCompletionAssistant";
import { AssertionsFailed } from "../Assertion/AssertionsFailed";
import type { AssertionId, Assertion } from "../Assertion/Assertion";

type CreationClosure<Model, ComposedModels extends any[]> = (...models: ComposedModels) => Model;

type AssistantsFor<Models extends any[]> = {
  [Index in keyof Models]: FormCompletionAssistant<Models[Index]>;
};

export class FormSectionCompletionAssistant<
  Model,
  ComposedModels extends any[]
> extends FormCompletionAssistant<Model> {
  protected model!: Model; //| typeof FormCompletionAssistant.INVALID_MODEL;

  static with<Model = unknown, ComposedModels extends any[] = any[]>(
    assistants: AssistantsFor<ComposedModels>,
    creationClosure: CreationClosure<Model, ComposedModels>,
    fromContainerModelGetter: ModelFromContainer<Model>,
    assertionIds: AssertionId[]
  ) {
    return new this(assistants, creationClosure, fromContainerModelGetter, assertionIds);
  }

  constructor(
    protected assistants: AssistantsFor<ComposedModels>,
    protected creationClosure: CreationClosure<Model, ComposedModels>,
    fromContainerModelGetter: ModelFromContainer<Model>,
    assertionIds: AssertionId[]
  ) {
    super(assertionIds, fromContainerModelGetter);
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

  addFailedAssertionToAll(assistantsHandlingAssertion: FormCompletionAssistant[], failedAssertion: Assertion<unknown>) {
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
