import { RuleLabel } from "./RuleLabel";

import type { RuleLabelAsJson } from "./RuleLabel";
import type { LabelId, LabeledRule } from "./types";

/**
 * JSON representation of {@link RulesBroken}
 *
 * @category Supporting types
 */
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
  /** @category Creation */
  static fromJson(rulesBrokenAsJson: RulesBrokenAsJson) {
    const brokenRules = rulesBrokenAsJson.brokenRules.map((ruleAsJson) =>
      RuleLabel.fromJson(ruleAsJson)
    );

    return new this(brokenRules);
  }

  /** @category Creation */
  constructor(protected brokenRules: LabeledRule[]) {
    super();
  }

  /** @category Inspection */
  hasRuleBrokenWith(labelId: LabelId, labelDescription: string) {
    return this.brokenRules.some((rule) =>
      rule.hasLabel(labelId, labelDescription)
    );
  }

  /** @category Inspection */
  hasOnlyOneRuleBrokenWith(labelId: LabelId, labelDescription: string) {
    return (
      this.brokenRules.length === 1 &&
      this.brokenRules[0].hasLabel(labelId, labelDescription)
    );
  }

  /** @category Inspection */
  forEachRuleBroken(closure: (brokenRule: LabeledRule) => void) {
    return this.brokenRules.forEach(closure);
  }
}
