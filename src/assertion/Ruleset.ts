import { AuditRule, AuditRuleEvaluation } from "./AuditRule";
import { RulesBroken } from "./RulesBroken";
import type { LabeledRule, SelfContainedAssertion } from "./types";

/**
 * Runs all assertions and throws an error if any has failed.
 * The failed assertions are included in the error.
 *
 * @see {@link SelfContainedAssertion}, {@link RulesBroken}
 */
export class Ruleset {
  static assert(assertion: SelfContainedAssertion) {
    this.assertAll([assertion]);
  }

  static assertAll(assertions: SelfContainedAssertion[]) {
    new this(assertions, []).run();
  }

  static mustHold(...rules: (AuditRule | AuditRuleEvaluation<any>)[]) {
    return new this([], rules).mustHold();
  }

  constructor(
    protected assertions: SelfContainedAssertion[],
    protected auditRules: (AuditRule | AuditRuleEvaluation<any>)[]
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
