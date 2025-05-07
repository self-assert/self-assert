import { DraftAssistant } from "./DraftAssistant";

import type { ModelFromContainer } from "../types";
import { Assertion, LabelId, LabeledRule, CollectableRule } from "../rule";

/**
 * An assistant designed to manage a single field or a simple
 * piece of data within a larger form or model.
 *
 * @category Draft assistants
 */
export class FieldDraftAssistant<ContainerModel = any, Model extends string = string> extends DraftAssistant<
  Model,
  ContainerModel
> {
  static handling<ContainerModel = any, Model extends string = string>(
    assertionId: LabelId,
    modelFromContainer: ModelFromContainer<Model, ContainerModel>,
    initialModel = ""
  ) {
    return this.handlingAll([assertionId], modelFromContainer, initialModel);
  }

  static handlingAll<ContainerModel = any, Model extends string = string>(
    assertionIds: LabelId[],
    modelFromContainer: ModelFromContainer<Model, ContainerModel>,
    initialModel = ""
  ) {
    return this.requiringAll(
      assertionIds.map((id) => Assertion.labeled(id, "(placeholder)")),
      modelFromContainer,
      initialModel
    );
  }

  static requiring<ContainerModel = any, Model extends string = string>(
    assertion: CollectableRule<Model | void, void>,
    modelFromContainer: ModelFromContainer<Model, ContainerModel>,
    initialModel = ""
  ) {
    return this.requiringAll<ContainerModel, Model>([assertion], modelFromContainer, initialModel);
  }

  static requiringAll<ContainerModel = any, Model extends string = string>(
    assertions: CollectableRule<Model | void, void>[],
    modelFromContainer: ModelFromContainer<Model, ContainerModel>,
    initialModel = ""
  ) {
    return new this<ContainerModel, Model>(assertions, modelFromContainer, initialModel as Model);
  }

  protected constructor(
    protected assertions: CollectableRule<Model, void>[],
    modelFromContainer: ModelFromContainer<Model, ContainerModel>,
    initialModel: Model
  ) {
    const ids = assertions.map((assertion) => assertion.getId());
    super(ids, modelFromContainer, initialModel);
  }

  createModel() {
    this.removeBrokenRules();
    return this.model;
  }

  /**
   * Checks if the current draft verifies all assertions.
   * If not, it adds them to the list of failed assertions.
   */
  review() {
    this.removeBrokenRules();
    const failures: LabeledRule[] = [];
    this.assertions.forEach((assertion) => {
      assertion.collectFailureInto(failures, this.model);
    });

    this.addBrokenRules(failures);
  }
}
