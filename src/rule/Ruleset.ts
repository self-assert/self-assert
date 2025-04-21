import { RulesBroken } from "./RulesBroken";
import type { LabeledRule, SelfContainedAssertion, SelfContainedRule, SelfContainedRules } from "./types";

type SelfContainedAssertions = SelfContainedAssertion | SelfContainedAssertion[];

/**
 * Runs all assertions and throws an error if any has failed.
 * The failed assertions are included in the error.
 *
 * @see {@link RulesBroken}
 */
export class Ruleset {
  /**
   * @throws {RulesBroken} if any rule has failed
   */
  static ensureAll(...assertions: SelfContainedAssertions[]): void {
    new this(assertions.flat(), []).ensure();
  }

  /**
   * @throws {RulesBroken} if any rule has failed
   */
  static workOn(...rules: SelfContainedRules[]): Promise<void> {
    return new this([], rules.flat()).mustHold();
  }

  constructor(protected assertions: SelfContainedAssertion[], protected rules: SelfContainedRule[]) {}

  async mustHold(): Promise<void> {
    const brokenRules = await this.brokenRules();

    this.throwIfNotEmpty(brokenRules);
  }

  /**
   * @throws {RulesBroken} if any assertion has failed
   */
  ensure(): void {
    const brokenRules = this.failedAssertions();

    this.throwIfNotEmpty(brokenRules);
  }

  protected failedAssertions(): LabeledRule[] {
    const failed: LabeledRule[] = [];
    this.assertions.forEach((assertion) => assertion.collectFailureInto(failed));
    return failed;
  }

  protected async brokenRules(): Promise<LabeledRule[]> {
    const brokenRules: LabeledRule[] = [];
    for (const rule of this.rules) {
      await rule.collectFailureInto(brokenRules);
    }
    return brokenRules;
  }

  protected throwIfNotEmpty(brokenRules: LabeledRule[]) {
    if (brokenRules.length > 0) throw new RulesBroken(brokenRules);
  }
}
