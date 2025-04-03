import { describe, expect, it } from "@jest/globals";
import { Assertion } from "./Assertion";

describe("Assertion", () => {
  const holdingAssertion = Assertion.for(1, "anAID", () => true, "Description");
  const failingAssertionAID = "failsAID";
  const failingAssertionDescription = "Should fail";
  const failingAssertion = Assertion.for(2, failingAssertionAID, () => false, failingAssertionDescription);

  it("should hold when condition is true", () => {
    expect(holdingAssertion.doesHold()).toBe(true);
    expect(holdingAssertion.doesNotHold()).toBe(false);
    expect(holdingAssertion.hasFailed()).toBe(false);
  });

  it("should not hold when condition is false", () => {
    expect(failingAssertion.doesHold()).toBe(false);
    expect(failingAssertion.doesNotHold()).toBe(true);
    expect(failingAssertion.hasFailed()).toBe(true);
  });

  it("should remember its id and description", () => {
    expect(holdingAssertion.isIdentifiedAs("anAID")).toBe(true);
    expect(holdingAssertion.isIdentifiedAsWith("anAID", "Description")).toBe(true);
    expect(holdingAssertion.isIdentifiedAs(failingAssertionAID)).toBe(false);
    expect(holdingAssertion.isIdentifiedAsWith(failingAssertionAID, "Description")).toBe(false);
    expect(holdingAssertion.isDescription("Description")).toBe(true);
    expect(holdingAssertion.isDescription("No description")).toBe(false);
    expect(holdingAssertion.getDescription()).toBe("Description");

    expect(failingAssertion.isIdentifiedAs(failingAssertionAID)).toBe(true);
    expect(failingAssertion.isIdentifiedAsWith(failingAssertionAID, failingAssertionDescription)).toBe(true);
  });

  it("should not throw when run and holds", () => {
    expect(() => Assertion.assertFor(4, failingAssertionAID, () => true, failingAssertionDescription)).not.toThrow();
  });

  it("should throw when run and does not hold", () => {
    expect(() => Assertion.assertFor(3, failingAssertionAID, () => false, failingAssertionDescription)).toFailAssertion(
      failingAssertionAID,
      failingAssertionDescription
    );
  });

  it("should be deserializable", () => {
    const deserializedAssertion = Assertion.fromJson({
      id: "deserializedAID",
      description: "A description",
    });

    expect(deserializedAssertion.isIdentifiedAsWith("deserializedAID", "A description")).toBe(true);
  });
});
