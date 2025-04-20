import { describe, expect, it } from "@jest/globals";

import { Ruleset } from "./Ruleset";

import { TestObjectsBucket } from "@testing-support/TestObjectsBucket";
import { expectToBeAssertionsFailed } from "@testing-support/jest.setup";
import { Assertion } from ".";
import { Conditions } from "@/conditions";

describe("Ruleset", () => {
  it("should not throw on assertion that holds", () => {
    expect(() => Ruleset.assert(TestObjectsBucket.holdingAssertion())).not.toThrow();
  });

  it("should throw on assertion that does not hold", () => {
    expect(() => Ruleset.assert(TestObjectsBucket.defaultFailingAssertion())).toFailAssertion(
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
      Ruleset.assertAll(assertions);
      done("Should have thrown");
    } catch (error) {
      expectToBeAssertionsFailed(error);
      expect(error.hasAnAssertionFailedWith("AID.1", "Description 1")).toBe(true);
      expect(error.hasAnAssertionFailedWith("AID.2", "Description 2")).toBe(true);
      expect(
        error.hasAnAssertionFailedWith(
          TestObjectsBucket.defaultHoldingAssertionAID,
          TestObjectsBucket.defaultHoldingAssertionDescription
        )
      ).toBe(false);
      done();
    }
  });

  it("should accept assertion evaluations", () => {
    const assertions = [Assertion.requiring("name", "Name should not be empty", Conditions.isNotEmpty).evaluateFor("")];

    expect(() => Ruleset.assertAll(assertions)).toFailAssertion("name", "Name should not be empty");
  });
});
