import { Assertion, AssertionId } from "./Assertion";

export class AssertionsFailed extends Error {
  static fromJson(assertionsFailedAsJson) {
    const failedAssertions = assertionsFailedAsJson.failedAssertions.map((assertionAsJson) =>
      Assertion.fromJson(assertionAsJson)
    );

    return new this(failedAssertions);
  }

  constructor(protected failedAssertions: Assertion[]) {
    super();
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
