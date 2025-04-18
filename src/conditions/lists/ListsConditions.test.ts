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
    const hasMoreThan1 = Conditions.hasMoreThan(1);
    expect(hasMoreThan1([] as string[])).toBe(false);
    expect(hasMoreThan1(["a"])).toBe(false);
    expect(hasMoreThan1(["a", "b"])).toBe(true);
    expect(hasMoreThan1(["a", "b", "c"])).toBe(true);
    expect(hasMoreThan1("abcd")).toBe(true);
  });

  it("should provide a condition that holds when the list has less than a number of elements", () => {
    const hasLessThan3 = Conditions.hasLessThan(3);
    expect(hasLessThan3([] as string[])).toBe(true);
    expect(hasLessThan3(["a"])).toBe(true);
    expect(hasLessThan3("a")).toBe(true);
    expect(hasLessThan3(["a", "b"])).toBe(true);
    expect(hasLessThan3(["a", "b", "c"])).toBe(false);
    expect(hasLessThan3("abcd")).toBe(false);
  });

  it("should provide a condition that holds when the list has at most a number of elements", () => {
    const hasAtMost2 = Conditions.hasAtMost(2);
    expect(hasAtMost2([] as string[])).toBe(true);
    expect(hasAtMost2(["a"])).toBe(true);
    expect(hasAtMost2("a")).toBe(true);
    expect(hasAtMost2(["a", "b"])).toBe(true);
    expect(hasAtMost2(["a", "b", "c"])).toBe(false);
    expect(hasAtMost2("abcd")).toBe(false);
  });

  it("should provide a condition that holds when the list has at least a number of elements", () => {
    const hasAtLeast3 = Conditions.hasAtLeast(3);
    expect(hasAtLeast3([] as string[])).toBe(false);
    expect(hasAtLeast3(["a"])).toBe(false);
    expect(hasAtLeast3("a")).toBe(false);
    expect(hasAtLeast3(["a", "b"])).toBe(false);
    expect(hasAtLeast3(["a", "b", "c"])).toBe(true);
    expect(hasAtLeast3("abcd")).toBe(true);
  });

  it("should provide a condition that holds when the list has exactly a number of elements", () => {
    const hasExactly2 = Conditions.hasExactly(2);
    expect(hasExactly2([] as string[])).toBe(false);
    expect(hasExactly2(["a"])).toBe(false);
    expect(hasExactly2("a")).toBe(false);
    expect(hasExactly2(["a", "b"])).toBe(true);
    expect(hasExactly2(["a", "b", "c"])).toBe(false);
    expect(hasExactly2("abcd")).toBe(false);
  });

  it("should provide a condition that holds when all elements of the list satisfy a condition", () => {
    const allSatisfy = Conditions.allSatisfy(Conditions.isInteger);
    expect(allSatisfy([] as number[])).toBe(true);
    expect(allSatisfy([0])).toBe(true);
    expect(allSatisfy([1, 2, 3])).toBe(true);
    expect(allSatisfy([1, 2, "3", 4])).toBe(false);
    expect(allSatisfy([1, 2, 3, 4.1])).toBe(false);

    expect(Conditions.allSatisfy((str: string) => str === "a")("aaa")).toBe(true);
  });

  it("should provide a condition that holds when any element of the list satisfies a condition", () => {
    const anySatisfy = Conditions.anySatisfy(Conditions.isInteger);
    expect(anySatisfy([] as number[])).toBe(false);
    expect(anySatisfy([0])).toBe(true);
    expect(anySatisfy([1, 2, 3])).toBe(true);
    expect(anySatisfy([1, 2, "3", 4])).toBe(true);
    expect(anySatisfy([1, 2, 3, 4.1])).toBe(true);
    expect(anySatisfy(["1", "2", "3", "4"])).toBe(false);
  });

  it("should provide a condition that holds when no element of the list satisfies a condition", () => {
    const noneSatisfy = Conditions.noneSatisfy(Conditions.isInteger);
    expect(noneSatisfy([] as number[])).toBe(true);
    expect(noneSatisfy([0])).toBe(false);
    expect(noneSatisfy([1, 2, 3])).toBe(false);
    expect(noneSatisfy([1, 2, "3", 4])).toBe(false);
    expect(noneSatisfy([1, 2, 3, 4.1])).toBe(false);
    expect(noneSatisfy(["1", "2", "3", "4"])).toBe(true);
  });
});
