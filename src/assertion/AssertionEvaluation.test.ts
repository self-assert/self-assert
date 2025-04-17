import { describe, expect, it } from "@jest/globals";
import { Assertion } from "./Assertion";
import { AssertionEvaluation } from "./AssertionEvaluation";

describe("AssertionEvaluation", () => {
  it("should hold when condition is true with value", () => {
    const assertion = Assertion.for<string>("AID", "Description", (value) => value === "value");
    const evaluation = AssertionEvaluation.for(assertion, "value");

    expect(evaluation).toHold();
  });

  it("should not hold when condition is false with value", () => {
    const assertion = Assertion.for<string>("AID", "Description", (value) => value === "value");
    const evaluation = AssertionEvaluation.for(assertion, "not value");

    expect(evaluation).toFail();
  });

  it("behaves like an assertion", () => {
    const assertion = Assertion.for<string>("AID", "Description", (value) => value === "value");
    const evaluation = AssertionEvaluation.for(assertion, "value");

    expect(evaluation.getId()).toBe("AID");
    expect(evaluation.isIdentifiedAs("AID")).toBe(true);
    expect(evaluation.getDescription()).toBe("Description");
    expect(evaluation.hasDescription("Description")).toBe(true);
    expect(evaluation.isIdentifiedAsWith("AID", "Description")).toBe(true);
  });
});
