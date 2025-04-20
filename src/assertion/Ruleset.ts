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
    new this(assertions).run();
  }

  constructor(protected assertions: SelfContainedAssertion[]) {}

  /**
   * @throws {RulesBroken} if any assertion has failed
   */
  run(): void {
    const failedAssertions = this.failedAssertions();

    if (failedAssertions.length > 0) throw new RulesBroken(failedAssertions);
  }

  protected failedAssertions(): LabeledRule[] {
    const failed: LabeledRule[] = [];
    this.assertions.forEach((assertion) => assertion.collectFailureInto(failed));
    return failed;
  }
}
