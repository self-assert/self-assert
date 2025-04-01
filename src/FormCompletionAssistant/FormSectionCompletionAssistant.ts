import { FormCompletionAssistant, ModelFromContainer } from "./FormCompletionAssistant";
import { AssertionsFailed } from "../Assertion/AssertionsFailed";
import type { AssertionId, Assertion } from "../Assertion/Assertion";

export class FormSectionCompletionAssistant<T = unknown> extends FormCompletionAssistant<T> {
  protected model!: T; //| typeof FormCompletionAssistant.INVALID_MODEL;

  static with(
    assistants: FormCompletionAssistant[],
    creationClosure,
    fromContainerModelGetter,
    assertionIds: AssertionId[]
  ) {
    return new this(assistants, creationClosure, fromContainerModelGetter, assertionIds);
  }

  constructor(
    protected assistants: FormCompletionAssistant[],
    protected creationClosure,
    fromContainerModelGetter: ModelFromContainer<T>,
    assertionIds: AssertionId[]
  ) {
    super(assertionIds, fromContainerModelGetter);
  }

  setModel(newModel: T) {
    this.model = newModel;
    this.assistants.forEach((assistant) => assistant.setModelFrom(newModel));
  }

  resetModel() {
    this.invalidateModel();
    this.assistants.forEach((assistant) => assistant.resetModel());
  }

  getModel() {
    return this.model;
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

  handleCreateModelError(error) {
    if (error instanceof AssertionsFailed) this.routeFailedAssertionsOf(error);
    else throw error;
  }

  createComposedModels() {
    return this.assistants.map((assistant) => assistant.createModel());
  }

  routeFailedAssertionsOf(creationError: AssertionsFailed) {
    creationError.forEachAssertionFailed((failedAssertion) =>
      this.routeFailedAssertion(failedAssertion)
    );
  }

  routeFailedAssertion(failedAssertion: Assertion) {
    if (this.handles(failedAssertion)) this.addFailedAssertion(failedAssertion);
    else this.routeNotHandledByThisFailedAssertion(failedAssertion);
  }

  routeNotHandledByThisFailedAssertion(failedAssertion) {
    const assistantsHandlingAssertion = this.assistantsHandling(failedAssertion);

    if (assistantsHandlingAssertion.length === 0) this.addFailedAssertion(failedAssertion);
    else this.addFailedAssertionToAll(assistantsHandlingAssertion, failedAssertion);
  }

  addFailedAssertionToAll(assistantsHandlingAssertion, failedAssertion) {
    assistantsHandlingAssertion.forEach((assistant) =>
      assistant.addFailedAssertion(failedAssertion)
    );
  }

  assistantsHandling(assertion: Assertion) {
    return this.assistants.filter((assistant) => assistant.handles(assertion));
  }

  protected invalidateModel() {
    // @ts-expect-error MUST FIX
    this.model = this.constructor.INVALID_MODEL;
  }
}
