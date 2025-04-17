import { AssertionsFailed } from "./AssertionsFailed";
import type { SelfContainedAssertion } from "./types";

/**
 * Runs all assertions and throws an error if any has failed.
 * The failed assertions are included in the error.
 *
 * @see {@link SelfContainedAssertion}, {@link AssertionsFailed}
 */
export class AssertionSuite {
  static assert(assertion: SelfContainedAssertion) {
    this.assertAll([assertion]);
  }

  static assertAll(assertions: SelfContainedAssertion[]) {
    new this(assertions).run();
  }

  constructor(protected assertions: SelfContainedAssertion[]) {}

  /**
   * @throws {AssertionsFailed} if any assertion has failed
   */
  run(): void {
    const failedAssertions = this.failedAssertions();

    if (failedAssertions.length > 0) throw new AssertionsFailed(failedAssertions);
  }

  protected failedAssertions(): SelfContainedAssertion[] {
    const failed: SelfContainedAssertion[] = [];
    this.assertions.forEach((assertion) => assertion.reportFailureTo(failed));
    return failed;
  }
}
