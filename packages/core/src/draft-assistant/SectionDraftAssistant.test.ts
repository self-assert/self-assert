import { describe, expect, it } from "@jest/globals";
import { SectionDraftAssistant } from "./SectionDraftAssistant";
import { FieldDraftAssistant } from "./FieldDraftAssistant";
import { DraftAssistant } from "./DraftAssistant";
import { Assertion, Ruleset } from "../rule";

import { TestObjectsBucket } from "@testing-support/TestObjectsBucket";
import {
  ModelWithNoAssertions,
  SelfAssertingModel,
} from "@testing-support/TestModels";
import { expectToBeRulesBroken } from "@testing-support/jest.setup";

const systemAID = "systemVerifiedAID";
const system = {
  add(model: SelfAssertingModel) {
    const failingAssertion = Assertion.requiring(
      systemAID,
      "This assertion should be handled by the assistant",
      () => model === SelfAssertingModel.named("Pedro")
    );

    Ruleset.ensureAll(failingAssertion);
  },
  doSomethingThatFails() {
    throw new Error("Not implemented");
  },
};

describe(SectionDraftAssistant.name, () => {
  it("should be created invalid with no failed assertions", () => {
    const assistant = TestObjectsBucket.createModelWithNoAssertionsAssistant();

    expect(DraftAssistant.isInvalidModel(assistant.getModel())).toBe(true);
    expect(assistant.hasBrokenRules()).toBe(false);
    expect(assistant.doesNotHaveBrokenRules()).toBe(true);
    expect(assistant.handles(Assertion.labeled("AID.1", "Description 1"))).toBe(
      false
    );
    expect(assistant.brokenRulesDescriptions()).toEqual([]);
  });

  it("should handle an assertion identified with a stored id", () => {
    const assistant = TestObjectsBucket.createModelWithNoAssertionsAssistant([
      TestObjectsBucket.defaultFailingAssertionAID,
    ]);

    expect(assistant.handles(TestObjectsBucket.defaultFailingAssertion())).toBe(
      true
    );
  });

  it("should accept assertion ids", () => {
    const assistant = TestObjectsBucket.createModelWithNoAssertionsAssistant();
    const anAssertion = TestObjectsBucket.defaultFailingAssertion();
    const anotherAssertion = TestObjectsBucket.failingAssertion("AID.2", "");

    assistant.addLabelId(anAssertion.getId());
    assistant.addLabelId(anotherAssertion.getId());

    expect(assistant.handles(anAssertion)).toBe(true);
    expect(assistant.handles(anotherAssertion)).toBe(true);
  });

  it("should accept failed assertions", () => {
    const assistant = TestObjectsBucket.createModelWithNoAssertionsAssistant();

    assistant.addBrokenRule(TestObjectsBucket.defaultFailingAssertion());

    expect(
      assistant.hasOnlyOneRuleBrokenIdentifiedAs(
        TestObjectsBucket.defaultFailingAssertionAID
      )
    ).toBe(true);
    expect(assistant.hasBrokenRules()).toBe(true);
    expect(assistant.doesNotHaveBrokenRules()).toBe(false);
    expect(assistant.brokenRulesDescriptions()).toEqual([
      TestObjectsBucket.defaultFailingAssertionDescription,
    ]);
  });

  it("should fail if trying to set from a container when is top level", () => {
    const assistant = SectionDraftAssistant.topLevelContainerWith<
      { name: string },
      [string]
    >(
      [FieldDraftAssistant.handling("AID.1", ({ name }) => name, "")],
      (name) => ({ name })
    );

    expect(() => {
      assistant.setModelFrom(null as never);
    }).toThrow("No container to get model from");
  });

  it("should allow setting its model", () => {
    const assistant = TestObjectsBucket.createModelWithNoAssertionsAssistant();

    assistant.setModel(new ModelWithNoAssertions("Test"));

    const model = assistant.getModel();
    expect(DraftAssistant.isInvalidModel(model)).toBe(false);
    expect(model).toBeInstanceOf(ModelWithNoAssertions);
    expect(model.isNamed("Test")).toBe(true);
    expect(assistant.nameAssistant.getModel()).toBe("Test");
  });

  it("should be able to create its model from its composed assistants", (done) => {
    const assistant = TestObjectsBucket.createModelWithNoAssertionsAssistant();

    assistant.nameAssistant.setModel("Pedro");

    assistant.withCreatedModelDo(
      (model) => {
        expect(model).toBeInstanceOf(ModelWithNoAssertions);
        expect(model.isNamed("Pedro")).toBe(true);
        done();
      },
      () => done("Should not have failed")
    );
  });

  it("should fail creating its model if its composed assistants fail", (done) => {
    const assistant = TestObjectsBucket.createSelfAssertingModelAssistant();
    const nameAssistant = assistant.nameAssistant;
    nameAssistant.setModel("");

    assistant.withCreatedModelDo(
      () => {
        done("Should be invalid");
      },
      () => {
        expect(assistant.hasBrokenRules()).toBe(false);
        expect(nameAssistant.hasBrokenRules()).toBe(true);
        expect(
          nameAssistant.hasOnlyOneRuleBrokenIdentifiedAs(
            SelfAssertingModel.nameNotEmptyAID
          )
        ).toBe(true);
        done();
      }
    );
  });

  it("should handle its own failed assertions", (done) => {
    const assistant = TestObjectsBucket.createSelfAssertingModelAssistant([
      systemAID,
    ]);
    assistant.nameAssistant.setModel("Pedro");

    assistant.withCreatedModelDo(
      (model) => {
        try {
          system.add(model);
          done("Should have thrown");
        } catch (error) {
          expectToBeRulesBroken(error);
          assistant.handleError(error);
          expect(assistant.hasBrokenRules()).toBe(true);
          expect(assistant.hasOnlyOneRuleBrokenIdentifiedAs(systemAID)).toBe(
            true
          );
          done();
        }
      },
      () =>
        done(
          "Should not be invalid, the system should have failed, the model should be valid"
        )
    );
  });

  it("should handle failed assertions if none of its composed assistants handles them", (done) => {
    const assistant = TestObjectsBucket.createSelfAssertingModelAssistant();
    assistant.nameAssistant.setModel("Pedro");

    assistant.withCreatedModelDo(
      (model) => {
        try {
          system.add(model);
          done("Should have thrown");
        } catch (error) {
          expectToBeRulesBroken(error);
          assistant.handleError(error);
          expect(assistant.hasBrokenRules()).toBe(true);
          expect(assistant.hasOnlyOneRuleBrokenIdentifiedAs(systemAID)).toBe(
            true
          );
          done();
        }
      },
      () => done("Should not be invalid model")
    );
  });

  it("should not handle other types of errors", (done) => {
    const assistant = TestObjectsBucket.createSelfAssertingModelAssistant();
    const nameAssistant = assistant.nameAssistant;
    nameAssistant.setModel("Pedro");

    assistant.withCreatedModelDo(
      () => {
        try {
          system.doSomethingThatFails();
          done("Should have thrown");
        } catch (error) {
          expect(() => assistant.handleError(error)).toThrow(error);
          done();
        }
      },
      () => done("Should not be invalid model")
    );
  });

  it("should be able to reset its model", () => {
    const assistant = TestObjectsBucket.createSelfAssertingModelAssistant();
    assistant.nameAssistant.setModel("Pedro");
    assistant.createModel();

    assistant.resetModel();

    expect(assistant.getModel()).toBe(DraftAssistant.INVALID_MODEL);
  });

  it("should reset its composed assistants when resetting its model", () => {
    const assistant = TestObjectsBucket.createSelfAssertingModelAssistant();
    assistant.nameAssistant.setModel("Pedro");
    assistant.createModel();

    assistant.resetModel();

    expect(assistant.nameAssistant.getModel()).toBe("");
  });

  describe("Viewers", () => {
    it("should reflect changes when the model is created", (done) => {
      const assistant = TestObjectsBucket.createSelfAssertingModelAssistant();

      let image: SelfAssertingModel | typeof DraftAssistant.INVALID_MODEL =
        new Object();
      assistant.accept({ onDraftChanged: (model) => (image = model) });

      assistant.nameAssistant.setModel("Pedro");

      assistant.withCreatedModelDo(
        () => {
          expect(image).toBeInstanceOf(SelfAssertingModel);
          expect((image as SelfAssertingModel).isNamed("Pedro")).toBe(true);
          done();
        },
        () => done("Should not have failed")
      );
    });

    it("should reflect an invalid image when creation fails", (done) => {
      const assistant = TestObjectsBucket.createSelfAssertingModelAssistant();

      let image: SelfAssertingModel | typeof DraftAssistant.INVALID_MODEL =
        new Object();
      assistant.accept({ onDraftChanged: (model) => (image = model) });

      assistant.nameAssistant.setModel(SelfAssertingModel.forbiddenName);

      assistant.withCreatedModelDo(
        () => {
          done("Should have failed");
        },
        () => {
          expect(image).toBe(DraftAssistant.INVALID_MODEL);
          done();
        }
      );
    });

    it("should reflect changes when the model is updated", () => {
      const assistant = TestObjectsBucket.createSelfAssertingModelAssistant();

      let image: SelfAssertingModel | typeof DraftAssistant.INVALID_MODEL =
        new Object();
      assistant.accept({ onDraftChanged: (model) => (image = model) });

      const model = SelfAssertingModel.named("Pedro");
      assistant.setModel(model);

      expect(image).toBe(model);
    });
  });
});
