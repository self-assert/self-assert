import { describe, expect, it } from "@jest/globals";
import { Assertion } from "./Assertion";
import { TestObjectsBucket } from "@testing-support/TestObjectsBucket";
import { Conditions } from "@/conditions";

describe("Assertion", () => {
  const holdingAssertion = TestObjectsBucket.holdingAssertion();
  const holdingAssertionAID = TestObjectsBucket.defaultHoldingAssertionAID;
  const holdingAssertionDescription = TestObjectsBucket.defaultHoldingAssertionDescription;
  const failingAssertion = TestObjectsBucket.defaultFailingAssertion();
  const failingAssertionAID = TestObjectsBucket.defaultFailingAssertionAID;
  const failingAssertionDescription = TestObjectsBucket.defaultFailingAssertionDescription;

  it("should hold when condition is true", () => {
    expect(holdingAssertion).toHold();
  });

  it("should not hold when condition is false", () => {
    expect(failingAssertion).toFail();
  });

  it("should remember its id and description", () => {
    expect(holdingAssertion.hasLabelId(holdingAssertionAID)).toBe(true);
    expect(holdingAssertion.hasLabel(holdingAssertionAID, holdingAssertionDescription)).toBe(true);
    expect(holdingAssertion.hasLabelId(failingAssertionAID)).toBe(false);
    expect(holdingAssertion.hasLabel(failingAssertionAID, holdingAssertionDescription)).toBe(false);
    expect(holdingAssertion.hasDescription(holdingAssertionDescription)).toBe(true);
    expect(holdingAssertion.hasDescription("No description")).toBe(false);
    expect(holdingAssertion.getDescription()).toBe(holdingAssertionDescription);

    expect(failingAssertion.hasLabelId(failingAssertionAID)).toBe(true);
    expect(failingAssertion.hasLabel(failingAssertionAID, failingAssertionDescription)).toBe(true);
  });

  it("should be deserializable", () => {
    const deserializedAssertion = Assertion.fromJson({
      id: "deserializedAID",
      description: "A description",
    });

    expect(deserializedAssertion.hasLabel("deserializedAID", "A description")).toBe(true);
  });

  it("should be able to require many conditions", () => {
    const assertion = Assertion.labeled<string>("ManyConditionsAssertion", "A description")
      .require(Conditions.differentFrom("FORBIDDEN"))
      .require(Conditions.isNotEmpty);

    expect(assertion).toFailWith("FORBIDDEN");
    expect(assertion).toFailWith("");
    expect(assertion).toHoldWith("OK");
  });

  it("should allow to prepare an evaluation", () => {
    const assertion = Assertion.requiring("AID", "Description", Conditions.differentFrom("FORBIDDEN"));
    const holdingEvaluation = assertion.evaluateFor("OK");
    const failingEvaluation = assertion.evaluateFor("FORBIDDEN");

    expect(holdingEvaluation).toHold();
    expect(failingEvaluation).toFail();
  });

  it("should not throw when asserting its conditions are met", () => {
    const assertion = Assertion.requiring<string>("AID", "Description", Conditions.differentFrom("FORBIDDEN"));

    expect(() => assertion.assert("OK")).not.toThrow();
  });

  it("should throw when asserting its conditions are not met", () => {
    const assertion = Assertion.requiring<string>("AID", "Description", Conditions.differentFrom("FORBIDDEN"));

    expect(() => assertion.assert("FORBIDDEN")).toFailAssertion("AID", "Description");
  });
});
