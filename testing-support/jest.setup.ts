import { expect } from "@jest/globals";

import { AssertionId, AssertionsFailed } from "@/assertion";

export function expectToBeAssertionsFailed(error: unknown): asserts error is AssertionsFailed {
  expect(error).toBeInstanceOf(AssertionsFailed);
}

expect.extend({
  toFailAssertion(closure: () => void, assertionId: AssertionId, description: string) {
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
});
