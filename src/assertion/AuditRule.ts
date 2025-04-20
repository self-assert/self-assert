import { RuleLabel } from "./RuleLabel";
import { RulesBroken } from "./RulesBroken";
import { Rule } from "./Rule";
import { LabeledRule, LabelId } from "./types";

export class AuditRule<ValueType = void> extends Rule<Promise<boolean>, ValueType> {
  static labeled<ValueType = void>(anId: LabelId, aDescription: string) {
    return new this<ValueType>(new RuleLabel(anId, aDescription));
  }

  static requiring<ValueType = void>(
    anId: LabelId,
    aDescription: string,
    aCondition: (value: ValueType) => Promise<boolean>
  ) {
    return this.labeled<ValueType>(anId, aDescription).require(aCondition);
  }

  protected constructor(label: RuleLabel) {
    super(label);
  }

  async doesHold(value: ValueType) {
    for (const condition of this.conditions) {
      if (!(await condition(value))) {
        return false;
      }
    }
    return true;
  }

  async mustHold(value: ValueType) {
    if (await this.hasFailed(value)) {
      throw new RulesBroken([this.label]);
    }
  }

  async collectFailureInto(failed: LabeledRule[], value: ValueType) {
    if (await this.hasFailed(value)) {
      failed.push(this.label);
    }
  }

  evaluateFor(aValue: ValueType) {
    return new AuditRuleEvaluation(this, aValue);
  }
}

export class AuditRuleEvaluation<ValueType = unknown> {
  constructor(private rule: AuditRule<ValueType>, private value: ValueType) {}

  doesHold() {
    return this.rule.doesHold(this.value);
  }

  hasFailed() {
    return this.rule.hasFailed(this.value);
  }

  mustHold() {
    return this.rule.mustHold(this.value);
  }

  collectFailureInto(failed: LabeledRule[]) {
    return this.rule.collectFailureInto(failed, this.value);
  }

  getId() {
    return this.rule.getId();
  }

  getDescription() {
    return this.rule.getDescription();
  }

  hasLabel(anId: LabelId, aDescription: string) {
    return this.rule.hasLabel(anId, aDescription);
  }

  hasLabelId(anId: LabelId) {
    return this.rule.hasLabelId(anId);
  }

  hasDescription(aDescription: string) {
    return this.rule.hasDescription(aDescription);
  }
}
