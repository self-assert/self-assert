import { describe, expect, it } from "@jest/globals";
import { FormSectionCompletionAssistant } from "./FormSectionCompletionAssistant";
import { FormFieldCompletionAssistant } from "./FormFieldCompletionAssistant";
import { FormCompletionAssistant } from "./FormCompletionAssistant";
import { TestObjectsBucket } from "@tests/TestObjectsBucket";
import { Assertion } from "@/Assertion/Assertion";

describe("FormSectionCompletionAssistant", () => {
  it("should be created invalid with no failed assertions", () => {
    const assistant = TestObjectsBucket.createTestModelAssistant();

    expect(FormCompletionAssistant.isInvalidModel(assistant.getModel())).toBe(true);
    expect(assistant.hasFailedAssertions()).toBe(false);
    expect(assistant.doesNotHaveFailedAssertions()).toBe(true);
    expect(assistant.handles(Assertion.for(1, "AID.1", () => true, "Description 1"))).toBe(false);
    expect(assistant.failedAssertionsDescriptions()).toEqual([]);
  });

  it("should handle an assertion identified with a stored id", () => {
    const assistant = TestObjectsBucket.createTestModelAssistant([TestObjectsBucket.defaultFailingAssertionAID]);

    expect(assistant.handles(TestObjectsBucket.defaultFailingAssertion())).toBe(true);
  });

  it("should accept assertion ids", () => {
    const assistant = TestObjectsBucket.createTestModelAssistant();
    const anAssertion = TestObjectsBucket.defaultFailingAssertion();
    const anotherAssertion = TestObjectsBucket.failingAssertion("AID.2", "");

    assistant.addAssertionId(anAssertion.getId());
    assistant.addAssertionId(anotherAssertion.getId());

    expect(assistant.handles(anAssertion)).toBe(true);
    expect(assistant.handles(anotherAssertion)).toBe(true);
  });

  it("should accept failed assertions", () => {
    const assistant = TestObjectsBucket.createTestModelAssistant();

    assistant.addFailedAssertion(TestObjectsBucket.defaultFailingAssertion());

    expect(assistant.hasOnlyOneAssertionFailedIdentifiedAs(TestObjectsBucket.defaultFailingAssertionAID)).toBe(true);
    expect(assistant.hasFailedAssertions()).toBe(true);
    expect(assistant.doesNotHaveFailedAssertions()).toBe(false);
    expect(assistant.failedAssertionsDescriptions()).toEqual([TestObjectsBucket.defaultFailingAssertionDescription]);
  });
});
