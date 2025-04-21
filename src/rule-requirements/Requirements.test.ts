import { describe, expect, it } from "@jest/globals";
import { Requirements } from "./Requirements";

describe("Requirements", () => {
  it("should provide a requirement that always holds", () => {
    expect(Requirements.hold()).toBe(true);
  });

  it("should provide a requirement that always fails", () => {
    expect(Requirements.fail()).toBe(false);
  });

  it("should provide a requirement that holds when a string is blank", () => {
    expect(Requirements.isBlank("")).toBe(true);
    expect(Requirements.isBlank(" ")).toBe(true);
    expect(Requirements.isBlank("         ")).toBe(true);
    expect(
      Requirements.isBlank(`
      `)
    ).toBe(true);
    expect(Requirements.isBlank("a")).toBe(false);
  });

  it("should provide a requirement that holds when a string is not blank", () => {
    expect(Requirements.isNotBlank("")).toBe(false);
    expect(Requirements.isNotBlank(" ")).toBe(false);
    expect(Requirements.isNotBlank("         ")).toBe(false);
    expect(
      Requirements.isNotBlank(`
      `)
    ).toBe(false);
    expect(Requirements.isNotBlank("a")).toBe(true);
  });

  it("should provide a requirement that holds when a value is different from another specified value", () => {
    const differentFrom = Requirements.differentFrom("a");
    expect(differentFrom("a")).toBe(false);
    expect(differentFrom("b")).toBe(true);
    expect(differentFrom("")).toBe(true);
    expect(differentFrom("ab")).toBe(true);
  });

  it("should provide a requirement that holds when a value is in a set of values", () => {
    const isIn = Requirements.isIn("a", "b", "c");
    expect(isIn("a")).toBe(true);
    expect(isIn("b")).toBe(true);
    expect(isIn("c")).toBe(true);
    expect(isIn("d")).toBe(false);
  });

  it("should provide a requirement that holds when a value is not in a set of values", () => {
    const isNotIn = Requirements.isNotIn("a", "b", "c");
    expect(isNotIn("a")).toBe(false);
    expect(isNotIn("b")).toBe(false);
    expect(isNotIn("c")).toBe(false);
    expect(isNotIn("d")).toBe(true);
  });
});
