import { Assertion } from "@/Assertion/Assertion";
import { AssertionsRunner } from "@/Assertion/AssertionsRunner";

export class ModelWithNoAssertions {
  constructor(protected name: string) {}

  getName(): string {
    return this.name;
  }

  isNamed(aName: string): boolean {
    return aName === this.name;
  }
}

export class SelfAssertingModel extends ModelWithNoAssertions {
  static readonly nameNotEmptyAID = "sam.nameNotEmptyAID";
  static readonly nameNotEmptyDescription = "Name should not be empty";

  static named(name: string) {
    AssertionsRunner.assertAll([
      Assertion.for(name, this.nameNotEmptyAID, () => name !== "", this.nameNotEmptyDescription),
    ]);

    return new this(name);
  }

  protected constructor(name: string) {
    super(name);
  }
}
