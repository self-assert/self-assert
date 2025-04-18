import { describe, expect, it } from "@jest/globals";
import { Conditions } from "./Conditions";

describe("Conditions", () => {
  it("should provide a condition that always holds", () => {
    expect(Conditions.hold()).toBe(true);
  });

  it("should provide a condition that always fails", () => {
    expect(Conditions.fail()).toBe(false);
  });

  describe("Numbers", () => {
    it("should provide a condition that holds when the number is greater than a value", () => {
      expect(Conditions.greaterThan(0)(0.1)).toBe(true);
      expect(Conditions.greaterThan(0)(0)).toBe(false);
    });
  });
});
