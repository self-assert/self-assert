# Welcome to `self-assert`

> Design objects that are fully responsible for their validity.

`self-assert` is a small TypeScript library for modeling valid domain objects
and assisting their creation through guided assistants (draft assistants).

<!-- ## Quick Links
- [Getting Started](./modules.md)
- [Assertions API](./modules.md#assertion)
- [Draft Assistants](./modules.md#draft-assistant)
- [Conditions](./modules.md#conditions) -->

## Philosophy

This library is inspired by the ideas of [Hernán Wilkinson](https://github.com/hernanwilkinson)
in his [Diseño a la Gorra](https://github.com/hernanwilkinson/disenioALaGorra) series,
which explores software design as the craft of modeling real-world problems.

In that spirit, self-assert adopts a key principle:  
**A software system is a model of a specific problem domain—and
a good model is valid from the start, and teaches us how to use it.**

This philosophy is reflected in two main ideas:

- `Assertions` make objects responsible for enforcing their
  own validity from the moment of creation.
- `DraftAssistants` help guide the construction of complete and
  valid models, especially in interfaces with the external world
  (like user input or APIs).

Together, they support a design approach where validity is built in,
not patched later.

And because validation rules live inside the domain model—not scattered
across UI forms, API controllers, or data mappers—they remain
**centralized**, **coherent**, and **maintainable** as the system evolves.

### A Note About Documentation

> **TL;DR**: While this documentation site aims to be helpful,
> the source code and tests are the ultimate reference.

Following the philosophy that inspired this project, the
**best documentation of a system is its source code**
—its structure, its behavior, and its tests.

Tests should act as **executable specifications**: they describe what a
model does, how it reacts to invalid states, and how it protects its own
consistency. They are also the **first user** of the system, providing
early feedback on how natural or awkward the design feels.

For this reason, `self-assert`'s test suite
isn’t just about correctness—it’s also meant to serve as a practical
guide to how the library works and how to use it.

## Installation

```bash
npm install self-assert
```

<!-- ## Where to Go Next
- Explore the [Assertions API](TODO)
- Learn how to use [`DraftAssistant`](TODO) -->
