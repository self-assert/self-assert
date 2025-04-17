import { FormCompletionAssistant } from "./FormCompletionAssistant";

import type { ModelFromContainer } from "../types";
import type { AssertionId } from "@/assertion";

/**
 * An assistant designed to manage a single field or a simple
 * piece of data within a larger form or model.
 *
 * @extends FormCompletionAssistant {@link FormCompletionAssistant link}
 */
export class FormFieldCompletionAssistant<
  ContainerModel,
  Model extends string = string
> extends FormCompletionAssistant<Model, ContainerModel> {
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

  createModel() {
    this.removeFailedAssertions();
    return this.model;
  }
}
