import { expect } from "@jest/globals";
import { AssertionsFailed } from "../src/Assertion/AssertionsFailed";

expect.extend({
  toFailAssertion(closure, assertionId, description) {
    try {
      closure();
      return {
        message: () => `Should have thrown ${AssertionsFailed.name}`,
        pass: false,
      };
    } catch (error) {
      if (error instanceof AssertionsFailed) {
        return {
          message: () => `Should only have thrown ${AssertionsFailed.name} with '${assertionId}' and '${description}'.`,
          pass: error.hasOnlyOneAssertionFailedWith(assertionId, description),
        };
      } else throw error;
    }
  },
});
