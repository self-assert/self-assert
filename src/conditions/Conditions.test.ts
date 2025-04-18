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
    it("should provide a condition that holds when the value is greater than a number", () => {
      expect(Conditions.greaterThan(0)(0.1)).toBe(true);
      expect(Conditions.greaterThan(0)(0)).toBe(false);
    });

    it("should provide a condition that holds when the value is less than a number", () => {
      expect(Conditions.lessThan(0)(-0.1)).toBe(true);
      expect(Conditions.lessThan(0)(0)).toBe(false);
    });

    it("should provide a condition that holds when the value is greater than or equal to a number", () => {
      expect(Conditions.greaterThanOrEqual(0)(0.1)).toBe(true);
      expect(Conditions.greaterThanOrEqual(0)(0)).toBe(true);
      expect(Conditions.greaterThanOrEqual(0)(-0.1)).toBe(false);
    });

    it("should provide a condition that holds when the value is less than or equal to a number", () => {
      expect(Conditions.lessThanOrEqual(0)(-0.1)).toBe(true);
      expect(Conditions.lessThanOrEqual(0)(0)).toBe(true);
      expect(Conditions.lessThanOrEqual(0)(0.1)).toBe(false);
    });
  });
});
