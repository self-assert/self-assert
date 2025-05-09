import { RuleLabel } from "./RuleLabel";
import { RulesBroken } from "./RulesBroken";
import { Rule } from "./Rule";
import { LabeledRule, LabelId } from "./types";

/**
 * Represents a rule that needs to be evaluated **asynchronously**.
 *
 * @example
 * {@includeCode ../../../../examples/snippets/rules.ts#inquiry}
 *
 * @category Rules
 */
export class Inquiry<ValueType = any> extends Rule<
  Promise<boolean>,
  ValueType
> {
  /** @category Creation */
  static labeled<ValueType = any>(anId: LabelId, aDescription: string) {
    return new this<ValueType>(new RuleLabel(anId, aDescription));
  }

  /** @internal */
  static requiring(
    anId: LabelId,
    aDescription: string,
    aCondition: () => Promise<boolean>
  ): Inquiry<void>;
  /**
   * @see {@link Assertion.requiring}
   * @category Creation
   */
  static requiring<ValueType = any>(
    anId: LabelId,
    aDescription: string,
    aCondition: (value: ValueType) => Promise<boolean>
  ): Inquiry<ValueType>;

  static requiring<ValueType = any>(
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
    for (const requirement of this.requirements) {
      if (!(await requirement(value))) {
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
