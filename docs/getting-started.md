---
title: Getting Started
---

# Getting Started

## Why `self-assert`?

`self-assert` is a small TypeScript library that helps you design domain
objects that are **responsible for their own validity**.

It embraces a modeling-first mindset, encouraging rules to
live **inside** your domain — not as external schemas or validators.

## Validating Domain Objects with `Assertion`

The `Assertion` class lets you express rules declaratively. You can:

- Define **self-contained** rules (no parameters)
- Define **reusable** rules that apply to different values

A typical factory method:

```ts
class Person {
  static readonly nameNotBlank = Assertion.requiring(
    "name.notBlank",
    "Name must not be blank",
    Requirements.isNotBlank
  );

  static readonly agePositive = Assertion.requiring("age.positive", "Age must be positive", Requirements.isPositive);

  static named(name: string, age: number) {
    Ruleset.ensureAll(this.nameNotBlank.evaluateFor(name), this.agePositive.evaluateFor(age));
    return new this(name, age);
  }

  protected constructor(protected name: string, protected age: number) {}
}
```

If any rule fails, a `RulesBroken` error is thrown with details.

## Suggesting Completion with Draft Assistants

`FieldDraftAssistant` and `SectionDraftAssistant` help you manage
**incomplete** or draft objects, especially useful in UI flows or external interfaces.

```ts
function createPersonAssistant() {
  const nameAssistant = FieldDraftAssistant.handlingAll(["name.notBlank"], (person: Person) => person.getName());

  const ageAssistant = IntegerDraftAssistant.for("age.positive", (person: Person) => person.getAge());

  return SectionDraftAssistant.topLevelContainerWith(
    [nameAssistant, ageAssistant],
    (name, age) => Person.named(name, age),
    []
  );
}
```

The assistant lets you defer object creation until all validations pass:

```ts
personAssistant.withCreatedModelDo(
  (person) => use(person),
  () => console.warn("Invalid data")
);
```

## Handling Async Validations with `Inquiry`

When a rule needs an async check (e.g., server, database, API), use
`Inquiry` instead of `Assertion`.

```ts
const emailUnique = Inquiry.requiring<string>(
  "user.email.unique",
  "Email must be unique",
  async (email) => !(await isTaken(email))
);

await emailUnique.mustHold("test@example.com");
```

You can mix Assertions and Inquiries in the same `Ruleset`:

```ts
await Ruleset.workOn(person.nameNotBlank.evaluateFor(name), emailUnique.evaluateFor(email));
```
