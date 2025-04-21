import { describe, expect, it } from "@jest/globals";

import { Ruleset } from "./Ruleset";

import { TestObjectsBucket } from "@testing-support/TestObjectsBucket";
import { expectToBeRulesBroken } from "@testing-support/jest.setup";
import { Assertion } from ".";
import { Conditions } from "@/rule-requirements";
import { Inquiry } from "./Inquiry";

describe("Ruleset", () => {
  it("should not throw on assertion that holds", () => {
    expect(() => Ruleset.ensureAll(TestObjectsBucket.holdingAssertion())).not.toThrow();
  });

  it("should throw on assertion that does not hold", () => {
    expect(() => Ruleset.ensureAll(TestObjectsBucket.defaultFailingAssertion())).toFailAssertion(
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
      Ruleset.ensureAll(assertions);
      done("Should have thrown");
    } catch (error) {
      expectToBeRulesBroken(error);
      expect(error.hasRuleBrokenWith("AID.1", "Description 1")).toBe(true);
      expect(error.hasRuleBrokenWith("AID.2", "Description 2")).toBe(true);
      expect(
        error.hasRuleBrokenWith(
          TestObjectsBucket.defaultHoldingAssertionAID,
          TestObjectsBucket.defaultHoldingAssertionDescription
        )
      ).toBe(false);
      done();
    }
  });

  it("should accept assertion evaluations", () => {
    const assertions = [Assertion.requiring("name", "Name should not be empty", Conditions.isNotEmpty).evaluateFor("")];

    expect(() => Ruleset.ensureAll(assertions)).toFailAssertion("name", "Name should not be empty");
  });

  it("should accept an inquiry", async () => {
    const rule = Inquiry.requiring("name", "Name should not be empty", () =>
      Promise.resolve(Conditions.isNotEmpty("a"))
    );

    await expect(Ruleset.workOn(rule)).resolves.not.toThrow();
  });

  it("should accept a list of inquiries", async () => {
    expect.assertions(3);
    const nameLengthCondition = (name: string) => Promise.resolve(Conditions.hasAtLeast(3)(name));
    const rule1 = Inquiry.requiring("name.1", "Desc 1", nameLengthCondition);
    const rule2 = Inquiry.requiring("name.2", "Desc 2", nameLengthCondition);

    return Ruleset.workOn(rule1.evaluateFor("ab"), rule2.evaluateFor("ba")).catch((error: unknown) => {
      expectToBeRulesBroken(error);
      expect(error.hasRuleBrokenWith("name.1", "Desc 1")).toBe(true);
      expect(error.hasRuleBrokenWith("name.2", "Desc 2")).toBe(true);
    });
  });
});
