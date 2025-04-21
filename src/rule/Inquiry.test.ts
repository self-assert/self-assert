import { describe, expect, it } from "@jest/globals";
import { Inquiry } from "./Inquiry";
import { RulesBroken } from "./RulesBroken";

const hold = () => Promise.resolve(true);
const fail = () => Promise.resolve(false);
const isStringHello = (value: string) => Promise.resolve(value === "hello");

describe("Inquiry", () => {
  it("fails when condition is not met", async () => {
    const inquiry = Inquiry.requiring("AID", "Description", fail);

    await expect(inquiry.doesHold()).resolves.toBe(false);
    await expect(inquiry.hasFailed()).resolves.toBe(true);
  });

  it("passes when condition is met", async () => {
    const inquiry = Inquiry.requiring("AID", "Description", hold);

    await expect(inquiry.doesHold()).resolves.toBe(true);
    await expect(inquiry.hasFailed()).resolves.toBe(false);
  });

  it("fails when any condition fails", async () => {
    const inquiry = Inquiry.requiring("AID", "Multiple conditions", hold).require(fail).require(hold);

    await expect(inquiry.doesHold()).resolves.toBe(false);
    await expect(inquiry.hasFailed()).resolves.toBe(true);
  });

  it("should not throw when is asserted and all conditions hold", async () => {
    const inquiry = Inquiry.requiring("AID", "Description", hold);

    await expect(inquiry.mustHold()).resolves.toBeUndefined();
  });

  it("should throw an AssertionFailed when is asserted and any condition fails", async () => {
    expect.assertions(2);
    const inquiry = Inquiry.requiring("AID", "Description", fail);

    return inquiry.mustHold().catch((error: unknown) => {
      expect(error).toBeInstanceOf(RulesBroken);
      expect((error as RulesBroken).hasRuleBrokenWith("AID", "Description")).toBe(true);
    });
  });

  it("should allow conditions that depend on a value", async () => {
    const inquiry = Inquiry.requiring("AID", "Description", isStringHello);

    await expect(inquiry.doesHold("hello")).resolves.toBe(true);
    await expect(inquiry.hasFailed("hello")).resolves.toBe(false);
  });

  it("should behave like a label", () => {
    const inquiry = Inquiry.labeled("AID", "Description");

    expect(inquiry.getId()).toBe("AID");
    expect(inquiry.getDescription()).toBe("Description");
    expect(inquiry.hasLabelId("AID")).toBe(true);
    expect(inquiry.hasDescription("Description")).toBe(true);
    expect(inquiry.hasLabel("AID", "Description")).toBe(true);
  });

  it("should allow to be prepared for evaluation", async () => {
    const inquiry = Inquiry.requiring("AID", "Description", isStringHello);
    const evaluation = inquiry.evaluateFor("hello");

    await expect(evaluation.doesHold()).resolves.toBe(true);
    await expect(evaluation.hasFailed()).resolves.toBe(false);
  });
});
