import { describe, expect, it } from "@jest/globals";
import { Assertion } from "./Assertion";
import { TestObjectsBucket } from "@testing-support/TestObjectsBucket";

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
    expect(holdingAssertion.isIdentifiedAs(holdingAssertionAID)).toBe(true);
    expect(holdingAssertion.isIdentifiedAsWith(holdingAssertionAID, holdingAssertionDescription)).toBe(true);
    expect(holdingAssertion.isIdentifiedAs(failingAssertionAID)).toBe(false);
    expect(holdingAssertion.isIdentifiedAsWith(failingAssertionAID, holdingAssertionDescription)).toBe(false);
    expect(holdingAssertion.hasDescription(holdingAssertionDescription)).toBe(true);
    expect(holdingAssertion.hasDescription("No description")).toBe(false);
    expect(holdingAssertion.getDescription()).toBe(holdingAssertionDescription);

    expect(failingAssertion.isIdentifiedAs(failingAssertionAID)).toBe(true);
    expect(failingAssertion.isIdentifiedAsWith(failingAssertionAID, failingAssertionDescription)).toBe(true);
  });

  it("should be deserializable", () => {
    const deserializedAssertion = Assertion.fromJson({
      id: "deserializedAID",
      description: "A description",
    });

    expect(deserializedAssertion.isIdentifiedAsWith("deserializedAID", "A description")).toBe(true);
  });

  it("should be able to require many conditions", () => {
    const assertion = Assertion.identifiedAs<string>("ManyConditionsAssertion", "A description")
      .require((value) => value !== "")
      .require((value) => value !== "FORBIDDEN");

    expect(assertion.doesHold("FORBIDDEN")).toBe(false);
    expect(assertion.hasFailed("FORBIDDEN")).toBe(true);
    expect(assertion.doesHold("")).toBe(false);
    expect(assertion.hasFailed("")).toBe(true);
    expect(assertion.doesHold("OK")).toBe(true);
    expect(assertion.hasFailed("OK")).toBe(false);
  });

  it("should allow to prepare an evaluation", () => {
    const assertion = Assertion.for<string>("AID", "Description", (value) => value !== "FORBIDDEN");
    const failingEvaluation = assertion.evaluateFor("FORBIDDEN");
    const holdingEvaluation = assertion.evaluateFor("OK");

    expect(holdingEvaluation.doesHold()).toBe(true);
    expect(holdingEvaluation.hasFailed()).toBe(false);
    expect(failingEvaluation.doesHold()).toBe(false);
    expect(failingEvaluation.hasFailed()).toBe(true);
  });
});
