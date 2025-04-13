import { describe, expect, it } from "@jest/globals";
import { Assertion } from "./Assertion";
import { AssertionEvaluation } from "./AssertionEvaluation";

describe("AssertionEvaluation", () => {
  it("should hold when condition is true with value", () => {
    const assertion = Assertion.for<string>("AID", "Description", (value) => value === "value");
    const evaluation = AssertionEvaluation.for(assertion, "value");

    expect(evaluation.doesHold()).toBe(true);
    expect(evaluation.hasFailed()).toBe(false);
  });

  it("should not hold when condition is false with value", () => {
    const assertion = Assertion.for<string>("AID", "Description", (value) => value === "value");
    const evaluation = AssertionEvaluation.for(assertion, "not value");

    expect(evaluation.doesHold()).toBe(false);
    expect(evaluation.hasFailed()).toBe(true);
  });

  it("behaves like an assertion", () => {
    const assertion = Assertion.for<string>("AID", "Description", (value) => value === "value");
    const evaluation = AssertionEvaluation.for(assertion, "value");

    expect(evaluation.getId()).toBe("AID");
    expect(evaluation.isIdentifiedAs("AID")).toBe(true);
    expect(evaluation.getDescription()).toBe("Description");
    expect(evaluation.isDescription("Description")).toBe(true);
    expect(evaluation.isIdentifiedAsWith("AID", "Description")).toBe(true);
  });
});
