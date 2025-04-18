import { describe, expect, it } from "@jest/globals";

import { Conditions } from "../Conditions";

describe("Lists", () => {
  it("should provide a condition that holds when the list is empty", () => {
    const { isEmpty } = Conditions;
    expect(isEmpty("")).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty("d")).toBe(false);
    expect(isEmpty([0])).toBe(false);
  });

  it("should provide a condition that holds when the list is not empty", () => {
    const { isNotEmpty } = Conditions;
    expect(isNotEmpty("")).toBe(false);
    expect(isNotEmpty([])).toBe(false);
    expect(isNotEmpty("d")).toBe(true);
    expect(isNotEmpty([0])).toBe(true);
  });

  it("should provide a condition that holds when the list includes an element", () => {
    const includes = Conditions.includes("a");
    expect(includes([] as string[])).toBe(false);
    expect(includes(["a"])).toBe(true);
    expect(includes(["b"])).toBe(false);
    expect(includes(["b", "a"])).toBe(true);
    expect(includes("bbbabbb")).toBe(true);
  });

  it("should provide a condition that holds when the list does not include an element", () => {
    const doesNotInclude = Conditions.doesNotInclude("a");
    expect(doesNotInclude([] as string[])).toBe(true);
    expect(doesNotInclude(["a"])).toBe(false);
    expect(doesNotInclude(["b"])).toBe(true);
    expect(doesNotInclude(["b", "a"])).toBe(false);
    expect(doesNotInclude("bbbabbb")).toBe(false);
  });

  it("should provide a condition that holds when the list has more than a number of elements", () => {
    const hasMoreThan = Conditions.hasMoreThan(2);
    expect(hasMoreThan([] as string[])).toBe(false);
    expect(hasMoreThan(["a"])).toBe(false);
    expect(hasMoreThan(["a", "b"])).toBe(false);
    expect(hasMoreThan(["a", "b", "c"])).toBe(true);
    expect(hasMoreThan("abcd")).toBe(true);
  });

  it("should provide a condition that holds when the list has less than a number of elements", () => {
    const hasLessThan = Conditions.hasLessThan(2);
    expect(hasLessThan([] as string[])).toBe(true);
    expect(hasLessThan(["a"])).toBe(true);
    expect(hasLessThan("a")).toBe(true);
    expect(hasLessThan(["a", "b"])).toBe(false);
    expect(hasLessThan(["a", "b", "c"])).toBe(false);
    expect(hasLessThan("abcd")).toBe(false);
  });

  it("should provide a condition that holds when the list has up to a number of elements", () => {
    const hasUpTo = Conditions.hasUpTo(2);
    expect(hasUpTo([] as string[])).toBe(true);
    expect(hasUpTo(["a"])).toBe(true);
    expect(hasUpTo("a")).toBe(true);
    expect(hasUpTo(["a", "b"])).toBe(true);
    expect(hasUpTo(["a", "b", "c"])).toBe(false);
    expect(hasUpTo("abcd")).toBe(false);
  });

  it("should provide a condition that holds when the list has exactly a number of elements", () => {
    const hasExactly = Conditions.hasExactly(2);
    expect(hasExactly([] as string[])).toBe(false);
    expect(hasExactly(["a"])).toBe(false);
    expect(hasExactly("a")).toBe(false);
    expect(hasExactly(["a", "b"])).toBe(true);
    expect(hasExactly(["a", "b", "c"])).toBe(false);
    expect(hasExactly("abcd")).toBe(false);
  });
});
