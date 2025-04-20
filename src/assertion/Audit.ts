import { AssertionLabel } from "./RuleLabel";
import { AssertionsFailed } from "./AssertionsFailed";
import { Rule } from "./Rule";
import { LabelId } from "./types";

export class Audit<ValueType = void> extends Rule<Promise<boolean>, ValueType> {
  static labeled<ValueType = void>(anId: LabelId, aDescription: string) {
    return new this<ValueType>(new AssertionLabel(anId, aDescription));
  }

  static requiring<ValueType = void>(
    anId: LabelId,
    aDescription: string,
    aCondition: (value: ValueType) => Promise<boolean>
  ) {
    return this.labeled<ValueType>(anId, aDescription).require(aCondition);
  }

  protected constructor(label: AssertionLabel) {
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
      throw new AssertionsFailed([this.label]);
    }
  }
}
