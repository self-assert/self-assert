import { Assertion, Ruleset } from "../src/rule";
import { Requirements } from "../src/rule-requirements";

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
      Requirements.differentFrom(this.forbiddenName)
    );
  }

  static named(name: string) {
    Ruleset.ensureAll([
      Assertion.requiring(this.nameNotEmptyAID, this.nameNotEmptyDescription, Requirements.isNotEmpty).evaluateFor(
        name
      ),
      SelfAssertingModel.nameNotForbiddenAssertion().evaluateFor(name),
    ]);

    return new this(name);
  }

  protected constructor(name: string) {
    super(name);
  }
}
