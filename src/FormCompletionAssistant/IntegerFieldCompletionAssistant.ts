import { Assertion, AssertionId } from "../Assertion/Assertion";
import { AssertionsRunner } from "../Assertion/AssertionsRunner";

import { FormFieldCompletionAssistant } from "./FormFieldCompletionAssistant";
import { FormSectionCompletionAssistant } from "./FormSectionCompletionAssistant";

export class IntegerFieldCompletionAssistant extends FormSectionCompletionAssistant {
  static for(assertionId: AssertionId, fromContainerModelGetter) {
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
    // @ts-expect-error MUST FIX
    return FormFieldCompletionAssistant.handling("", (number) => number.toString());
  }

  static createAssertionFor(assertionId: AssertionId, numberAsString: string) {
    return Assertion.for(
      numberAsString,
      assertionId,
      () => /^[-+]?(\d+)$/.test(numberAsString),
      "Invalid integer"
    );
  }

  innerAssistant() {
    return this.assistants[0];
  }

  setInnerModel(newModel) {
    this.innerAssistant().setModel(newModel);
  }

  getInnerModel() {
    return this.innerAssistant().getModel();
  }
}
