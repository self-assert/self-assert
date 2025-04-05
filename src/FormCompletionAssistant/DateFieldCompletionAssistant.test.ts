import { describe, expect, it } from "@jest/globals";
import { DateFieldCompletionAssistant } from "./DateFieldCompletionAssistant";
import { FormCompletionAssistant } from "./FormCompletionAssistant";

describe("DateFieldCompletionAssistant", () => {
  it("should handle ISO dates", (done) => {
    const assistant = DateFieldCompletionAssistant.forTopLevel("");

    assistant.setInnerModel("2020-01-01");

    assistant.withCreatedModelDo(
      (model) => {
        expect(model).toBeInstanceOf(Date);
        expect(model.toISOString().startsWith("2020-01-01")).toBe(true);
        done();
      },
      () => done("Should not be invalid")
    );
  });

  it("should be invalid if the inner model is not an ISO date", (done) => {
    const assertionId = "ISODateAID";
    const assistant = DateFieldCompletionAssistant.forTopLevel(assertionId);

    assistant.setInnerModel("01/01/2020");

    assistant.withCreatedModelDo(
      () => done("Should be invalid"),
      () => {
        expect(FormCompletionAssistant.isInvalidModel(assistant.getModel())).toBe(true);
        expect(assistant.hasOnlyOneAssertionFailedIdentifiedAs(assertionId)).toBe(true);
        expect(assistant.failedAssertionsDescriptions()).toEqual([
          DateFieldCompletionAssistant.defaultAssertionDescription,
        ]);
        done();
      }
    );
  });
});
