import { describe, expect, it } from "@jest/globals";
import { FormFieldCompletionAssistant } from "./FormFieldCompletionAssistant";
import { TestObjectsBucket } from "@tests/TestObjectsBucket";

describe("FormFieldCompletionAssistant", () => {
  const modelFromContainer = TestObjectsBucket.genericContainerForString();

  it("should remember its initial model", () => {
    const formFieldCompletionAssistant = FormFieldCompletionAssistant.handling("AID.1", modelFromContainer, "Init");
    expect(formFieldCompletionAssistant.getModel()).toBe("Init");
  });

  it("should allow to be changed", () => {
    const formFieldCompletionAssistant = FormFieldCompletionAssistant.handling("AID.1", modelFromContainer, "Init");
    formFieldCompletionAssistant.setModel("Changed");
    expect(formFieldCompletionAssistant.getModel()).toBe("Changed");
    expect(formFieldCompletionAssistant.getModel()).not.toBe("Init");
  });

  it("should allow to be reset to its initial model", () => {
    const formFieldCompletionAssistant = FormFieldCompletionAssistant.handling("AID.1", modelFromContainer, "Init");
    formFieldCompletionAssistant.setModel("Changed");
    formFieldCompletionAssistant.resetModel();
    expect(formFieldCompletionAssistant.getModel()).toBe("Init");
  });
});
