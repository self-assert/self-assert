import { describe, expect, it } from "@jest/globals";
import { Requirements } from "../Requirements";

describe("Numbers", () => {
  it("should provide a condition that holds when the value is greater than a number", () => {
    const greaterThan0 = Requirements.greaterThan(0);
    expect(greaterThan0(0.1)).toBe(true);
    expect(greaterThan0(0)).toBe(false);
  });

  it("should provide a condition that holds when the value is less than a number", () => {
    const lessThan0 = Requirements.lessThan(0);
    expect(lessThan0(-0.1)).toBe(true);
    expect(lessThan0(0)).toBe(false);
  });

  it("should provide a condition that holds when the value is greater than or equal to a number", () => {
    const greaterThanOrEqual0 = Requirements.greaterThanOrEqual(0);
    expect(greaterThanOrEqual0(0.1)).toBe(true);
    expect(greaterThanOrEqual0(0)).toBe(true);
    expect(greaterThanOrEqual0(-0.1)).toBe(false);
  });

  it("should provide a condition that holds when the value is less than or equal to a number", () => {
    const lessThanOrEqualTo0 = Requirements.lessThanOrEqual(0);
    expect(lessThanOrEqualTo0(-0.1)).toBe(true);
    expect(lessThanOrEqualTo0(0)).toBe(true);
    expect(lessThanOrEqualTo0(0.1)).toBe(false);
  });

  it("should provide a condition that holds when the value is between two numbers", () => {
    const between1and2 = Requirements.between(1, 2);
    expect(between1and2(0.9)).toBe(false);
    expect(between1and2(1)).toBe(true);
    expect(between1and2(1.5)).toBe(true);
    expect(between1and2(2)).toBe(true);
    expect(between1and2(2.1)).toBe(false);
  });

  it("should provide a condition that holds when the value is an integer", () => {
    const { isInteger } = Requirements;
    expect(isInteger(0)).toBe(true);
    expect(isInteger(1)).toBe(true);
    expect(isInteger(1.1)).toBe(false);
    expect(isInteger(NaN)).toBe(false);
    expect(isInteger(Infinity)).toBe(false);
  });

  it("should provide a condition that holds when the value is a float", () => {
    const { isFloat } = Requirements;
    expect(isFloat(0)).toBe(false);
    expect(isFloat(1)).toBe(false);
    expect(isFloat(1.1)).toBe(true);
    expect(isFloat(NaN)).toBe(false);
    expect(isFloat(Infinity)).toBe(false);
  });

  it("should provide a condition that holds when the value is positive", () => {
    const { isPositive } = Requirements;
    expect(isPositive(0)).toBe(false);
    expect(isPositive(0.1)).toBe(true);
    expect(isPositive(-0.1)).toBe(false);
  });

  it("should provide a condition that holds when the value is negative", () => {
    const { isNegative } = Requirements;
    expect(isNegative(0)).toBe(false);
    expect(isNegative(0.1)).toBe(false);
    expect(isNegative(-0.1)).toBe(true);
  });

  it("should provide a condition that holds when the value is a positive integer", () => {
    const { isPositiveInteger } = Requirements;
    expect(isPositiveInteger(0)).toBe(false);
    expect(isPositiveInteger(1)).toBe(true);
    expect(isPositiveInteger(2)).toBe(true);
    expect(isPositiveInteger(1.1)).toBe(false);
    expect(isPositiveInteger(-1)).toBe(false);
  });

  it("should provide a condition that holds when the value is a negative integer", () => {
    const { isNegativeInteger } = Requirements;
    expect(isNegativeInteger(0)).toBe(false);
    expect(isNegativeInteger(-1)).toBe(true);
    expect(isNegativeInteger(-2)).toBe(true);
    expect(isNegativeInteger(1.1)).toBe(false);
    expect(isNegativeInteger(1)).toBe(false);
  });

  it("should provide a condition that holds when the value is an integer between two numbers", () => {
    const isIntegerBetween = Requirements.isIntegerBetween(1, 2);
    expect(isIntegerBetween(0)).toBe(false);
    expect(isIntegerBetween(1)).toBe(true);
    expect(isIntegerBetween(1.1)).toBe(false);
    expect(isIntegerBetween(2)).toBe(true);
    expect(isIntegerBetween(2.1)).toBe(false);
    expect(isIntegerBetween(3)).toBe(false);
  });
});
