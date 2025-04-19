import { describe, expect, it } from "@jest/globals";
import { Audit } from "./Audit";
import { AssertionsFailed } from "./AssertionsFailed";

describe("Audit", () => {
  it("fails when condition is not met", async () => {
    const audit = Audit.requiring("AID", "Description", () => Promise.resolve(false));

    await expect(audit.doesHold()).resolves.toBe(false);
    await expect(audit.hasFailed()).resolves.toBe(true);
  });

  it("passes when condition is met", async () => {
    const audit = Audit.requiring("AID", "Description", () => Promise.resolve(true));

    await expect(audit.doesHold()).resolves.toBe(true);
    await expect(audit.hasFailed()).resolves.toBe(false);
  });

  it("fails when any condition fails", async () => {
    const audit = Audit.requiring("AID", "Multiple conditions", () => Promise.resolve(true))
      .require(() => Promise.resolve(false))
      .require(() => Promise.resolve(true));

    await expect(audit.doesHold()).resolves.toBe(false);
    await expect(audit.hasFailed()).resolves.toBe(true);
  });

  it("should not throw when is asserted and all conditions hold", async () => {
    const audit = Audit.requiring("AID", "Description", () => Promise.resolve(true));

    await expect(audit.assert()).resolves.toBeUndefined();
  });

  it("should throw an AssertionFailed when is asserted and any condition fails", async () => {
    expect.assertions(2);
    const audit = Audit.requiring("AID", "Description", () => Promise.resolve(false));

    return audit.assert().catch((error: unknown) => {
      expect(error).toBeInstanceOf(AssertionsFailed);
      expect((error as AssertionsFailed).hasAnAssertionFailedWith("AID", "Description")).toBe(true);
    });
  });
});
