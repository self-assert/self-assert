import { AssertionLabel } from "./AssertionLabel";
import { AssertionsFailed } from "./AssertionsFailed";

export class Audit {
  static requiring(anId: string, aDescription: string, aCondition: () => Promise<boolean>) {
    return new this(anId, aDescription).require(aCondition);
  }

  protected conditions: (() => Promise<boolean>)[];
  protected constructor(protected id: string, protected description: string) {
    this.conditions = [];
  }

  async doesHold() {
    for (const condition of this.conditions) {
      if (!(await condition())) {
        return false;
      }
    }
    return true;
  }

  async hasFailed() {
    return !(await this.doesHold());
  }

  async assert() {
    if (await this.hasFailed()) {
      throw new AssertionsFailed([new AssertionLabel(this.id, this.description)]);
    }
  }

  require(aCondition: () => Promise<boolean>) {
    this.conditions.push(aCondition);
    return this;
  }
}
