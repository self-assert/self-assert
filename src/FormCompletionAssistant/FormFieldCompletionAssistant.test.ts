import { describe, expect, it } from "@jest/globals";
import { FormFieldCompletionAssistant } from "./FormFieldCompletionAssistant";
import { TestObjectsBucket } from "@testing-support/TestObjectsBucket";

describe("FormFieldCompletionAssistant", () => {
  const modelFromContainer = TestObjectsBucket.genericContainerForString();

  it("should remember its initial model", () => {
    const formFieldCompletionAssistant = FormFieldCompletionAssistant.handling("AID.1", modelFromContainer, "Init");
    expect(formFieldCompletionAssistant.getModel()).toBe("Init");
    expect(formFieldCompletionAssistant.numberOfMirrors()).toBe(0);
  });

  it("should allow to be changed", () => {
    const formFieldCompletionAssistant = FormFieldCompletionAssistant.handling("AID.1", modelFromContainer, "Init");
    formFieldCompletionAssistant.setModel("Changed");
    expect(formFieldCompletionAssistant.getModel()).toBe("Changed");
    expect(formFieldCompletionAssistant.getModel()).not.toBe("Init");
    expect(formFieldCompletionAssistant.numberOfMirrors()).toBe(0);
  });

  it("should allow to be reset to its initial model", () => {
    const formFieldCompletionAssistant = FormFieldCompletionAssistant.handling("AID.1", modelFromContainer);
    formFieldCompletionAssistant.setModel("Changed");
    formFieldCompletionAssistant.resetModel();
    expect(formFieldCompletionAssistant.getModel()).toBe("");
    expect(formFieldCompletionAssistant.numberOfMirrors()).toBe(0);
  });

  it("should be able to create a model without failing", () => {
    const formFieldCompletionAssistant = FormFieldCompletionAssistant.handlingAll(
      ["AID.1", "AID.2"],
      modelFromContainer
    );
    expect(formFieldCompletionAssistant.createModel()).toBe("");
    expect(formFieldCompletionAssistant.numberOfMirrors()).toBe(0);
  });

  it("should accept a mirror", () => {
    const formFieldCompletionAssistant = FormFieldCompletionAssistant.handling("AID.1", modelFromContainer);

    let notified = 0;
    formFieldCompletionAssistant.accept({ modelChanged: () => (notified = 1) });

    formFieldCompletionAssistant.setModel("Changed");

    expect(notified).toBe(1);
    expect(formFieldCompletionAssistant.numberOfMirrors()).toBe(1);
  });
});
