import { Assertion, Ruleset } from "@/assertion";
import { Conditions } from "@/conditions";

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

  static nameNotForbiddenAssertion() {
    return Assertion.requiring(
      this.nameNotForbiddenAID,
      this.nameNotForbiddenDescription,
      Conditions.differentFrom(this.forbiddenName)
    );
  }

  static named(name: string) {
    Ruleset.ensureAll([
      Assertion.requiring(this.nameNotEmptyAID, this.nameNotEmptyDescription, Conditions.isNotEmpty).evaluateFor(name),
      SelfAssertingModel.nameNotForbiddenAssertion().evaluateFor(name),
    ]);

    return new this(name);
  }

  protected constructor(name: string) {
    super(name);
  }
}
