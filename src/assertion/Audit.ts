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

  require(aCondition: () => Promise<boolean>) {
    this.conditions.push(aCondition);
    return this;
  }
}
