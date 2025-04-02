import { Assertion, AssertionId } from "../Assertion/Assertion";
import { AssertionsRunner } from "../Assertion/AssertionsRunner";
import { ModelFromContainer } from "./FormCompletionAssistant";

import { FormFieldCompletionAssistant } from "./FormFieldCompletionAssistant";
import { FormSectionCompletionAssistant } from "./FormSectionCompletionAssistant";

export class IntegerFieldCompletionAssistant<ContainerModel = never> extends FormSectionCompletionAssistant<
  number,
  ContainerModel,
  [string]
> {
  static for<ContainerModel>(
    assertionId: AssertionId,
    fromContainerModelGetter: ModelFromContainer<number, ContainerModel>
  ) {
    const assertionIds = assertionId === "" ? [] : [assertionId];

    return this.with(
      [this.createNumberAssistant()],
      (numberAsString) => this.createInteger(assertionId, numberAsString),
      fromContainerModelGetter,
      assertionIds
    );
  }

  static createInteger(assertionId: AssertionId, numberAsString: string) {
    AssertionsRunner.assert(this.createAssertionFor(assertionId, numberAsString));

    return Number(numberAsString);
  }

  static createNumberAssistant() {
    return FormFieldCompletionAssistant.handling<string, number>("", (number) => number.toString());
  }

  static createAssertionFor(assertionId: AssertionId, numberAsString: string) {
    return Assertion.for(numberAsString, assertionId, () => /^[-+]?(\d+)$/.test(numberAsString), "Invalid integer");
  }

  innerAssistant() {
    return this.assistants[0];
  }

  setInnerModel(newModel: string) {
    this.innerAssistant().setModel(newModel);
  }

  getInnerModel() {
    return this.innerAssistant().getModel();
  }
}
