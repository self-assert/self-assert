import { describe, expect, it } from "@jest/globals";
import { FormSectionCompletionAssistant } from "./FormSectionCompletionAssistant";
import { FormFieldCompletionAssistant } from "./FormFieldCompletionAssistant";
import { FormCompletionAssistant } from "./FormCompletionAssistant";
import { TestObjectsBucket } from "@tests/TestObjectsBucket";
import { Assertion } from "@/Assertion/Assertion";
import { ModelWithNoAssertions, SelfAssertingModel } from "@tests/TestModels";

describe("FormSectionCompletionAssistant", () => {
  it("should be created invalid with no failed assertions", () => {
    const assistant = TestObjectsBucket.createModelWithNoAssertionsAssistant();

    expect(FormCompletionAssistant.isInvalidModel(assistant.getModel())).toBe(true);
    expect(assistant.hasFailedAssertions()).toBe(false);
    expect(assistant.doesNotHaveFailedAssertions()).toBe(true);
    expect(assistant.handles(Assertion.for(1, "AID.1", () => true, "Description 1"))).toBe(false);
    expect(assistant.failedAssertionsDescriptions()).toEqual([]);
  });

  it("should handle an assertion identified with a stored id", () => {
    const assistant = TestObjectsBucket.createModelWithNoAssertionsAssistant([
      TestObjectsBucket.defaultFailingAssertionAID,
    ]);

    expect(assistant.handles(TestObjectsBucket.defaultFailingAssertion())).toBe(true);
  });

  it("should accept assertion ids", () => {
    const assistant = TestObjectsBucket.createModelWithNoAssertionsAssistant();
    const anAssertion = TestObjectsBucket.defaultFailingAssertion();
    const anotherAssertion = TestObjectsBucket.failingAssertion("AID.2", "");

    assistant.addAssertionId(anAssertion.getId());
    assistant.addAssertionId(anotherAssertion.getId());

    expect(assistant.handles(anAssertion)).toBe(true);
    expect(assistant.handles(anotherAssertion)).toBe(true);
  });

  it("should accept failed assertions", () => {
    const assistant = TestObjectsBucket.createModelWithNoAssertionsAssistant();

    assistant.addFailedAssertion(TestObjectsBucket.defaultFailingAssertion());

    expect(assistant.hasOnlyOneAssertionFailedIdentifiedAs(TestObjectsBucket.defaultFailingAssertionAID)).toBe(true);
    expect(assistant.hasFailedAssertions()).toBe(true);
    expect(assistant.doesNotHaveFailedAssertions()).toBe(false);
    expect(assistant.failedAssertionsDescriptions()).toEqual([TestObjectsBucket.defaultFailingAssertionDescription]);
  });

  it("should fail if trying to set from a container when is top level", () => {
    const assistant = FormSectionCompletionAssistant.topLevelWith<{ name: string }, [string]>(
      [FormFieldCompletionAssistant.handling("AID.1", ({ name }) => name, "")],
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
    expect(FormCompletionAssistant.isInvalidModel(model)).toBe(false);
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

  it("should handle its own model failed assertions", (done) => {
    const assistant = TestObjectsBucket.createSelfAssertingModelAssistant();
    const nameAssistant = assistant.nameAssistant;
    nameAssistant.setModel("");

    assistant.withCreatedModelDo(
      (_model) => {
        done("Should be invalid");
      },
      () => {
        expect(assistant.hasFailedAssertions()).toBe(false);
        expect(nameAssistant.hasFailedAssertions()).toBe(true);
        expect(nameAssistant.hasOnlyOneAssertionFailedIdentifiedAs(SelfAssertingModel.nameNotEmptyAID)).toBe(true);
        done();
      }
    );
  });
});
