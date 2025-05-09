<h1 align="center">
self-assert
</h1>

<div align="center">

[![self-assert logo](https://avatars.githubusercontent.com/u/205992123?s=100)][repo]

</div>

<p align="center"><em> Design objects that are fully responsible for their validity</em></p>

<div align="center">

<br/>

[![npm version](https://img.shields.io/npm/v/self-assert)][npm]
[![License](https://img.shields.io/badge/license-MIT-green)][license]
[![Lint and Test](https://github.com/self-assert/self-assert/actions/workflows/ci.yml/badge.svg)][gh-workflow-ci]

<br/>

🔗 [Documentation][docs] • [Live Demo][demo]

</div>

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

Please refer to the [documentation][docs] or
[`examples/`](https://github.com/self-assert/self-assert/tree/main/examples)
for more details and use cases, such as:

- `assistants` to guide **form completion**
- validating **async rules**
- a built-in set of **reusable Requirements** for common checks

## Contributing

Contributions are welcome! See [Contributors' Guide][contributing] for details.

### Monorepo Structure

This package is part of the [`self-assert` monorepo][repo].

## License

[MIT][license]

<!---->

[repo]: https://github.com/self-assert/self-assert
[license]: https://github.com/self-assert/self-assert/blob/main/LICENSE
[contributing]: https://github.com/self-assert/self-assert/blob/main/CONTRIBUTING.md
[docs]: https://self-assert.github.io
[demo]: https://codesandbox.io/p/sandbox/github/self-assert/self-assert-react-demo

<!-- Badges -->

[npm]: https://www.npmjs.com/package/self-assert
[gh-workflow-ci]: https://github.com/self-assert/self-assert/actions/workflows/ci.yml
