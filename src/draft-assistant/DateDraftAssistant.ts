import { FieldDraftAssistant } from "./FieldDraftAssistant";
import { SectionDraftAssistant } from "./SectionDraftAssistant";
import { Assertion, LabelId } from "../rule";
import type { ModelFromContainer } from "../types";

/**
 * Assists in the completion of a date field in format `YYYY-MM-DD`.
 *
 * @remarks
 * This class is **not** recommended for use in production, it is
 * mainly intended for testing and showcase purposes.
 *
 * The `Date` object is considered a legacy feature.
 * It is recommended to use the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal Temporal} API
 * for new projects by MDN.
 *
 * @category Draft assistants
 */
export class DateDraftAssistant<ContainerModel = any> extends SectionDraftAssistant<Date, ContainerModel, [string]> {
  static readonly defaultAssertionDescription = "Invalid date";

  static for<ContainerModel = any>(
    assertionId: LabelId,
    modelFromContainer: ModelFromContainer<Date, ContainerModel>
  ): DateDraftAssistant<ContainerModel> {
    const assertionIds = assertionId === "" ? [] : [assertionId];

    /** @ts-expect-error @see {@link https://github.com/microsoft/TypeScript/issues/5863 #5863} */
    return this.with(
      [this.createDateAssistant()],
      (dateAsString) => this.createDate(assertionId, dateAsString),
      modelFromContainer,
      assertionIds
    );
  }

  static forTopLevel(assertionId: LabelId) {
    return this.for(assertionId, this.topLevelModelFromContainer());
  }

  static createDate(assertionId: LabelId, dateAsString: string) {
    this.createAssertionFor(assertionId, dateAsString).mustHold();

    return new Date(dateAsString);
  }

  static createDateAssistant() {
    return FieldDraftAssistant.handling<Date>("", (date) => date.toISOString().substring(0, 10));
  }

  static createAssertionFor(assertionId: LabelId, dateAsString: string) {
    return Assertion.requiring(
      assertionId,
      DateDraftAssistant.defaultAssertionDescription,
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
