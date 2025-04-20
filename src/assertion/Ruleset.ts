import { RulesBroken } from "./RulesBroken";
import type { CollectableRule, LabeledRule } from "./types";

type OneOrMany<Type> = Type | Type[];

type SelfContainedAssertion = CollectableRule<void, void>;
type SelfContainedAssertions = OneOrMany<SelfContainedAssertion>;
type SelfContainedAuditRule = CollectableRule<void, Promise<void>>;
type SelfContainedAuditRules = OneOrMany<SelfContainedAuditRule>;

// type SelfContainedRule = SelfContainedAuditRule | SelfContainedAssertion;
// type SelfContainedRules = OneOrMany<SelfContainedRule>;

/**
 * Runs all assertions and throws an error if any has failed.
 * The failed assertions are included in the error.
 *
 * @see {@link RulesBroken}
 */
export class Ruleset {
  static ensureAll(...assertions: SelfContainedAssertions[]): void {
    new this(assertions.flat(), []).ensure();
  }

  static auditAll(...rules: SelfContainedAuditRules[]): Promise<void> {
    return new this([], rules.flat()).audit();
  }

  constructor(protected assertions: SelfContainedAssertion[], protected rules: SelfContainedAuditRule[]) {}

  /**
   * @throws {RulesBroken} if any audit rule has failed
   */
  async audit(): Promise<void> {
    const brokenRules: LabeledRule[] = [];
    for (const rule of this.rules) {
      await rule.collectFailureInto(brokenRules);
    }

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

  protected throwIfNotEmpty(brokenRules: LabeledRule[]) {
    if (brokenRules.length > 0) throw new RulesBroken(brokenRules);
  }
}
