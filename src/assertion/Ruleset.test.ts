import { describe, expect, it } from "@jest/globals";

import { Ruleset } from "./Ruleset";

import { TestObjectsBucket } from "@testing-support/TestObjectsBucket";
import { expectToBeRulesBroken } from "@testing-support/jest.setup";
import { Assertion } from ".";
import { Conditions } from "@/conditions";
import { AuditRule } from "./AuditRule";

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

    expect(() => Ruleset.assertAll(assertions)).toFailAssertion("name", "Name should not be empty");
  });

  it("should accept an audit rule", async () => {
    const rule = AuditRule.requiring("name", "Name should not be empty", () =>
      Promise.resolve(Conditions.isNotEmpty("a"))
    );

    await expect(Ruleset.mustHold(rule)).resolves.not.toThrow();
  });

  it("should accept a list of audit rules", async () => {
    expect.assertions(3);
    const nameLengthCondition = (name: string) => Promise.resolve(Conditions.hasAtLeast(3)(name));
    const rule1 = AuditRule.requiring("name.1", "Desc 1", nameLengthCondition);
    const rule2 = AuditRule.requiring("name.2", "Desc 2", nameLengthCondition);

    return Ruleset.mustHold(rule1.evaluateFor("ab"), rule2.evaluateFor("ba")).catch((error: unknown) => {
      expectToBeRulesBroken(error);
      expect(error.hasRuleBrokenWith("name.1", "Desc 1")).toBe(true);
      expect(error.hasRuleBrokenWith("name.2", "Desc 2")).toBe(true);
    });
  });
});
