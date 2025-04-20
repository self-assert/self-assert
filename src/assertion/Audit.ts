import { AssertionLabel } from "./AssertionLabel";
import { AssertionsFailed } from "./AssertionsFailed";
import { AssertionId, LabeledAssertion } from "./types";

export class Audit<ValueType = void> implements LabeledAssertion {
  static labeled<ValueType = void>(anId: AssertionId, aDescription: string) {
    return new this<ValueType>(new AssertionLabel(anId, aDescription));
  }

  static requiring<ValueType = void>(
    anId: AssertionId,
    aDescription: string,
    aCondition: (value: ValueType) => Promise<boolean>
  ) {
    return this.labeled<ValueType>(anId, aDescription).require(aCondition);
  }

  protected conditions: ((value: ValueType) => Promise<boolean>)[];

  protected constructor(protected label: AssertionLabel) {
    this.conditions = [];
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

  async assert(value: ValueType) {
    if (await this.hasFailed(value)) {
      throw new AssertionsFailed([this.label]);
    }
  }

  require(aCondition: (value: ValueType) => Promise<boolean>) {
    this.conditions.push(aCondition);
    return this;
  }

  hasLabelId(assertionId: AssertionId) {
    return this.label.hasLabelId(assertionId);
  }

  getId(): AssertionId {
    return this.label.getId();
  }

  /**
   * @see {@link SelfContainedAssertion.hasLabel}
   */
  hasLabel(assertionId: AssertionId, assertionDescription: string) {
    return this.label.hasLabel(assertionId, assertionDescription);
  }

  getDescription() {
    return this.label.getDescription();
  }

  /**
   * @see {@link SelfContainedAssertion.hasFailed}
   */
  hasDescription(assertionDescription: string) {
    return this.label.hasDescription(assertionDescription);
  }
}
