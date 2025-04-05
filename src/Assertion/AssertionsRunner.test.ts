import { describe, expect, it } from "@jest/globals";

import { AssertionsRunner } from "./AssertionsRunner";
import { AssertionsFailed } from "./AssertionsFailed";

import { TestObjectsBucket } from "@tests/TestObjectsBucket";
import { expectToBeAssertionsFailed } from "@tests/jest.setup";

describe("AssertionsRunner", () => {
  it("should not throw on assertion that holds", () => {
    expect(() => AssertionsRunner.assert(TestObjectsBucket.holdingAssertion())).not.toThrow();
  });

  it("should throw on assertion that does not hold", () => {
    expect(() => AssertionsRunner.assert(TestObjectsBucket.defaultFailingAssertion())).toFailAssertion(
      TestObjectsBucket.defaultFailingAssertionAID,
      TestObjectsBucket.defaultFailingAssertionDescription
    );
  });

  it("should only throw assertions that do not hold", (done) => {
    const assertions = [
      TestObjectsBucket.failingAssertion("AID.1", "Description 1"),
      TestObjectsBucket.holdingAssertion(),
      TestObjectsBucket.failingAssertion("AID.2", "Description 2"),
    ];
    try {
      AssertionsRunner.assertAll(assertions);
      done("Should have thrown");
    } catch (error) {
      expectToBeAssertionsFailed(error);
      expect(error.hasOneAssertionFailedWith("AID.1", "Description 1")).toBe(true);
      expect(error.hasOneAssertionFailedWith("AID.2", "Description 2")).toBe(true);
      expect(
        error.hasOneAssertionFailedWith(
          TestObjectsBucket.defaultHoldingAssertionAID,
          TestObjectsBucket.defaultHoldingAssertionDescription
        )
      ).toBe(false);
      done();
    }
  });
});
