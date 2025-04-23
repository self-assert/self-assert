import { describe, expect, it } from "@jest/globals";
import { FieldDraftAssistant } from "./FieldDraftAssistant";
import { TestObjectsBucket } from "@testing-support/TestObjectsBucket";
import { DraftViewer } from "../types";
import { Assertion, RuleLabel, type LabeledRule } from "../rule";
import { Requirements } from "../rule-requirements";

describe("FieldDraftAssistant", () => {
  const modelFromContainer = TestObjectsBucket.genericContainerForString();

  it("should remember its initial model", () => {
    const assistant = FieldDraftAssistant.handling("AID.1", modelFromContainer, "Init");
    expect(assistant.getModel()).toBe("Init");
    expect(assistant.numberOfViewers()).toBe(0);
  });

  it("should allow to be changed", () => {
    const assistant = FieldDraftAssistant.handling("AID.1", modelFromContainer, "Init");
    assistant.setModel("Changed");
    expect(assistant.getModel()).toBe("Changed");
    expect(assistant.getModel()).not.toBe("Init");
    expect(assistant.numberOfViewers()).toBe(0);
  });

  it("should allow to be reset to its initial model", () => {
    const assistant = FieldDraftAssistant.handling("AID.1", modelFromContainer);
    assistant.setModel("Changed");
    assistant.resetModel();
    expect(assistant.getModel()).toBe("");
    expect(assistant.numberOfViewers()).toBe(0);
  });

  it("should be able to create a model without failing", () => {
    const assistant = FieldDraftAssistant.handlingAll(["AID.1", "AID.2"], modelFromContainer);
    expect(assistant.createModel()).toBe("");
    expect(assistant.numberOfViewers()).toBe(0);
  });

  describe("Viewers", () => {
    it("should accept a viewer", () => {
      const assistant = FieldDraftAssistant.handling("AID.1", modelFromContainer);

      let mirroredModel = "Empty";
      const viewer: DraftViewer<string> = { onDraftChanged: (model) => (mirroredModel = model) };
      assistant.accept(viewer);

      assistant.setModel("Changed");

      expect(mirroredModel).toBe("Changed");
      expect(assistant.numberOfViewers()).toBe(1);
    });

    it("should be able to remove a viewer", () => {
      const assistant = FieldDraftAssistant.handling("AID.1", modelFromContainer);

      let mirroredModel = "Empty";
      const firstViewer: DraftViewer<string> = {
        onDraftChanged: () => {
          throw new Error("Should not be called");
        },
      };
      const secondViewer: DraftViewer<string> = { onDraftChanged: (image) => (mirroredModel = image) };
      assistant.accept(firstViewer);
      assistant.accept(secondViewer);

      assistant.removeViewer(firstViewer);

      assistant.setModel("Changed");

      expect(mirroredModel).toBe("Changed");
      expect(assistant.numberOfViewers()).toBe(1);
    });

    it("should be notified about failed assertions", () => {
      const assistant = FieldDraftAssistant.handlingAll(["AID.1", "AID.2"], modelFromContainer);
      const firstFailedAssertion = TestObjectsBucket.failingAssertion("AID.1", "1 description");
      const secondFailedAssertion = TestObjectsBucket.failingAssertion("AID.2", "2 description");
      const mirroredFailedAssertions: LabeledRule[] = [];
      assistant.accept({
        onFailure(aFailedAsserion) {
          mirroredFailedAssertions.push(aFailedAsserion);
        },
      });

      assistant.setModel("Changed");
      assistant.addBrokenRule(firstFailedAssertion);
      assistant.addBrokenRule(secondFailedAssertion);

      expect(mirroredFailedAssertions).toEqual([firstFailedAssertion, secondFailedAssertion]);
    });

    it("should be notified about a failed assertions reset", () => {
      const assistant = FieldDraftAssistant.handlingAll(["AID.1", "AID.2"], modelFromContainer);

      let hasBeenReset = false;
      assistant.accept({
        onFailuresReset() {
          hasBeenReset = true;
        },
      });
      const failedAssertion = TestObjectsBucket.failingAssertion("AID.1", "1 description");

      assistant.addBrokenRule(failedAssertion);
      assistant.createModel();

      expect(hasBeenReset).toBe(true);
    });

    it("should be notified about a draft reset", () => {
      const assistant = FieldDraftAssistant.handlingAll(["AID.1"], modelFromContainer, "Init");

      let image = "";
      assistant.accept({
        onDraftChanged(anImage) {
          image = anImage;
        },
      });

      assistant.resetModel();

      expect(image).toBe("Init");
    });
  });

  it("should be able to evaluate its assertions when is valid", () => {
    const assistant = FieldDraftAssistant.requiring(
      Assertion.requiring("AID.1", "1 description", Requirements.hold),
      modelFromContainer
    );

    assistant.review();

    expect(assistant.doesNotHaveBrokenRules()).toBe(true);
  });

  it("should be able to evaluate its assertions when is invalid", () => {
    const firstDescription = "Value is not 'FORBIDDEN'";
    const secondDescription = "Value has at most 4 characters";
    const assistant = FieldDraftAssistant.requiringAll(
      [
        Assertion.requiring<string>("AID.1", firstDescription, Requirements.differentFrom("FORBIDDEN")),
        Assertion.requiring<string>("AID.2", secondDescription, Requirements.hasAtMost(4)),
      ],
      modelFromContainer
    );

    assistant.setModel("FORBIDDEN");
    assistant.review();

    expect(assistant.hasBrokenRules()).toBe(true);
    expect(assistant.brokenRulesDescriptions()).toEqual([firstDescription, secondDescription]);
  });

  it("should not add the same assertion more than once", () => {
    const label = new RuleLabel("AID", "1 description");
    const assistant = FieldDraftAssistant.handling(label.getId(), modelFromContainer);

    assistant.addBrokenRule(label);
    assistant.addBrokenRule(label);

    expect(assistant.hasOnlyOneRuleBrokenIdentifiedAs(label.getId())).toBe(true);
    expect(assistant.brokenRulesDescriptions()).toEqual(["1 description"]);
  });
});
