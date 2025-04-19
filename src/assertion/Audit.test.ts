import { describe, expect, it } from "@jest/globals";
import { Audit } from "./Audit";

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
});
