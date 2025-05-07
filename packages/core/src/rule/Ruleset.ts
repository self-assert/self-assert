import { RulesBroken } from "./RulesBroken";
import type {
  LabeledRule,
  SelfContainedAssertion,
  SelfContainedAssertions,
  SelfContainedRule,
  SelfContainedRules,
} from "./types";

/**
 * Runs all rules and throws an error if any has failed.
 * The failed rules are included in the error.
 *
 * @category Rules
 */
export class Ruleset {
  /**
   * Evaluates all assertions **synchronously** and throws an error if any has failed.
   *
   * @throws {@link RulesBroken} if any rule has failed.
   *
   * @example
   * {@includeCode ../../examples/snippets/rules.ts#ruleset-ensureAll}
   */
  static ensureAll(...assertions: SelfContainedAssertions[]): void {
    new this(assertions.flat(), []).ensure();
  }

  /**
   * Evaluates all rules **asynchronously** and throws an error if any has failed.
   *
   * @throws {@link RulesBroken} if any rule has failed
   *
   * @example
   * {@includeCode ../../examples/snippets/rules.ts#email-unique,ruleset-workOn}
   */
  static workOn(...rules: SelfContainedRules[]): Promise<void> {
    return new this([], rules.flat()).mustHold();
  }

  constructor(
    protected assertions: SelfContainedAssertion[],
    protected rules: SelfContainedRule[]
  ) {}

  async mustHold(): Promise<void> {
    const brokenRules = await this.brokenRules();

    this.throwIfNotEmpty(brokenRules);
  }

  ensure(): void {
    const brokenRules = this.failedAssertions();

    this.throwIfNotEmpty(brokenRules);
  }

  protected failedAssertions(): LabeledRule[] {
    const failed: LabeledRule[] = [];
    this.assertions.forEach((assertion) =>
      assertion.collectFailureInto(failed)
    );
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
