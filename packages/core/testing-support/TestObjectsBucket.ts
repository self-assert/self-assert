import { ModelWithNoAssertions, SelfAssertingModel } from "./TestModels";

import { Assertion, LabelId } from "../src/rule";
import {
  SectionDraftAssistant,
  FieldDraftAssistant,
} from "../src/draft-assistant";
import { Requirements } from "../src/rule-requirements";
import type { ModelFromContainer } from "../src/types";

interface GenericContainer {
  getModel(): string;
}

export class TestObjectsBucket {
  static defaultHoldingAssertionAID = "holdsAID";
  static defaultHoldingAssertionDescription = "Should hold";
  static defaultFailingAssertionAID = "failsAID";
  static defaultFailingAssertionDescription = "Should fail";

  static holdingAssertion() {
    return Assertion.labeled(
      this.defaultHoldingAssertionAID,
      this.defaultHoldingAssertionDescription
    );
  }

  static defaultFailingAssertion() {
    return this.failingAssertion(
      this.defaultFailingAssertionAID,
      this.defaultFailingAssertionDescription
    );
  }

  static failingAssertion(assertionId: string, description: string) {
    return Assertion.requiring(assertionId, description, Requirements.fail);
  }

  static genericContainerForString(): ModelFromContainer<
    string,
    GenericContainer
  > {
    return (c) => c.getModel();
  }

  static createNameAssistant() {
    return FieldDraftAssistant.handlingAll<ModelWithNoAssertions>(
      [SelfAssertingModel.nameNotEmptyAID],
      (model) => model.getName()
    );
  }

  static createModelWithNoAssertionsAssistant(assertionIds: LabelId[] = []) {
    const nameAssistant = this.createNameAssistant();
    const assistant = SectionDraftAssistant.topLevelContainerWith<
      ModelWithNoAssertions,
      [string]
    >([nameAssistant], (name) => new ModelWithNoAssertions(name), assertionIds);

    return Object.assign(assistant, { nameAssistant });
  }

  static createSelfAssertingModelAssistant(assertionIds: LabelId[] = []) {
    const nameAssistant = this.createNameAssistant();
    const assistant = SectionDraftAssistant.topLevelContainerWith<
      SelfAssertingModel,
      [string]
    >([nameAssistant], (name) => SelfAssertingModel.named(name), assertionIds);
    return Object.assign(assistant, { nameAssistant });
  }
}
