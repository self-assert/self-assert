import { describe, expect, it } from "@jest/globals";
import { Audit } from "./Audit";
import { AssertionsFailed } from "./AssertionsFailed";

const hold = () => Promise.resolve(true);
const fail = () => Promise.resolve(false);

describe("Audit", () => {
  it("fails when condition is not met", async () => {
    const audit = Audit.requiring("AID", "Description", fail);

    await expect(audit.doesHold()).resolves.toBe(false);
    await expect(audit.hasFailed()).resolves.toBe(true);
  });

  it("passes when condition is met", async () => {
    const audit = Audit.requiring("AID", "Description", hold);

    await expect(audit.doesHold()).resolves.toBe(true);
    await expect(audit.hasFailed()).resolves.toBe(false);
  });

  it("fails when any condition fails", async () => {
    const audit = Audit.requiring("AID", "Multiple conditions", hold).require(fail).require(hold);

    await expect(audit.doesHold()).resolves.toBe(false);
    await expect(audit.hasFailed()).resolves.toBe(true);
  });

  it("should not throw when is asserted and all conditions hold", async () => {
    const audit = Audit.requiring("AID", "Description", hold);

    await expect(audit.assert()).resolves.toBeUndefined();
  });

  it("should throw an AssertionFailed when is asserted and any condition fails", async () => {
    expect.assertions(2);
    const audit = Audit.requiring("AID", "Description", fail);

    return audit.assert().catch((error: unknown) => {
      expect(error).toBeInstanceOf(AssertionsFailed);
      expect((error as AssertionsFailed).hasAnAssertionFailedWith("AID", "Description")).toBe(true);
    });
  });

  it("should allow conditions that depend on a value", async () => {
    const audit = Audit.requiring("AID", "Description", (value: string) => Promise.resolve(value === "value"));

    await expect(audit.doesHold("value")).resolves.toBe(true);
    await expect(audit.hasFailed("value")).resolves.toBe(false);
  });

  it("should behave like a label", () => {
    const audit = Audit.labeled("AID", "Description");

    expect(audit.getId()).toBe("AID");
    expect(audit.getDescription()).toBe("Description");
    expect(audit.hasLabelId("AID")).toBe(true);
    expect(audit.hasDescription("Description")).toBe(true);
    expect(audit.hasLabel("AID", "Description")).toBe(true);
  });
});
