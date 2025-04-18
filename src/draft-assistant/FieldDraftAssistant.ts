import { DraftAssistant } from "./DraftAssistant";

import type { ModelFromContainer } from "../types";
import { Assertion, AssertionId, LabeledAssertion, SelfContainedAssertion } from "@/assertion";

/**
 * An assistant designed to manage a single field or a simple
 * piece of data within a larger form or model.
 *
 * @extends DraftAssistant {@link DraftAssistant link}
 */
export class FieldDraftAssistant<ContainerModel, Model extends string = string> extends DraftAssistant<
  Model,
  ContainerModel
> {
  static handling<ContainerModel, Model extends string = string>(
    assertionId: AssertionId,
    modelFromContainer: ModelFromContainer<Model, ContainerModel>,
    initialModel = ""
  ) {
    return this.handlingAll([assertionId], modelFromContainer, initialModel);
  }

  static handlingAll<ContainerModel, Model extends string = string>(
    assertionIds: AssertionId[],
    modelFromContainer: ModelFromContainer<Model, ContainerModel>,
    initialModel = ""
  ) {
    return this.requiringAll(
      assertionIds.map((id) => Assertion.labeled(id, "(placeholder)")),
      modelFromContainer,
      initialModel
    );
  }

  static requiring<ContainerModel, Model extends string = string>(
    assertion: Assertion<Model> | SelfContainedAssertion,
    modelFromContainer: ModelFromContainer<Model, ContainerModel>,
    initialModel = ""
  ) {
    return this.requiringAll<ContainerModel, Model>([assertion], modelFromContainer, initialModel);
  }

  static requiringAll<ContainerModel, Model extends string = string>(
    assertions: (Assertion<Model> | SelfContainedAssertion)[],
    modelFromContainer: ModelFromContainer<Model, ContainerModel>,
    initialModel = ""
  ) {
    return new this<ContainerModel, Model>(assertions, modelFromContainer, initialModel as Model);
  }

  protected constructor(
    protected assertions: (Assertion<Model> | SelfContainedAssertion)[],
    modelFromContainer: ModelFromContainer<Model, ContainerModel>,
    initialModel: Model
  ) {
    const ids = assertions.map((assertion) => assertion.getId());
    super(ids, modelFromContainer, initialModel);
  }

  createModel() {
    this.removeFailedAssertions();
    return this.model;
  }

  /**
   * Checks if the current draft verifies all assertions.
   * If not, it adds them to the list of failed assertions.
   */
  review() {
    this.removeFailedAssertions();
    const failures: LabeledAssertion[] = [];
    this.assertions.forEach((assertion) => {
      assertion.collectFailureInto(failures, this.model);
    });

    this.addFailedAssertions(failures);
  }
}
