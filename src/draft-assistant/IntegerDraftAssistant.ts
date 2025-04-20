import { Assertion, Ruleset, AssertionId } from "@/assertion";
import { FieldDraftAssistant } from "./FieldDraftAssistant";
import { SectionDraftAssistant } from "./SectionDraftAssistant";

import type { ModelFromContainer } from "../types";

/**
 * Provides an assistant for the completion of an integer field,
 * represented by a string.
 */
export class IntegerDraftAssistant<ContainerModel> extends SectionDraftAssistant<number, ContainerModel, [string]> {
  static readonly defaultAssertionDescription = "Invalid integer";

  static for<ContainerModel>(
    assertionId: AssertionId,
    modelFromContainer: ModelFromContainer<number, ContainerModel>
  ): IntegerDraftAssistant<ContainerModel> {
    const assertionIds = assertionId === "" ? [] : [assertionId];

    /** @ts-expect-error @see {@link https://github.com/microsoft/TypeScript/issues/5863 #5863} */
    return this.with(
      [this.createNumberAssistant()],
      (numberAsString) => this.createInteger(assertionId, numberAsString),
      modelFromContainer,
      assertionIds
    );
  }

  static forTopLevel(assertionId: AssertionId) {
    return this.for(assertionId, this.topLevelModelFromContainer());
  }

  static createInteger(assertionId: AssertionId, numberAsString: string) {
    Ruleset.assert(this.createAssertionFor(assertionId, numberAsString));

    return Number(numberAsString);
  }

  static createNumberAssistant() {
    return FieldDraftAssistant.handling<number>("", (number) => number.toString());
  }

  static createAssertionFor(assertionId: AssertionId, numberAsString: string) {
    return Assertion.requiring(assertionId, this.defaultAssertionDescription, () =>
      /^[-+]?(\d+)$/.test(numberAsString)
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
