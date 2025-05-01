import type { LabelId, LabeledRule } from "./types";

/**
 * JSON representation of a {@link RuleLabel}
 *
 * @category Supporting types
 */
export interface RuleLabelAsJson {
  id: LabelId;
  description: string;
}

export class RuleLabel implements LabeledRule {
  static fromJson({ id, description }: RuleLabelAsJson) {
    return new this(id, description);
  }

  constructor(protected id: LabelId, protected description: string) {}

  isLabeledAs(aBrokenRuleLabel: LabeledRule): boolean {
    return aBrokenRuleLabel.hasLabel(this.id, this.description);
  }

  hasLabel(assertionId: LabelId, assertionDescription: string) {
    return this.hasLabelId(assertionId) && this.hasDescription(assertionDescription);
  }

  hasLabelId(assertionId: LabelId): boolean {
    return this.id === assertionId;
  }

  hasDescription(description: string): boolean {
    return this.description === description;
  }

  getId() {
    return this.id;
  }

  getDescription(): string {
    return this.description;
  }
}
