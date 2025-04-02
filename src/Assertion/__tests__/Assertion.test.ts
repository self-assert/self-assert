import { describe, expect, it } from "@jest/globals";
import { Assertion } from "../Assertion";

describe("Assertion", () => {
  it("should hold when condition is true", () => {
    const assertion = Assertion.for(1, "anAID", () => true, "Description");

    expect(assertion.doesHold()).toBe(true);
    expect(assertion.doesNotHold()).toBe(false);
    expect(assertion.hasFailed()).toBe(false);
  });

  it("should not hold when condition is false", () => {
    const assertion = Assertion.for(2, "anAID", () => false, "Description");

    expect(assertion.doesHold()).toBe(false);
    expect(assertion.doesNotHold()).toBe(true);
    expect(assertion.hasFailed()).toBe(true);
  });
});
