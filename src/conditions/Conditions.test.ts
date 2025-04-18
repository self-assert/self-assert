import { describe, expect, it } from "@jest/globals";
import { Conditions } from "./Conditions";

describe("Conditions", () => {
  it("should provide a condition that always holds", () => {
    expect(Conditions.hold()).toBe(true);
  });

  it("should provide a condition that always fails", () => {
    expect(Conditions.fail()).toBe(false);
  });

  it("should provide a condition that holds when a string is blank", () => {
    expect(Conditions.isBlank("")).toBe(true);
    expect(Conditions.isBlank(" ")).toBe(true);
    expect(Conditions.isBlank("         ")).toBe(true);
    expect(
      Conditions.isBlank(`
      `)
    ).toBe(true);
    expect(Conditions.isBlank("a")).toBe(false);
  });

  it("should provide a condition that holds when a string is not blank", () => {
    expect(Conditions.isNotBlank("")).toBe(false);
    expect(Conditions.isNotBlank(" ")).toBe(false);
    expect(Conditions.isNotBlank("         ")).toBe(false);
    expect(
      Conditions.isNotBlank(`
      `)
    ).toBe(false);
    expect(Conditions.isNotBlank("a")).toBe(true);
  });

  it("should provide a condition that holds when a value is different from another specified value", () => {
    const differentFrom = Conditions.differentFrom("a");
    expect(differentFrom("a")).toBe(false);
    expect(differentFrom("b")).toBe(true);
    expect(differentFrom("")).toBe(true);
    expect(differentFrom("ab")).toBe(true);
  });
});
