import { describe, expect, it } from "@jest/globals";
import { FormFieldCompletionAssistant } from "./FormFieldCompletionAssistant";
import { TestObjectsBucket } from "@testing-support/TestObjectsBucket";
import { AssistantMirror } from "../types";
import type { SelfContainedAssertion } from "@/assertion";

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

    let mirroredImage = "Empty";
    const mirror: AssistantMirror<string> = { reflect: (image) => (mirroredImage = image) };
    formFieldCompletionAssistant.accept(mirror);

    formFieldCompletionAssistant.setModel("Changed");

    expect(mirroredImage).toBe("Changed");
    expect(formFieldCompletionAssistant.numberOfMirrors()).toBe(1);
  });

  it("should be able to break mirrors", () => {
    const formFieldCompletionAssistant = FormFieldCompletionAssistant.handling("AID.1", modelFromContainer);

    let mirroredImage = "Empty";
    const firstMirror: AssistantMirror<string> = {
      reflect: () => {
        throw new Error("Should not be called");
      },
    };
    const secondMirror: AssistantMirror<string> = { reflect: (image) => (mirroredImage = image) };
    formFieldCompletionAssistant.accept(firstMirror);
    formFieldCompletionAssistant.accept(secondMirror);

    formFieldCompletionAssistant.break(firstMirror);

    formFieldCompletionAssistant.setModel("Changed");

    expect(mirroredImage).toBe("Changed");
    expect(formFieldCompletionAssistant.numberOfMirrors()).toBe(1);
  });

  it("should mirror failed assertions", () => {
    const formFieldCompletionAssistant = FormFieldCompletionAssistant.handlingAll(
      ["AID.1", "AID.2"],
      modelFromContainer
    );
    const firstFailedAssertion = TestObjectsBucket.failingAssertion("AID.1", "1 description");
    const secondFailedAssertion = TestObjectsBucket.failingAssertion("AID.2", "2 description");

    const mirroredFailedAssertions: SelfContainedAssertion[] = [];
    formFieldCompletionAssistant.accept({
      onFailure(aFailedAsserion) {
        mirroredFailedAssertions.push(aFailedAsserion);
      },
    });

    formFieldCompletionAssistant.addFailedAssertion(firstFailedAssertion);
    formFieldCompletionAssistant.addFailedAssertion(secondFailedAssertion);

    expect(mirroredFailedAssertions).toEqual([firstFailedAssertion, secondFailedAssertion]);
  });

  it("should mirror a failed assertions reset", () => {
    const formFieldCompletionAssistant = FormFieldCompletionAssistant.handlingAll(
      ["AID.1", "AID.2"],
      modelFromContainer
    );

    let hasBeenReset = false;
    formFieldCompletionAssistant.accept({
      onFailureReset() {
        hasBeenReset = true;
      },
    });
    const failedAssertion = TestObjectsBucket.failingAssertion("AID.1", "1 description");

    formFieldCompletionAssistant.addFailedAssertion(failedAssertion);
    formFieldCompletionAssistant.createModel();

    expect(hasBeenReset).toBe(true);
  });

  it("should mirror a reset", () => {
    const formFieldCompletionAssistant = FormFieldCompletionAssistant.handlingAll(
      ["AID.1"],
      modelFromContainer,
      "Init"
    );

    let image = "";
    formFieldCompletionAssistant.accept({
      reflect(anImage) {
        image = anImage;
      },
    });

    formFieldCompletionAssistant.resetModel();

    expect(image).toBe("Init");
  });
});
