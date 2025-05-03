import {
  FieldDraftAssistant,
  SectionDraftAssistant,
  Assertion,
  LabelId,
  type ModelFromContainer,
} from "self-assert";

export class DateDraftAssistant<
  ContainerModel = any
> extends SectionDraftAssistant<Date, ContainerModel, [string]> {
  static readonly defaultAssertionDescription = "Invalid date";

  static for<ContainerModel = any>(
    assertionId: LabelId,
    modelFromContainer: ModelFromContainer<Date, ContainerModel>
  ): DateDraftAssistant<ContainerModel> {
    const assertionIds = assertionId === "" ? [] : [assertionId];

    /** @ts-expect-error /microsoft/TypeScript#5863 */
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
    return FieldDraftAssistant.handling<Date>("", (date) =>
      date.toISOString().substring(0, 10)
    );
  }

  static createAssertionFor(assertionId: LabelId, dateAsString: string) {
    return Assertion.requiring(
      assertionId,
      DateDraftAssistant.defaultAssertionDescription,
      () =>
        /^\d{4}-\d{2}-\d{2}$/.test(dateAsString) &&
        !isNaN(new Date(dateAsString).getTime())
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
