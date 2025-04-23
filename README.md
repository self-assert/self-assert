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

## Introduction

A small TypeScript library for designing objects that are responsible
for their own validity.  
`self-assert` helps you model domain rules _inside_ your objects
— not as external validators, but as collaborators in their own creation.

This library encourages a mindset where rules are expressed in
terms of the domain, and
**objects are created complete, valid, and meaningful from the start**.

## Installation

Install `self-assert` with `npm`:

```shell
npm install self-assert
```

## Live Demo

Try the interactive demo on [CodeSandbox](https://codesandbox.io/p/sandbox/github/self-assert/self-assert-react-demo).

## Getting Started

`self-assert` helps you define rules inside your
domain model using the `Assertion` abstraction.

A common workflow is:

1. Define static factory methods that validate parameters before object creation.
2. Use `Assertion.requiring(...)` to define the rules.
3. Use `Ruleset.ensureAll(...)` to execute those rules.

```ts
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
}
```

If any assertion fails, a `RulesBroken` error is thrown.
This ensures your objects are complete and valid from the beginning.

See [full examples](./examples) or [documentation][docs] for more use cases.

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

<!---->

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
