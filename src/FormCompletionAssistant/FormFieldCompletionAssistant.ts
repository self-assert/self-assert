import { AssertionId } from "../Assertion/Assertion";
import { FormCompletionAssistant } from "./FormCompletionAssistant";
import type { ModelFromContainer } from "./types";

/**
 * An assistant designed to manage a single field or a simple
 * piece of data within a larger form or model.
 *
 * @extends FormCompletionAssistant {@link FormCompletionAssistant link}
 */
export class FormFieldCompletionAssistant<Model, ContainerModel> extends FormCompletionAssistant<
  Model,
  ContainerModel
> {
  protected model!: Model;

  static handling<ContainerModel, Model extends string = string>(
    assertionId: AssertionId,
    fromContainerModelGetter: ModelFromContainer<Model, ContainerModel>,
    initialModel = ""
  ) {
    return this.handlingAll([assertionId], fromContainerModelGetter, initialModel);
  }

  static handlingAll<ContainerModel, Model extends string = string>(
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
