import { Assertion, AssertionSuite } from "@/assertion";

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

  static readonly forbiddenName = "FORBIDDEN";
  static readonly nameNotForbiddenAID = "sam.nameNotForbiddenAID";
  static readonly nameNotForbiddenDescription = `Name cannot be '${this.forbiddenName}'`;

  static nameNotForbiddenAssertion(name: string): Assertion {
    return Assertion.for(this.nameNotForbiddenAID, this.nameNotForbiddenDescription, () => name !== this.forbiddenName);
  }

  static named(name: string) {
    AssertionSuite.assertAll([
      Assertion.for(this.nameNotEmptyAID, this.nameNotEmptyDescription, () => name !== ""),
      SelfAssertingModel.nameNotForbiddenAssertion(name),
    ]);

    return new this(name);
  }

  protected constructor(name: string) {
    super(name);
  }
}
