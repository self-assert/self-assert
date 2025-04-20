/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuditRule } from "./AuditRule";
import { RuleEvaluation } from "./RuleEvaluation";
import { RulesBroken } from "./RulesBroken";
import type { LabeledRule, SelfContainedAssertion } from "./types";

type nfjfr = Pick<SelfContainedAssertion, "collectFailureInto">;

/**
 * Runs all assertions and throws an error if any has failed.
 * The failed assertions are included in the error.
 *
 * @see {@link SelfContainedAssertion}, {@link RulesBroken}
 */
export class Ruleset {
  static assert(assertion: nfjfr) {
    this.assertAll([assertion]);
  }

  static assertAll(assertions: nfjfr[]) {
    new this(assertions, []).run();
  }

  static mustHold(...rules: (AuditRule | RuleEvaluation<Promise<boolean>, any>)[]) {
    return new this([], rules).mustHold();
  }

  constructor(
    protected assertions: nfjfr[],
    protected auditRules: (AuditRule | RuleEvaluation<Promise<boolean>, any>)[]
  ) {}

  async mustHold(): Promise<void> {
    const brokenRules: LabeledRule[] = [];
    for (const rule of this.auditRules) {
      await rule.collectFailureInto(brokenRules);
    }

    this.throwIfNotEmpty(brokenRules);
  }

  /**
   * @throws {RulesBroken} if any assertion has failed
   */
  run(): void {
    const brokenRules = this.failedAssertions();

    this.throwIfNotEmpty(brokenRules);
  }

  protected failedAssertions(): LabeledRule[] {
    const failed: LabeledRule[] = [];
    this.assertions.forEach((assertion) => assertion.collectFailureInto(failed));
    return failed;
  }

  protected throwIfNotEmpty(brokenRules: LabeledRule[]) {
    if (brokenRules.length > 0) throw new RulesBroken(brokenRules);
  }
}
