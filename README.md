# self-assert

> Design objects that are fully responsible for their validity.

<div align="center">

[![npm version](https://img.shields.io/npm/v/self-assert)][npm]
[![License](https://img.shields.io/badge/license-MIT-green)][license]
[![Lint and Test](https://github.com/self-assert/self-assert/actions/workflows/ci.yml/badge.svg)][gha-lint-and-test]

<br/>

🔗 [Documentation][docs] | [Getting Started](#getting-started)

</div>

---

**Inspired by [Hernán Wilkinson][hernan-url]’s
“[Diseño a la Gorra][disenio-a-la-gorra]” webinar**—software
as a model of real‑world problems, continuous refinement of that model,
and objects that encapsulate and protect their own validity.

See [full acknowledgements](#credits-and-acknowledgements) below.

## Installation

Install `self-assert` with `npm`:

```shell
npm install self-assert
```

## Getting Started

This section is meant as a **guide** to help you get started with `self-assert`.
It does not define rules, but rather showcases what the
contributors consider to be best practices.

For more information, refer to the [documentation][docs] or
the [original webinar example][dalg-t1-ch3].

### Defining Assertions for Object Validation

To ensure that domain objects are created in a valid and complete state,
`self-assert` introduces the `Assertion` abstraction.

There are two main ways to define and use assertions:

- **Self-contained assertions:** the assertion conditions don't need any
  parameters to evaluate.
- **Reusable assertions:** the assertion is defined once and later evaluated
  with different values.

A common workflow is:

1. Define a main static factory method (e.g., `create`) that:
   - Receives **all required parameters** to build a complete object.
   - Validates those parameters using one or more `Assertion`s.
   - Returns a valid instance or raises an error.
2. Use `Assertion.requiring` for self-contained checks, or create reusable assertions
   and apply them later using `AssertionEvaluation` or the `evaluateFor`
   method of `Assertion`.
3. Use `AssertionSuite.assertAll` to execute the assertions together in
   the previously defined factory method.
4. _(Optional)_ If you are using TypeScript, consider marking
   the class constructor as `protected`.
5. Ensure that all other factory methods use the main one.

Here's a simplified example:

```ts
import { Assertion, AssertionSuite, Conditions } from "self-assert";

class Person {
  static readonly nameNotBlankAID = "name.notBlank";
  static readonly nameNotBlankDescription = "Name must not be blank";
  static readonly agePositiveAID = "age.positive";
  static readonly agePositiveDescription = "Age must be positive";

  // Reusable assertion (evaluated later with a value)
  static readonly nameAssertion = Assertion.requiring<string>(
    this.nameNotBlankAID,
    this.nameNotBlankDescription,
    Conditions.isNotBlank
  );

  static named(name: string, age: number) {
    AssertionSuite.assertAll([
      // evaluated with `name`
      this.nameAssertion.evaluateFor(name),
      // self-contained assertion for age
      Assertion.requiring(this.agePositiveAID, this.agePositiveDescription, () => age > 0),
    ]);

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

try {
  const invalidPerson = Person.named("  ", -5);
} catch (error) {
  if (error instanceof AssertionsFailed) {
    console.log(error.hasAnAssertionFailedWith(Person.nameNotBlankAID, Person.nameNotBlankDescription)); // true
    console.log(error.hasAnAssertionFailedWith(Person.agePositiveAID, Person.agePositiveDescription)); // true
  } else {
    console.error("An unexpected error occurred:", error);
  }
}
```

If any of the assertions fail, an `AssertionsFailed` error will
be thrown, containing all failed assertions.

This promotes the idea that
**objects should be created valid from the beginning**, enforcing consistency.

### Using Draft Assistants

The `FieldDraftAssistant` helps validate and suggest completion
options for a single field or property.
It should be used when you need to encapsulate the logic that determines
whether a field is complete and what values could make it valid.

The `SectionDraftAssistant` validates and suggests how
to complete a group of related fields.
It aggregates multiple `FieldDraftAssistant` or other
`SectionDraftAssistant` instances.

```ts
function createPersonAssistant() {
  const nameAssistant = FieldDraftAssistant.handlingAll<Person>([Person.nameNotBlankAID], (person) => person.getName());
  const ageAssistant = IntegerDraftAssistant.for<Person>(Person.agePositiveAID, (person) => person.getAge());

  const personAssistant = SectionDraftAssistant.topLevelContainerWith<Person, [string, number]>(
    [nameAssistant, ageAssistant],
    (name, age) => Person.named(name, age),
    [] // Any other assertion IDs if apply
  );

  return Object.assign(personAssistant, { nameAssistant, ageAssistant });
}

const personAssistant = createPersonAssistant();
// Use your assistant in your system's external interfaces (UI, REST, etc.), then:

personAssistant.withCreatedModelDo(
  (person) => {
    console.log(person instanceof Person); // true
    doSomething(person);
  },
  () => {
    // The creation of a Person failed.
    console.log(personAssistant.hasFailedAssertions()); // true
  }
);
```

> [!NOTE]
> Using `Object.assign` can help you keep track of the
> internal assistants of a higher-level assistant.
> In the above example, TypeScript should correctly infer the return
> type of `createPersonAssistant`:
>
> ```ts
> // No compilation error
> createPersonAssistant().nameAssistant.setModel("John");
> ```

## Resources

Contributions are welcome! Whether it's fixing bugs,
improving documentation, or proposing new ideas aligned with the
project's philosophy, feel free to get involved.

- [Contributors' Guide][contributing]
- [Code of Conduct][coc]

## Credits and Acknowledgements

This project is based on the ideas presented by Hernán Wilkinson ([@hernanwilkinson][hernan-url])
in his [Diseño a la Gorra][disenio-a-la-gorra] webinar.

Diseño a la Gorra explores the principles of object-oriented software design,
with a focus on practical examples and heuristics for creating high-quality software.
The videos are mostly in Spanish, but the code and ideas are universally understandable.

A central theme of Diseño a la Gorra is understanding software as a
**model of a real-world problem**.
From this perspective, developing software is fundamentally the act of
**designing an effective model**.

According to this approach:

- A good software model **abstracts the relevant aspects** of the domain,
  allowing for clear understanding and effective solutions.
- Software design is a continuous process of **learning and refining** the model.
- A good model not only works but also **teaches** how to interact with it
  through its structure and behavior.
- **Objects** should represent **domain entities**, and be created
  **complete** and **valid** from the start, reflecting a coherent
  state of the real world.

The concepts behind `self-assert` were introduced in [Episode 2][dalg-t1-ch2]
("Valid Objects")
and further developed in [Episode 3][dalg-t1-ch3] ("Modeling Sets of Objects").

Diseño a la Gorra also encourages a shift in mindset:

- **Code is not written for the computer**; it's written to
  **model our understanding of the domain**.
- **Objects are not just data containers**; they are
  **collaborators that encapsulate behavior** and ensure consistency.

This mindset is what `self-assert` aims to support: designing
objects that **are responsible of protecting their own validity** from the very beginning.

## License

[MIT][license]

[license]: https://github.com/self-assert/self-assert/blob/main/LICENSE
[contributing]: https://github.com/self-assert/self-assert/blob/main/CONTRIBUTING.md
[gha-lint-and-test]: https://github.com/self-assert/self-assert/actions/workflows/ci.yml
[coc]: https://github.com/self-assert/.github/blob/main/CODE_OF_CONDUCT.md
[docs]: https://self-assert.github.io/self-assert
[npm]: https://www.npmjs.com/package/self-assert

<!---->

[hernan-url]: https://github.com/hernanwilkinson
[disenio-a-la-gorra]: https://github.com/hernanwilkinson/disenioALaGorra
[dalg-t1-ch2]: https://github.com/hernanwilkinson/disenioALaGorra/tree/a6d90a0044bf69f98fb50584872b226bf678e67b/Temporada01/Episodio02%20-%20Objetos%20V%C3%A1lidos
[dalg-t1-ch3]: https://github.com/hernanwilkinson/disenioALaGorra/tree/a6d90a0044bf69f98fb50584872b226bf678e67b/Temporada01/Episodio03%20-%20Modelar%20los%20Conjuntos%20de%20Objetos
