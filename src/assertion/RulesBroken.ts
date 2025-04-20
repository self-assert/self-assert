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
export class RulesBroken extends Error {
  static fromJson(assertionsFailedAsJson: AssertionsFailedAsJson) {
    const failedAssertions = assertionsFailedAsJson.failedAssertions.map((ruleAsJson) =>
      RuleLabel.fromJson(ruleAsJson)
    );

    return new this(failedAssertions);
  }

  constructor(protected brokenRules: LabeledRule[]) {
    super();
  }

  hasAnAssertionFailedWith(assertionId: LabelId, assertionDescription: string) {
    return this.brokenRules.some((assertion) => assertion.hasLabel(assertionId, assertionDescription));
  }

  hasOnlyOneAssertionFailedWith(assertionId: LabelId, assertionDescription: string) {
    return this.brokenRules.length === 1 && this.brokenRules[0].hasLabel(assertionId, assertionDescription);
  }

  forEachAssertionFailed(closure: (failedAssertion: LabeledRule) => void) {
    return this.brokenRules.forEach(closure);
  }
}
