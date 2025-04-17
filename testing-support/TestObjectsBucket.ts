import { Assertion, AssertionId } from "@/assertion";
import { SectionDraftAssistant, FieldDraftAssistant } from "@/draft-assistant";
import { ModelWithNoAssertions, SelfAssertingModel } from "./TestModels";

import type { ModelFromContainer } from "@/types";

interface GenericContainer {
  getModel(): string;
}

export class TestObjectsBucket {
  static defaultHoldingAssertionAID = "holdsAID";
  static defaultHoldingAssertionDescription = "Should hold";
  static defaultFailingAssertionAID = "failsAID";
  static defaultFailingAssertionDescription = "Should fail";

  static holdingAssertion() {
    return Assertion.identifiedAs(this.defaultHoldingAssertionAID, this.defaultHoldingAssertionDescription);
  }

  static defaultFailingAssertion() {
    return this.failingAssertion(this.defaultFailingAssertionAID, this.defaultFailingAssertionDescription);
  }

  static failingAssertion(assertionId: string, description: string) {
    return Assertion.for(assertionId, description, () => false);
  }

  static genericContainerForString(): ModelFromContainer<string, GenericContainer> {
    return (c) => c.getModel();
  }

  protected static createNameAssistant() {
    return FieldDraftAssistant.handlingAll<ModelWithNoAssertions>([SelfAssertingModel.nameNotEmptyAID], (model) =>
      model.getName()
    );
  }

  static createModelWithNoAssertionsAssistant(assertionIds: AssertionId[] = []) {
    const nameAssistant = this.createNameAssistant();
    const assistant = SectionDraftAssistant.topLevelContainerWith<ModelWithNoAssertions, [string]>(
      [nameAssistant],
      (name) => new ModelWithNoAssertions(name),
      assertionIds
    );

    return Object.assign(assistant, { nameAssistant });
  }

  static createSelfAssertingModelAssistant(assertionIds: AssertionId[] = []) {
    const nameAssistant = this.createNameAssistant();
    const assistant = SectionDraftAssistant.topLevelContainerWith<SelfAssertingModel, [string]>(
      [nameAssistant],
      (name) => SelfAssertingModel.named(name),
      assertionIds
    );
    return Object.assign(assistant, { nameAssistant });
  }
}
