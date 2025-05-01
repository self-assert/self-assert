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
 * @see {@link RulesBroken}
 *
 * @category Rules
 */
export class Ruleset {
  /**
   * Evaluates all assertions **synchronously** and throws an error if any has failed.
   *
   * @throws if any rule has failed.
   *
   * @example
   * ```ts
   * const firstNameNotEmptyAssertion = Assertion.requiring(
   *    "firstName",
   *    firstNameNotEmptyDescription,
   *    Requirements.isNotEmpty
   * );
   * const lastNameNotEmptyAssertion  = Assertion.requiring(
   *    "lastName",
   *    lastNameNotEmptyDescription,
   *    Requirements.isNotEmpty
   * );
   *
   * Ruleset.ensureAll(
   *   firstNameNotEmptyAssertion.evaluateFor("Jane"),
   *   lastNameNotEmptyAssertion.evaluateFor(""),
   * ); // throws because last name is empty
   * ```
   */
  static ensureAll(...assertions: SelfContainedAssertions[]): void {
    new this(assertions.flat(), []).ensure();
  }

  /**
   * Evaluates all rules **asynchronously** and throws an error if any has failed.
   *
   * @throws if any rule has failed
   *
   * @example
   * ```ts
   * const emailMustBeUniqueInquiry = Inquiry.requiring(
   *    "email",
   *    emailMustBeUniqueDescription,
   *    async (email) => !(await isEmailTaken(email))
   * );
   * const emailMustNotBeDisposableInquiry = Inquiry.requiring(
   *    "email",
   *    emailMustNotBeDisposableDescription,
   *    async () => !(await isDisposable(email))
   * );
   *
   * await Ruleset.workOn(
   *   emailMustBeUniqueInquiry.evaluateFor("example@disposable.com"),
   *   emailMustNotBeDisposableInquiry.evaluateFor("example@disposable.com"),
   * ); // throws because email is disposable
   * ```
   */
  static workOn(...rules: SelfContainedRules[]): Promise<void> {
    return new this([], rules.flat()).mustHold();
  }

  constructor(protected assertions: SelfContainedAssertion[], protected rules: SelfContainedRule[]) {}

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
