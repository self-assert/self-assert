# Philosophy

> A software system is a model of a real-world domain — and a good model
> is valid from the start.

`self-assert` encourages a design mindset where validity is **not checked
externally**, but instead **built into** the objects themselves.

Rather than placing validation in UI forms, DTOs, services,
or controllers, this library promotes expressing rules as part of
the model.

This philosophy is reflected in two key ideas:

- `Rules` express what must hold true for an object to be valid.
  They are enforced during object creation, ensuring that invalid
  objects are never instantiated.
- `DraftAssistants` help guide the construction of complete and valid models,
  especially in interactions with the external world (such as user input or APIs).

By placing validation rules inside the model:

- **Duplication is reduced** — rules are not scattered across different layers.
- **Maintainability** improves — changes to the domain are reflected
  naturally in the model itself.

This leads to more cohesive and robust systems, where validity is an intrinsic
property, not an afterthought.

## A Note About Documentation

::: info TL;DR
While this documentation site aims to be helpful,
the source code and tests are the ultimate reference.
:::

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
