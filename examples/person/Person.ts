import { Assertion, Requirements, Ruleset } from "self-assert";

export class Person {
  static readonly nameNotBlank = Assertion.requiring(
    "name.notBlank",
    "Name must not be blank",
    Requirements.isNotBlank
  );

  static readonly agePositive = Assertion.requiring(
    "age.positive",
    "Age must be positive",
    Requirements.isPositive
  );

  static named(name: string, age: number) {
    Ruleset.ensureAll(
      this.nameNotBlank.evaluateFor(name),
      this.agePositive.evaluateFor(age)
    );
    return new this(name, age);
  }

  protected constructor(protected name: string, protected age: number) {}

  getName() {
    return this.name;
  }

  getAge() {
    return this.age;
  }
}
