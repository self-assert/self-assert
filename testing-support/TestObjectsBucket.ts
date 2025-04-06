import { Assertion, AssertionId } from "@/Assertion/Assertion";
import { FormFieldCompletionAssistant } from "@/FormCompletionAssistant/FormFieldCompletionAssistant";
import { FormSectionCompletionAssistant } from "@/FormCompletionAssistant/FormSectionCompletionAssistant";
import { ModelWithNoAssertions, SelfAssertingModel } from "./TestModels";

import type { ModelFromContainer } from "@/FormCompletionAssistant/types";

const genericContainer = {
  getModel(): string {
    return "Model";
  },
};

export class TestObjectsBucket {
  static defaultHoldingAssertionAID = "holdsAID";
  static defaultHoldingAssertionDescription = "Should hold";
  static defaultFailingAssertionAID = "failsAID";
  static defaultFailingAssertionDescription = "Should fail";

  static holdingAssertion() {
    return Assertion.for(1, this.defaultHoldingAssertionAID, () => true, this.defaultHoldingAssertionDescription);
  }

  static defaultFailingAssertion() {
    return this.failingAssertion(this.defaultFailingAssertionAID, this.defaultFailingAssertionDescription);
  }

  static failingAssertion(assertionId: string, description: string) {
    return Assertion.for(2, assertionId, () => false, description);
  }

  static genericContainerForString(): ModelFromContainer<string, typeof genericContainer> {
    return (c) => c.getModel();
  }

  protected static createNameAssistant() {
    return FormFieldCompletionAssistant.handlingAll<ModelWithNoAssertions>(
      [SelfAssertingModel.nameNotEmptyAID],
      (model) => model.getName()
    );
  }

  static createModelWithNoAssertionsAssistant(assertionIds: AssertionId[] = []) {
    const nameAssistant = this.createNameAssistant();
    const assistant = FormSectionCompletionAssistant.topLevelContainerWith<ModelWithNoAssertions, [string]>(
      [nameAssistant],
      (name) => new ModelWithNoAssertions(name),
      assertionIds
    );

    return Object.assign(assistant, { nameAssistant });
  }

  static createSelfAssertingModelAssistant(assertionIds: AssertionId[] = []) {
    const nameAssistant = this.createNameAssistant();
    const assistant = FormSectionCompletionAssistant.topLevelContainerWith<SelfAssertingModel, [string]>(
      [nameAssistant],
      (name) => SelfAssertingModel.named(name),
      assertionIds
    );
    return Object.assign(assistant, { nameAssistant });
  }
}
