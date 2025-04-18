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
      const lessThanOrEqualTo0 = Conditions.lessThanOrEqual(0);
      expect(lessThanOrEqualTo0(-0.1)).toBe(true);
      expect(lessThanOrEqualTo0(0)).toBe(true);
      expect(lessThanOrEqualTo0(0.1)).toBe(false);
    });

    it("should provide a condition that holds when the value is between two numbers", () => {
      const between0and1 = Conditions.between(0, 1);
      expect(between0and1(0.5)).toBe(true);
      expect(between0and1(-0.1)).toBe(false);
      expect(between0and1(1.1)).toBe(false);
      expect(between0and1(0)).toBe(true);
      expect(between0and1(1)).toBe(true);
    });
  });
});
