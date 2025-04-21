import { RuleLabel } from "./RuleLabel";
import { RulesBroken } from "./RulesBroken";
import { Rule } from "./Rule";
import { LabeledRule, LabelId } from "./types";

export class Inquiry<ValueType = void> extends Rule<Promise<boolean>, ValueType> {
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

  async hasFailed(value: ValueType) {
    return !(await this.doesHold(value));
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
}
