import { AssertionId } from "../Assertion/Assertion";
import { FormCompletionAssistant, ModelFromContainer } from "./FormCompletionAssistant";

export class FormFieldCompletionAssistant<Model extends string> extends FormCompletionAssistant<Model> {
  protected model!: Model;

  static handling<Model extends string>(
    assertionId: AssertionId,
    fromContainerModelGetter: ModelFromContainer<Model>,
    initialModel = ""
  ) {
    return this.handlingAll([assertionId], fromContainerModelGetter, initialModel);
  }

  static handlingAll<Model extends string>(
    assertionIds: AssertionId[],
    fromContainerModelGetter: ModelFromContainer<Model>,
    initialModel = ""
  ) {
    return new this(assertionIds, fromContainerModelGetter, initialModel);
  }

  constructor(
    assertionIds: AssertionId[],
    fromContainerModelGetter: ModelFromContainer<Model>,
    protected initialModel: Model
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

  setModel(newModel: Model) {
    this.model = newModel;
  }

  resetModel() {
    this.model = this.initialModel;
  }
}
