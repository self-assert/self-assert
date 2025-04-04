import { Assertion } from "@/Assertion/Assertion";
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
}
