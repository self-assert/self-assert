import { AssertionId } from "../Assertion/Assertion";
import { FormCompletionAssistant, ModelFromContainer } from "./FormCompletionAssistant";

export class FormFieldCompletionAssistant<T extends string> extends FormCompletionAssistant<T> {
  protected model!: T;

  static handling<T extends string>(
    assertionId: AssertionId,
    fromContainerModelGetter: ModelFromContainer<T>,
    initialModel = ""
  ) {
    return this.handlingAll([assertionId], fromContainerModelGetter, initialModel);
  }

  static handlingAll<T extends string>(
    assertionIds: AssertionId[],
    fromContainerModelGetter: ModelFromContainer<T>,
    initialModel = ""
  ) {
    return new this(assertionIds, fromContainerModelGetter, initialModel);
  }

  constructor(
    assertionIds: AssertionId[],
    fromContainerModelGetter: ModelFromContainer<T>,
    protected initialModel: T
  ) {
    super(assertionIds, fromContainerModelGetter);
    this.setModel(initialModel);
  }

  createModel() {
    this.removeFailedAssertions();
    return this.model;
  }

  getModel() {
    return this.model;
  }

  setModel(newModel: T) {
    this.model = newModel;
  }

  resetModel() {
    this.model = this.initialModel;
  }
}
