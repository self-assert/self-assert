import { AssertionId } from "../Assertion/Assertion";
import { FormCompletionAssistant } from "./FormCompletionAssistant";
import type { ModelFromContainer } from "./types";

export class FormFieldCompletionAssistant<Model extends string, ContainerModel> extends FormCompletionAssistant<
  Model,
  ContainerModel
> {
  protected model!: Model;

  static handling<Model extends string, ContainerModel>(
    assertionId: AssertionId,
    fromContainerModelGetter: ModelFromContainer<Model, ContainerModel>,
    initialModel = ""
  ) {
    return this.handlingAll([assertionId], fromContainerModelGetter, initialModel);
  }

  static handlingAll<Model extends string, ContainerModel>(
    assertionIds: AssertionId[],
    fromContainerModelGetter: ModelFromContainer<Model, ContainerModel>,
    initialModel = ""
  ) {
    return new this(assertionIds, fromContainerModelGetter, initialModel);
  }

  constructor(
    assertionIds: AssertionId[],
    fromContainerModelGetter: ModelFromContainer<Model, ContainerModel>,
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
