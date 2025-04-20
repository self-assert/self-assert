import { expect } from "@jest/globals";
import type { MatcherFunction } from "expect";

import { AssertionsFailed } from "@/assertion";
import type { Assertion, LabelId } from "@/assertion";

export function expectToBeAssertionsFailed(error: unknown): asserts error is AssertionsFailed {
  expect(error).toBeInstanceOf(AssertionsFailed);
}

function isAssertionLike(actual: unknown): actual is Assertion<unknown> {
  return (
    typeof actual === "object" &&
    actual !== null &&
    "doesHold" in actual &&
    typeof actual.doesHold === "function" &&
    "hasFailed" in actual &&
    typeof actual.hasFailed === "function"
  );
}

const expectToHoldWith: MatcherFunction<[value: unknown]> = function (actual, value) {
  if (!isAssertionLike(actual)) {
    return {
      pass: false,
      message: () => `Expected value to be an Assertion-like object, but received: ${typeof actual}`,
    };
  }

  const pass = actual.doesHold(value) && !actual.hasFailed(value);
  return {
    message: () => `Expected assertion to ${pass ? "hold" : "fail"} with '${JSON.stringify(value)}'.`,
    pass: pass,
  };
};

const expectToFailWith: MatcherFunction<[value: unknown]> = function (actual, value) {
  if (!isAssertionLike(actual)) {
    return {
      pass: false,
      message: () => `Expected value to be an Assertion-like object, but received: ${typeof actual}`,
    };
  }

  const pass = !actual.doesHold(value) && actual.hasFailed(value);
  return {
    message: () => `Expected assertion to ${pass ? "fail" : "hold"} with '${JSON.stringify(value)}'.`,
    pass: pass,
  };
};

expect.extend({
  toFailAssertion(closure: () => void, assertionId: LabelId, description: string) {
    try {
      closure();
      return {
        message: () => `Should have thrown ${AssertionsFailed.name}`,
        pass: false,
      };
    } catch (error) {
      expectToBeAssertionsFailed(error);
      return {
        message: () => `Should only have thrown ${AssertionsFailed.name} with '${assertionId}' and '${description}'.`,
        pass: error.hasOnlyOneAssertionFailedWith(assertionId, description),
      };
    }
  },
  toHoldWith: expectToHoldWith,
  toFailWith: expectToFailWith,
  toHold(actual) {
    return expectToHoldWith.call(this, actual, undefined);
  },
  toFail(actual) {
    return expectToFailWith.call(this, actual, undefined);
  },
});
