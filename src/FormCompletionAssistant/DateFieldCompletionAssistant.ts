import { FormFieldCompletionAssistant } from "./FormFieldCompletionAssistant";
import { FormSectionCompletionAssistant } from "./FormSectionCompletionAssistant";
import { Assertion, AssertionId, AssertionsRunner } from "@/assertion";
import type { ModelFromContainer } from "../types";

/**
 * Assists in the completion of a date field in format `YYYY-MM-DD`.
 *
 * @remarks
 * This class is not recommended for use in production, it is
 * mainly intended for testing and showcase purposes.
 *
 * The `Date` object is considered a legacy feature.
 * It is recommended to use the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal Temporal} API
 * for new projects by MDN.
 */
export class DateFieldCompletionAssistant<ContainerModel> extends FormSectionCompletionAssistant<
  Date,
  ContainerModel,
  [string]
> {
  static readonly defaultAssertionDescription = "Invalid date";

  static for<ContainerModel>(
    assertionId: AssertionId,
    fromContainerModelGetter: ModelFromContainer<Date, ContainerModel>
  ): DateFieldCompletionAssistant<ContainerModel> {
    const assertionIds = assertionId === "" ? [] : [assertionId];

    /** @ts-expect-error @see {@link https://github.com/microsoft/TypeScript/issues/5863 #5863} */
    return this.with(
      [this.createDateAssistant()],
      (dateAsString) => this.createDate(assertionId, dateAsString),
      fromContainerModelGetter,
      assertionIds
    );
  }

  static forTopLevel(assertionId: AssertionId) {
    return this.for(assertionId, this.topLevelContainerModelGetter());
  }

  static createDate(assertionId: AssertionId, dateAsString: string) {
    AssertionsRunner.assert(this.createAssertionFor(assertionId, dateAsString));

    return new Date(dateAsString);
  }

  static createDateAssistant() {
    return FormFieldCompletionAssistant.handling<Date>("", (date) => date.toISOString().substring(0, 10));
  }

  static createAssertionFor(assertionId: AssertionId, dateAsString: string) {
    return Assertion.for(
      assertionId,
      DateFieldCompletionAssistant.defaultAssertionDescription,
      () => /^\d{4}-\d{2}-\d{2}$/.test(dateAsString) && !isNaN(new Date(dateAsString).getTime())
    );
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
