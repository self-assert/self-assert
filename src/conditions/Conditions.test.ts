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
      const greaterThan0 = Conditions.greaterThan(0);
      expect(greaterThan0(0.1)).toBe(true);
      expect(greaterThan0(0)).toBe(false);
    });

    it("should provide a condition that holds when the value is less than a number", () => {
      const lessThan0 = Conditions.lessThan(0);
      expect(lessThan0(-0.1)).toBe(true);
      expect(lessThan0(0)).toBe(false);
    });

    it("should provide a condition that holds when the value is greater than or equal to a number", () => {
      const greaterThanOrEqual0 = Conditions.greaterThanOrEqual(0);
      expect(greaterThanOrEqual0(0.1)).toBe(true);
      expect(greaterThanOrEqual0(0)).toBe(true);
      expect(greaterThanOrEqual0(-0.1)).toBe(false);
    });

    it("should provide a condition that holds when the value is less than or equal to a number", () => {
      const lessThanOrEqualTo0 = Conditions.lessThanOrEqual(0);
      expect(lessThanOrEqualTo0(-0.1)).toBe(true);
      expect(lessThanOrEqualTo0(0)).toBe(true);
      expect(lessThanOrEqualTo0(0.1)).toBe(false);
    });

    it("should provide a condition that holds when the value is between two numbers", () => {
      const between1and2 = Conditions.between(1, 2);
      expect(between1and2(0.9)).toBe(false);
      expect(between1and2(1)).toBe(true);
      expect(between1and2(1.5)).toBe(true);
      expect(between1and2(2)).toBe(true);
      expect(between1and2(2.1)).toBe(false);
    });
  });
});
