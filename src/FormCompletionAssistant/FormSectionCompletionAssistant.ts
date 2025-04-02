import { FormCompletionAssistant, ModelFromContainer } from "./FormCompletionAssistant";
import { AssertionsFailed } from "../Assertion/AssertionsFailed";
import type { AssertionId, Assertion } from "../Assertion/Assertion";

type CreationClosure<T, S extends any[] = unknown[]> = (...models: S) => T;

export class FormSectionCompletionAssistant<T = unknown, S extends any[] = any[]> extends FormCompletionAssistant<T> {
  protected model!: T; //| typeof FormCompletionAssistant.INVALID_MODEL;

  static with<T = unknown, S extends any[] = any[]>(
    assistants: FormCompletionAssistant[],
    creationClosure: CreationClosure<T, S>,
    fromContainerModelGetter: ModelFromContainer<T>,
    assertionIds: AssertionId[]
  ) {
    return new this(assistants, creationClosure, fromContainerModelGetter, assertionIds);
  }

  constructor(
    protected assistants: FormCompletionAssistant[],
    protected creationClosure: CreationClosure<T, any[]>,
    fromContainerModelGetter: ModelFromContainer<T>,
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

  setModel(newModel: T) {
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

  protected createComposedModels() {
    return this.assistants.map((assistant) => assistant.createModel());
  }

  protected handleCreateModelError(error: unknown) {
    if (error instanceof AssertionsFailed) return this.routeFailedAssertionsOf(error);

    throw error;
  }
}
