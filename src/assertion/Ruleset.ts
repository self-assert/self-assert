import { RulesBroken } from "./RulesBroken";
import type { CollectableRule, LabeledRule } from "./types";

/**
 * Runs all assertions and throws an error if any has failed.
 * The failed assertions are included in the error.
 *
 * @see {@link RulesBroken}
 */
export class Ruleset {
  static assert(assertion: CollectableRule<void, void>) {
    this.assertAll([assertion]);
  }

  static assertAll(assertions: CollectableRule<void, void>[]) {
    new this(assertions, []).run();
  }

  static mustHold(...rules: CollectableRule<void, Promise<void>>[]) {
    return new this([], rules).mustHold();
  }

  constructor(
    protected assertions: CollectableRule<void, void>[],
    protected auditRules: CollectableRule<void, Promise<void>>[]
  ) {}

  /**
   * @throws {RulesBroken} if any audit rule has failed
   */
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
