import { Assertion, AssertionAsJson, AssertionId } from "./Assertion";

export interface AssertionsFailedAsJson {
  failedAssertions: AssertionAsJson[];
}
/**
 * Provides a way to handle multiple failed assertions.
 *
 * @see {@link Assertion}
 */
export class AssertionsFailed extends Error {
  static fromJson(assertionsFailedAsJson: AssertionsFailedAsJson) {
    const failedAssertions = assertionsFailedAsJson.failedAssertions.map((assertionAsJson) =>
      Assertion.fromJson(assertionAsJson)
    );

    return new this(failedAssertions);
  }

  constructor(protected failedAssertions: Assertion[]) {
    super();
  }

  hasAnAssertionFailedWith(assertionId: AssertionId, assertionDescription: string) {
    return this.failedAssertions.some((assertion) => assertion.isIdentifiedAsWith(assertionId, assertionDescription));
  }

  hasOnlyOneAssertionFailedWith(assertionId: AssertionId, assertionDescription: string) {
    return (
      this.failedAssertions.length === 1 &&
      this.failedAssertions[0].isIdentifiedAsWith(assertionId, assertionDescription)
    );
  }

  forEachAssertionFailed(closure: (failedAssertion: Assertion) => void) {
    return this.failedAssertions.forEach(closure);
  }
}
