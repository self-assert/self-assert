import { describe, expect, it } from "@jest/globals";
import { AssertionsFailed } from "./AssertionsFailed";
import { RuleLabel } from "./RuleLabel";
import { LabelId } from "./types";

describe("AssertionsFailed", () => {
  const aFailedAssertionJson = {
    id: "AID.1",
    description: "1 description",
  };
  const anotherFailedAssertionJson = {
    id: "AID.2",
    description: "2 description",
  };
  it("should be deserializable with one failed assertion", () => {
    const assertionsFailedAsJson = {
      failedAssertions: [aFailedAssertionJson],
    };
    const assertionsFailed = AssertionsFailed.fromJson(assertionsFailedAsJson);
    expect(assertionsFailed.hasOnlyOneAssertionFailedWith("AID.1", "1 description")).toBe(true);
  });

  it("should be deserializable with multiple failed assertions", () => {
    const assertionsFailedAsJson = {
      failedAssertions: [aFailedAssertionJson, anotherFailedAssertionJson],
    };
    const assertionsFailed = AssertionsFailed.fromJson(assertionsFailedAsJson);
    expect(assertionsFailed.hasAnAssertionFailedWith("AID.1", "1 description")).toBe(true);
    expect(assertionsFailed.hasAnAssertionFailedWith("AID.2", "2 description")).toBe(true);
  });

  it("should let traverse failed assertions", () => {
    const assertionsFailed = new AssertionsFailed([
      new RuleLabel("AID.1", "1 description"),
      new RuleLabel("AID.2", "2 description"),
    ]);

    let failedAssertionCount = 0;
    const failedAssertionIds: LabelId[] = [];
    assertionsFailed.forEachAssertionFailed((assertion) => {
      failedAssertionIds.push(assertion.getId());
      failedAssertionCount++;
    });

    expect(failedAssertionCount).toBe(2);
    expect(failedAssertionIds).toEqual(["AID.1", "AID.2"]);
  });
});
