import { Assertion, Requirements, Ruleset } from "self-assert";

class Person {
  static readonly nameNotBlank = Assertion.requiring(
    "name.notBlank",
    "Name must not be blank",
    Requirements.isNotBlank
  );

  static create(name: string) {
    Ruleset.ensureAll(this.nameNotBlank.evaluateFor(name));
    return new this(name);
  }

  protected constructor(protected name: string) {}

  getName() {
    return this.name;
  }
}

Person.create("John");
Person.create("   "); // Should cause a RulesBroken error
