import { Assertion } from "./Assertion";
import { AssertionsFailed } from "./AssertionsFailed";

/**
 * Runs all assertions and throws an error if any has failed.
 * The failed assertions are included in the error.
 *
 * @see {@link AssertionsFailed}
 * @see {@link Assertion}
 */
export class AssertionsRunner {
  static assert(assertion: Assertion) {
    this.assertAll([assertion]);
  }

  static assertAll(assertions: Assertion[]) {
    new this(assertions).run();
  }

  constructor(protected assertions: Assertion[]) {}

  /**
   * @throws {AssertionsFailed} if any assertion has failed
   */
  run(): void {
    const failedAssertions = this.failedAssertions();

    if (failedAssertions.length > 0) throw new AssertionsFailed(failedAssertions);
  }

  protected failedAssertions() {
    return this.assertions.filter((assertion) => assertion.hasFailed());
  }
}
