import { describe, expect, it } from "@jest/globals";
import { DateDraftAssistant } from "./DateDraftAssistant";
import { DraftAssistant } from "./DraftAssistant";

describe("DateDraftAssistant", () => {
  it("should handle ISO dates", (done) => {
    const assistant = DateDraftAssistant.forTopLevel("");

    assistant.setInnerModel("2020-01-01");

    assistant.withCreatedModelDo(
      (model) => {
        expect(assistant.getInnerModel()).toBe("2020-01-01");
        expect(model).toBeInstanceOf(Date);
        expect(model.toISOString().startsWith("2020-01-01")).toBe(true);
        done();
      },
      () => done("Should not be invalid")
    );
  });

  it("should be invalid if the inner model does not have a valid ISO format", (done) => {
    const assertionId = "ISODateAID";
    const assistant = DateDraftAssistant.forTopLevel(assertionId);

    assistant.setInnerModel("01/01/2020");

    assistant.withCreatedModelDo(
      () => done("Should be invalid"),
      () => {
        expect(DraftAssistant.isInvalidModel(assistant.getModel())).toBe(true);
        expect(assistant.hasOnlyOneAssertionFailedIdentifiedAs(assertionId)).toBe(true);
        expect(assistant.failedAssertionsDescriptions()).toEqual([DateDraftAssistant.defaultAssertionDescription]);
        done();
      }
    );
  });

  it("should be invalid if the inner model has a valid format but is not an ISO date", (done) => {
    const assertionId = "ISODateAID";
    const assistant = DateDraftAssistant.forTopLevel(assertionId);

    assistant.setInnerModel("2020-13-01");

    assistant.withCreatedModelDo(
      () => done("Should be invalid"),
      () => {
        expect(DraftAssistant.isInvalidModel(assistant.getModel())).toBe(true);
        expect(assistant.hasOnlyOneAssertionFailedIdentifiedAs(assertionId)).toBe(true);
        expect(assistant.failedAssertionsDescriptions()).toEqual([DateDraftAssistant.defaultAssertionDescription]);
        done();
      }
    );
  });

  describe("inner assistant", () => {
    it("should allow setting its value from an ISO date", () => {
      const assistant = DateDraftAssistant.forTopLevel("");

      assistant.innerAssistant().setModelFrom(new Date(2020, 0, 1));

      expect(assistant.getInnerModel()).toBe("2020-01-01");
    });
  });
});
