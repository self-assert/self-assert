# self-assert

> Design objects that are fully responsible for their validity.

<div align="center">

[![npm version](https://img.shields.io/npm/v/self-assert)][npm]
[![License](https://img.shields.io/badge/license-MIT-green)][license]
[![Lint and Test](https://github.com/self-assert/self-assert/actions/workflows/ci.yml/badge.svg)][gha-lint-and-test]

<br/>

🔗 [Documentation][docs] • [Live Demo][demo]

</div>

---

**Inspired by [Hernán Wilkinson][hernan-url]’s
“[Diseño a la Gorra][disenio-a-la-gorra]” webinar**—software
as a model of real‑world problems, continuous refinement of that model,
and objects that encapsulate and protect their own validity.

See [full acknowledgements][credits].

## Introduction

`self-assert` is a small TypeScript library that
helps you model domain rules _inside_ your objects
— not as external validators, but as collaborators in their own creation.

This library encourages a mindset where rules are expressed in
terms of the domain, and
**objects are created complete, valid, and meaningful from the start**.

## Installation

Install `self-assert` with `npm`:

```shell
npm install self-assert
```

## Quick Start

A common workflow is:

1. Define a single main factory method that validates parameters before
   creating a new instance of the object.
2. Use `Assertion.requiring(...)` to define the rules.
3. Use `Ruleset.ensureAll(...)` to execute those rules inside the factory method.
4. Any additional static creation methods should delegate to the main one.

```ts
class Person {
  static readonly nameNotBlank = Assertion.requiring(
    "name.notBlank",
    "Name must not be blank",
    Requirements.isNotBlank
  );

  static named(name: string, ...) {
    Ruleset.ensureAll(this.nameNotBlank.evaluateFor(name), ...otherRules);
    return new this(name, ...);
  }

  protected constructor(protected name: string, ...) {}
}
```

If any assertion fails, a `RulesBroken` error is thrown.
This ensures your objects are **complete and valid** from the beginning.

See [`examples/`](https://github.com/self-assert/self-assert/tree/main/examples)
or the [documentation][docs] for more details.

## Resources

Contributions are welcome! Whether it's fixing bugs,
improving documentation, or proposing new ideas aligned with the
project's design principles, feel free to get involved.

- [Contributors' Guide][contributing]
- [Code of Conduct][coc]

## License

[MIT][license]

<!---->

[license]: https://github.com/self-assert/self-assert/blob/main/LICENSE
[contributing]: https://github.com/self-assert/self-assert/blob/main/CONTRIBUTING.md
[coc]: https://github.com/self-assert/.github/blob/main/CODE_OF_CONDUCT.md
[docs]: https://self-assert.github.io/self-assert
[demo]: https://codesandbox.io/p/sandbox/github/self-assert/self-assert-react-demo
[credits]: https://self-assert.github.io/self-assert/acknowledgements

<!-- Badges -->

[npm]: https://www.npmjs.com/package/self-assert
[gha-lint-and-test]: https://github.com/self-assert/self-assert/actions/workflows/ci.yml

<!---->

[hernan-url]: https://github.com/hernanwilkinson
[disenio-a-la-gorra]: https://github.com/hernanwilkinson/disenioALaGorra
