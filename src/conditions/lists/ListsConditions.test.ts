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
});
