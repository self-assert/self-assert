import { describe, expect, it } from "@jest/globals";
import { Assertion } from "./Assertion";
import { Requirements } from "../rule-requirements";
import { RuleEvaluation } from "./RuleEvaluation";

describe(RuleEvaluation.name, () => {
  it("should hold when condition is true with value", () => {
    const assertion = Assertion.requiring(
      "AID",
      "Description",
      Requirements.identical("value")
    );
    const evaluation = new RuleEvaluation(assertion, "value");

    expect(evaluation).toHold();
  });

  it("should not hold when condition is false with value", () => {
    const assertion = Assertion.requiring(
      "AID",
      "Description",
      Requirements.identical("value")
    );
    const evaluation = new RuleEvaluation(assertion, "not value");

    expect(evaluation).toFail();
  });

  it("behaves like a labeled rule", () => {
    const assertion = Assertion.requiring(
      "AID",
      "Description",
      Requirements.identical("value")
    );
    const evaluation = new RuleEvaluation(assertion, "value");

    expect(evaluation.getId()).toBe("AID");
    expect(evaluation.hasLabelId("AID")).toBe(true);
    expect(evaluation.getDescription()).toBe("Description");
    expect(evaluation.hasDescription("Description")).toBe(true);
    expect(evaluation.hasLabel("AID", "Description")).toBe(true);
  });

  it("should be able to assert its conditions are met", () => {
    const assertion = Assertion.requiring(
      "AID",
      "Description",
      Requirements.identical("value")
    );
    const evaluation = new RuleEvaluation(assertion, "not value");

    expect(() => evaluation.mustHold()).toFailAssertion("AID", "Description");
  });
});
