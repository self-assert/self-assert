import { RuleLabel } from "./RuleLabel";

import type { RuleLabelAsJson } from "./RuleLabel";
import type { LabelId, LabeledRule } from "./types";

export interface AssertionsFailedAsJson {
  failedAssertions: RuleLabelAsJson[];
}

/**
 * Provides a way to handle multiple failed assertions,
 * by their labels.
 *
 * @see {@link RuleLabel}
 */
export class AssertionsFailed extends Error {
  static fromJson(assertionsFailedAsJson: AssertionsFailedAsJson) {
    const failedAssertions = assertionsFailedAsJson.failedAssertions.map((assertionAsJson) =>
      RuleLabel.fromJson(assertionAsJson)
    );

    return new this(failedAssertions);
  }

  constructor(protected failedAssertions: LabeledRule[]) {
    super();
  }

  hasAnAssertionFailedWith(assertionId: LabelId, assertionDescription: string) {
    return this.failedAssertions.some((assertion) => assertion.hasLabel(assertionId, assertionDescription));
  }

  hasOnlyOneAssertionFailedWith(assertionId: LabelId, assertionDescription: string) {
    return this.failedAssertions.length === 1 && this.failedAssertions[0].hasLabel(assertionId, assertionDescription);
  }

  forEachAssertionFailed(closure: (failedAssertion: LabeledRule) => void) {
    return this.failedAssertions.forEach(closure);
  }
}
