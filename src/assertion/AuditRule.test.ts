import { describe, expect, it } from "@jest/globals";
import { AuditRule } from "./AuditRule";
import { RulesBroken } from "./RulesBroken";

const hold = () => Promise.resolve(true);
const fail = () => Promise.resolve(false);

describe("AuditRule", () => {
  it("fails when condition is not met", async () => {
    const audit = AuditRule.requiring("AID", "Description", fail);

    await expect(audit.doesHold()).resolves.toBe(false);
    await expect(audit.hasFailed()).resolves.toBe(true);
  });

  it("passes when condition is met", async () => {
    const audit = AuditRule.requiring("AID", "Description", hold);

    await expect(audit.doesHold()).resolves.toBe(true);
    await expect(audit.hasFailed()).resolves.toBe(false);
  });

  it("fails when any condition fails", async () => {
    const audit = AuditRule.requiring("AID", "Multiple conditions", hold).require(fail).require(hold);

    await expect(audit.doesHold()).resolves.toBe(false);
    await expect(audit.hasFailed()).resolves.toBe(true);
  });

  it("should not throw when is asserted and all conditions hold", async () => {
    const audit = AuditRule.requiring("AID", "Description", hold);

    await expect(audit.mustHold()).resolves.toBeUndefined();
  });

  it("should throw an AssertionFailed when is asserted and any condition fails", async () => {
    expect.assertions(2);
    const audit = AuditRule.requiring("AID", "Description", fail);

    return audit.mustHold().catch((error: unknown) => {
      expect(error).toBeInstanceOf(RulesBroken);
      expect((error as RulesBroken).hasAnAssertionFailedWith("AID", "Description")).toBe(true);
    });
  });

  it("should allow conditions that depend on a value", async () => {
    const audit = AuditRule.requiring("AID", "Description", (value: string) => Promise.resolve(value === "value"));

    await expect(audit.doesHold("value")).resolves.toBe(true);
    await expect(audit.hasFailed("value")).resolves.toBe(false);
  });

  it("should behave like a label", () => {
    const audit = AuditRule.labeled("AID", "Description");

    expect(audit.getId()).toBe("AID");
    expect(audit.getDescription()).toBe("Description");
    expect(audit.hasLabelId("AID")).toBe(true);
    expect(audit.hasDescription("Description")).toBe(true);
    expect(audit.hasLabel("AID", "Description")).toBe(true);
  });
});
