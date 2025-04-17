import { describe, expect, it } from "@jest/globals";
import { FieldDraftAssistant } from "./FieldDraftAssistant";
import { TestObjectsBucket } from "@testing-support/TestObjectsBucket";
import { AssistantMirror } from "../types";
import type { LabeledAssertion } from "@/assertion";

describe("FieldDraftAssistant", () => {
  const modelFromContainer = TestObjectsBucket.genericContainerForString();

  it("should remember its initial model", () => {
    const assistant = FieldDraftAssistant.handling("AID.1", modelFromContainer, "Init");
    expect(assistant.getModel()).toBe("Init");
    expect(assistant.numberOfMirrors()).toBe(0);
  });

  it("should allow to be changed", () => {
    const assistant = FieldDraftAssistant.handling("AID.1", modelFromContainer, "Init");
    assistant.setModel("Changed");
    expect(assistant.getModel()).toBe("Changed");
    expect(assistant.getModel()).not.toBe("Init");
    expect(assistant.numberOfMirrors()).toBe(0);
  });

  it("should allow to be reset to its initial model", () => {
    const assistant = FieldDraftAssistant.handling("AID.1", modelFromContainer);
    assistant.setModel("Changed");
    assistant.resetModel();
    expect(assistant.getModel()).toBe("");
    expect(assistant.numberOfMirrors()).toBe(0);
  });

  it("should be able to create a model without failing", () => {
    const assistant = FieldDraftAssistant.handlingAll(["AID.1", "AID.2"], modelFromContainer);
    expect(assistant.createModel()).toBe("");
    expect(assistant.numberOfMirrors()).toBe(0);
  });

  it("should accept a mirror", () => {
    const assistant = FieldDraftAssistant.handling("AID.1", modelFromContainer);

    let mirroredImage = "Empty";
    const mirror: AssistantMirror<string> = { reflect: (image) => (mirroredImage = image) };
    assistant.accept(mirror);

    assistant.setModel("Changed");

    expect(mirroredImage).toBe("Changed");
    expect(assistant.numberOfMirrors()).toBe(1);
  });

  it("should be able to break mirrors", () => {
    const assistant = FieldDraftAssistant.handling("AID.1", modelFromContainer);

    let mirroredImage = "Empty";
    const firstMirror: AssistantMirror<string> = {
      reflect: () => {
        throw new Error("Should not be called");
      },
    };
    const secondMirror: AssistantMirror<string> = { reflect: (image) => (mirroredImage = image) };
    assistant.accept(firstMirror);
    assistant.accept(secondMirror);

    assistant.break(firstMirror);

    assistant.setModel("Changed");

    expect(mirroredImage).toBe("Changed");
    expect(assistant.numberOfMirrors()).toBe(1);
  });

  it("should mirror failed assertions", () => {
    const assistant = FieldDraftAssistant.handlingAll(["AID.1", "AID.2"], modelFromContainer);
    const firstFailedAssertion = TestObjectsBucket.failingAssertion("AID.1", "1 description");
    const secondFailedAssertion = TestObjectsBucket.failingAssertion("AID.2", "2 description");

    const mirroredFailedAssertions: LabeledAssertion[] = [];
    assistant.accept({
      onFailure(aFailedAsserion) {
        mirroredFailedAssertions.push(aFailedAsserion);
      },
    });

    assistant.addFailedAssertion(firstFailedAssertion);
    assistant.addFailedAssertion(secondFailedAssertion);

    expect(mirroredFailedAssertions).toEqual([firstFailedAssertion, secondFailedAssertion]);
  });

  it("should mirror a failed assertions reset", () => {
    const assistant = FieldDraftAssistant.handlingAll(["AID.1", "AID.2"], modelFromContainer);

    let hasBeenReset = false;
    assistant.accept({
      onFailureReset() {
        hasBeenReset = true;
      },
    });
    const failedAssertion = TestObjectsBucket.failingAssertion("AID.1", "1 description");

    assistant.addFailedAssertion(failedAssertion);
    assistant.createModel();

    expect(hasBeenReset).toBe(true);
  });

  it("should mirror a reset", () => {
    const assistant = FieldDraftAssistant.handlingAll(["AID.1"], modelFromContainer, "Init");

    let image = "";
    assistant.accept({
      reflect(anImage) {
        image = anImage;
      },
    });

    assistant.resetModel();

    expect(image).toBe("Init");
  });
});
