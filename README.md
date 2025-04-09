# self-assert

Design objects that are fully responsible for their validity.

> [!WARNING]
> This project is in its early stages. It is meant to be published soon.

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-green)][license]
[![Lint and Test](https://github.com/self-assert/self-assert/actions/workflows/ci.yml/badge.svg)](https://github.com/self-assert/self-assert/actions/workflows/ci.yml)
[![Publish](https://github.com/self-assert/self-assert/actions/workflows/publish.yml/badge.svg)](https://github.com/self-assert/self-assert/actions/workflows/publish.yml)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.0-4baaaa.svg)][coc]

</div>

## Table of Contents

- [Credits and Acknowledgements](#credits-and-acknowledgements)
- [Installation](#installation)
- [Usage](#usage)
  - [Using Assertions for object validation](#using-assertions-for-object-validation)
  - [Guiding Form Completion with Assistants](#guiding-form-completion-with-assistants)
- [Resources](#resources)
- [License](#license)

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

## Installation

Install `self-assert` with `npm`:

```shell
npm install self-assert
```

## Usage

This section is meant as a **guide** to help you get started with `self-assert`.
It does not define rules, but rather showcases what the
contributors consider to be best practices.

For more information, refer to the [original webinar example][dalg-t1-ch3].

### Using Assertions for Object Validation

To ensure that domain objects are created in a valid and complete state,
`self-assert` introduces the `Assertion` abstraction.

A common workflow is:

1. Define a main static factory method (e.g., `create`) that:
   - Receives **all required parameters** to build a complete object.
   - Validates those parameters using one or more `Assertion`s.
   - Returns a valid instance or raises an error.
2. Use `Assertion.for` or `Assertion.forAll` to define validations,
   and `AssertionsRunner.assertAll` to execute them together in
   the previously defined factory method.
3. (Optional) If you are using TypeScript, consider marking
   the class constructor as `protected`.
4. Ensure that all other factory methods use the main one.

Here's a simplified example:

```ts
import { Assertion, AssertionsRunner } from "self-assert";

class Person {
  static readonly nameNotBlankAID = "name.notBlank";
  static readonly nameNotBlankDescription = "Name must not be blank";
  static readonly agePositiveAID = "age.positive";
  static readonly agePositiveDescription = "Age must be positive";

  static named(name: string, age: number) {
    AssertionsRunner.assertAll([
      Assertion.for(name, this.nameNotBlankAID, () => name.trim().length > 0, this.nameNotBlankDescription),
      Assertion.for(age, this.agePositiveAID, () => age > 0, this.agePositiveDescription),
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

### Guiding Form Completion with Assistants

The `FormFieldCompletionAssistant` helps validate and suggest completion
options for a single form field.
It should be used when you need to encapsulate the logic that determines
whether a field is complete and what values could make it valid.

The `FormSectionCompletionAssistant` validates and suggests how
to complete a group of related fields.
It aggregates multiple `FormFieldCompletionAssistant` or other
`FormSectionCompletionAssistant` instances.

```ts
function createPersonAssistant() {
  const nameAssistant = FormFieldCompletionAssistant.handlingAll<Person>([Person.nameNotBlankAID], (person) =>
    person.getName()
  );
  const ageAssistant = IntegerFieldCompletionAssistant.for<Person>(Person.agePositiveAID, (person) => person.getAge());

  const personAssistant = FormSectionCompletionAssistant.topLevelContainerWith<Person, [string, number]>(
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

- [Contributors' Guide](https://github.com/self-assert/.github/blob/main/CONTRIBUTING.md)
- [Code of Conduct][coc]

## License

[MIT][license]

[license]: https://github.com/self-assert/self-assert/blob/main/LICENSE
[coc]: https://github.com/self-assert/.github/blob/main/CODE_OF_CONDUCT.md
[hernan-url]: https://github.com/hernanwilkinson
[disenio-a-la-gorra]: https://github.com/hernanwilkinson/disenioALaGorra
[dalg-t1-ch2]: https://github.com/hernanwilkinson/disenioALaGorra/tree/a6d90a0044bf69f98fb50584872b226bf678e67b/Temporada01/Episodio02%20-%20Objetos%20V%C3%A1lidos
[dalg-t1-ch3]: https://github.com/hernanwilkinson/disenioALaGorra/tree/a6d90a0044bf69f98fb50584872b226bf678e67b/Temporada01/Episodio03%20-%20Modelar%20los%20Conjuntos%20de%20Objetos
