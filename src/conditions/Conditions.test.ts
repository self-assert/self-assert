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

  it("should provide a condition that holds when a value is in a set of values", () => {
    const isIn = Conditions.isIn("a", "b", "c");
    expect(isIn("a")).toBe(true);
    expect(isIn("b")).toBe(true);
    expect(isIn("c")).toBe(true);
    expect(isIn("d")).toBe(false);
  });

  it("should provide a condition that holds when a value is not in a set of values", () => {
    const isNotIn = Conditions.isNotIn("a", "b", "c");
    expect(isNotIn("a")).toBe(false);
    expect(isNotIn("b")).toBe(false);
    expect(isNotIn("c")).toBe(false);
    expect(isNotIn("d")).toBe(true);
  });
});
