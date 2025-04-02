import { FormFieldCompletionAssistant } from "./FormFieldCompletionAssistant";
import { FormSectionCompletionAssistant } from "./FormSectionCompletionAssistant";
import { Assertion, AssertionId } from "../Assertion/Assertion";
import { AssertionsRunner } from "../Assertion/AssertionsRunner";

/**
 * @todo complete and refactor
 */
export class DateFieldCompletionAssistant extends FormSectionCompletionAssistant<Date, [string]> {
  static for(assertionId: AssertionId, fromContainerModelGetter) {
    const assertionIds = assertionId === "" ? [] : [assertionId];

    return this.with(
      [this.createDateAssistant()],
      (dateAsString) => this.createDate(assertionId, dateAsString),
      fromContainerModelGetter,
      assertionIds
    );
  }

  static createDate(assertionId: AssertionId, dateAsString: string) {
    AssertionsRunner.assert(this.createAssertionFor(assertionId, dateAsString));

    return new Date(dateAsString);
  }

  static createDateAssistant() {
    // @ts-expect-error MUST FIX
    return FormFieldCompletionAssistant.handling("", (date) => date.toLocaleDateString());
  }

  static createAssertionFor(assertionId: AssertionId, dateAsString: string) {
    return Assertion.for(dateAsString, assertionId, () => dateAsString !== "", "Invalid date");
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
