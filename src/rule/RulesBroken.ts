import { RuleLabel } from "./RuleLabel";

import type { RuleLabelAsJson } from "./RuleLabel";
import type { LabelId, LabeledRule } from "./types";

export interface RulesBrokenAsJson {
  brokenRules: RuleLabelAsJson[];
}

/**
 * Provides a way to handle multiple failed rules,
 * by their labels.
 *
 * @see {@link RuleLabel}
 * @category Rules
 */
export class RulesBroken extends Error {
  static fromJson(rulesBrokenAsJson: RulesBrokenAsJson) {
    const brokenRules = rulesBrokenAsJson.brokenRules.map((ruleAsJson) => RuleLabel.fromJson(ruleAsJson));

    return new this(brokenRules);
  }

  constructor(protected brokenRules: LabeledRule[]) {
    super();
  }

  hasRuleBrokenWith(labelId: LabelId, labelDescription: string) {
    return this.brokenRules.some((rule) => rule.hasLabel(labelId, labelDescription));
  }

  hasOnlyOneRuleBrokenWith(labelId: LabelId, labelDescription: string) {
    return this.brokenRules.length === 1 && this.brokenRules[0].hasLabel(labelId, labelDescription);
  }

  forEachRuleBroken(closure: (brokenRule: LabeledRule) => void) {
    return this.brokenRules.forEach(closure);
  }
}
