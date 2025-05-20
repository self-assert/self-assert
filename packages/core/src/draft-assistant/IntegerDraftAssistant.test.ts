import { describe, it, expect } from "@jest/globals";
import { IntegerDraftAssistant } from "./IntegerDraftAssistant";
import { DraftAssistant } from "./DraftAssistant";

describe(IntegerDraftAssistant.name, () => {
  it("should allow non-negative integers as strings", (done) => {
    const assistant = IntegerDraftAssistant.forTopLevel("");
    assistant.setInnerModel("0");

    assistant.withCreatedModelDo(
      (model) => {
        expect(assistant.getInnerModel()).toBe("0");
        expect(model).toBe(0);
        done();
      },
      () => done("Should not be invalid")
    );
  });

  it("should allow negative integers as strings", (done) => {
    const assistant = IntegerDraftAssistant.forTopLevel("");
    assistant.setInnerModel("-1");

    assistant.withCreatedModelDo(
      (model) => {
        expect(assistant.getInnerModel()).toBe("-1");
        expect(model).toBe(-1);
        done();
      },
      () => done("Should not be invalid")
    );
  });

  it("should allow positive integers with explicit sign as strings", (done) => {
    const assistant = IntegerDraftAssistant.forTopLevel("");
    assistant.setInnerModel("+1");

    assistant.withCreatedModelDo(
      (model) => {
        expect(assistant.getInnerModel()).toBe("+1");
        expect(model).toBe(1);
        done();
      },
      () => done("Should not be invalid")
    );
  });

  it("should be invalid if the inner model is empty", (done) => {
    const assertionId = "emptyStringAssertionAID";
    const assistant = IntegerDraftAssistant.forTopLevel(assertionId);
    assistant.setInnerModel("");

    assistant.withCreatedModelDo(
      () => done("Should be invalid"),
      () => {
        expect(DraftAssistant.isInvalidModel(assistant.getModel())).toBe(true);
        expect(assistant.hasOnlyOneRuleBrokenIdentifiedAs(assertionId)).toBe(
          true
        );
        done();
      }
    );
  });

  it("should be invalid if the inner model is not a number", (done) => {
    const assertionId = "notANumberAssertionAID";
    const assistant = IntegerDraftAssistant.forTopLevel(assertionId);
    assistant.setInnerModel("not a number");

    assistant.withCreatedModelDo(
      () => done("Should be invalid"),
      () => {
        expect(DraftAssistant.isInvalidModel(assistant.getModel())).toBe(true);
        expect(assistant.hasOnlyOneRuleBrokenIdentifiedAs(assertionId)).toBe(
          true
        );
        done();
      }
    );
  });

  it("should be invalid if the inner model is not an integer", (done) => {
    const assertionId = "notAnIntegerAssertionAID";
    const assistant = IntegerDraftAssistant.forTopLevel(assertionId);
    assistant.setInnerModel("0.1");

    assistant.withCreatedModelDo(
      () => done("Should be invalid"),
      () => {
        expect(DraftAssistant.isInvalidModel(assistant.getModel())).toBe(true);
        expect(assistant.hasOnlyOneRuleBrokenIdentifiedAs(assertionId)).toBe(
          true
        );
        done();
      }
    );
  });

  describe("inner assistant", () => {
    it("should allow setting its value from an integer", (done) => {
      const assistant = IntegerDraftAssistant.forTopLevel("");

      assistant.innerAssistant().setModelFrom(1);

      assistant.withCreatedModelDo(
        (model) => {
          expect(assistant.getInnerModel()).toBe("1");
          expect(model).toBe(1);
          done();
        },
        () => done("Should not be invalid")
      );
    });
  });
});
