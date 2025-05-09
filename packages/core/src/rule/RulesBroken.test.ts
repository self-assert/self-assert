import { describe, expect, it } from "@jest/globals";
import { RulesBroken, RulesBrokenAsJson } from "./RulesBroken";
import { RuleLabel } from "./RuleLabel";
import { LabelId } from "./types";

describe("RulesBroken", () => {
  const aFailedAssertionJson = {
    id: "AID.1",
    description: "1 description",
  };
  const anotherFailedAssertionJson = {
    id: "AID.2",
    description: "2 description",
  };
  it("should be deserializable with one failed assertion", () => {
    const rulesBrokenAsJson: RulesBrokenAsJson = {
      brokenRules: [aFailedAssertionJson],
    };
    const assertionsFailed = RulesBroken.fromJson(rulesBrokenAsJson);
    expect(assertionsFailed.hasOnlyOneRuleBrokenWith("AID.1", "1 description")).toBe(true);
  });

  it("should be deserializable with multiple failed assertions", () => {
    const rulesBrokenAsJson: RulesBrokenAsJson = {
      brokenRules: [aFailedAssertionJson, anotherFailedAssertionJson],
    };
    const assertionsFailed = RulesBroken.fromJson(rulesBrokenAsJson);
    expect(assertionsFailed.hasRuleBrokenWith("AID.1", "1 description")).toBe(true);
    expect(assertionsFailed.hasRuleBrokenWith("AID.2", "2 description")).toBe(true);
  });

  it("should let traverse failed assertions", () => {
    const assertionsFailed = new RulesBroken([
      new RuleLabel("AID.1", "1 description"),
      new RuleLabel("AID.2", "2 description"),
    ]);

    let failedAssertionCount = 0;
    const failedAssertionIds: LabelId[] = [];
    assertionsFailed.forEachRuleBroken((assertion) => {
      failedAssertionIds.push(assertion.getId());
      failedAssertionCount++;
    });

    expect(failedAssertionCount).toBe(2);
    expect(failedAssertionIds).toEqual(["AID.1", "AID.2"]);
  });
});
