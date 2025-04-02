import { describe, expect, it } from "@jest/globals";
import { Assertion } from "../Assertion";

describe("Assertion", () => {
  const holdingAssertion = Assertion.for(1, "anAID", () => true, "Description");
  const notHoldingAssertion = Assertion.for(2, "anotherAID", () => false, "Another description");

  it("should hold when condition is true", () => {
    expect(holdingAssertion.doesHold()).toBe(true);
    expect(holdingAssertion.doesNotHold()).toBe(false);
    expect(holdingAssertion.hasFailed()).toBe(false);
  });

  it("should not hold when condition is false", () => {
    expect(notHoldingAssertion.doesHold()).toBe(false);
    expect(notHoldingAssertion.doesNotHold()).toBe(true);
    expect(notHoldingAssertion.hasFailed()).toBe(true);
  });

  it("should remember its id and description", () => {
    expect(holdingAssertion.isIdentifiedAs("anAID")).toBe(true);
    expect(holdingAssertion.isIdentifiedAsWith("anAID", "Description")).toBe(true);
    expect(holdingAssertion.isIdentifiedAs("anotherAID")).toBe(false);
    expect(holdingAssertion.isIdentifiedAsWith("anotherAID", "Description")).toBe(false);
    expect(holdingAssertion.isDescription("Description")).toBe(true);
    expect(holdingAssertion.isDescription("No description")).toBe(false);
    expect(holdingAssertion.getDescription()).toBe("Description");

    expect(notHoldingAssertion.isIdentifiedAs("anotherAID")).toBe(true);
    expect(notHoldingAssertion.isIdentifiedAsWith("anotherAID", "Another description")).toBe(true);
  });
});
