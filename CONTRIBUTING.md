# Contributing to self-assert

Welcome, and thank you for your interest in contributing to `self-assert`!

This document outlines some general guidelines and practices for contributing to
the project. We appreciate your help in improving this library.

## Ways to Contribute

There are many ways to contribute to the project:

- **Bug reports**: Help us improve by reporting bugs with as much detail as possible.
- **Feature suggestions**: Share ideas or use cases that could improve the library.
- **Code contributions**: Fix bugs or implement enhancements via Pull Requests.
- **Documentation**: Help improve clarity and examples in the README or future docs.
- **Tests and coverage**: Add test cases or improve coverage.

If you're not sure where to start, feel free to open a [discussion](https://github.com/self-assert/self-assert/discussions).


## Reporting Bugs

When filing a bug report, please include:

- A clear and descriptive title.
- Steps to reproduce the issue.
- What behavior you expected vs. what actually happened.
- The version of `self-assert` you’re using.
- A minimal code sample if possible.

Create a
[new issue](https://github.com/self-assert-org/self-assert/issues/new?template=bug_report.md)
to report a bug.


## Development Setup

To get started, first make a fork of the project on your GitHub account,
then clone it on your computer.

On the project root folder, open a terminal and follow these steps:

**Install dependencies:**

```bash
npm install
```

**Make sure all code checks pass:**

```bash
npm run check:all
```

## Project Structure

This repository is a [monorepo](https://en.wikipedia.org/wiki/Monorepo),
using npm workspaces.

The project structure is as follows:

```text
root/
├── examples
├── package.json
├── packages
│   ├── configs
│   ├── core
│   └── docs
└── README.md
```

- [`packages/configs`](./packages/configs): Common configuration files.
- [`packages/core`](./packages/core): The `self-assert` library itself.
- [`packages/docs`](./packages/docs): Documentation site, using [Vitepress](https://vitepress.dev/) and [Typedoc](https://typedoc.org/).
- [`examples`](./examples): Code examples using `self-assert`. Note that these examples are type-checked and include some tests. See [`examples/README.md`](./examples/README.md) for more details.
