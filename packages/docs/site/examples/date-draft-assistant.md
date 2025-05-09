# `DraftAssistant` for a Date field

::: warning
This example is **not** recommended for use in production, it is
mainly intended for showcase purposes.

The `Date` object is considered a legacy feature.
It is recommended to use the [Temporal API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)
for new projects by MDN.
:::

The following example aims to show how to define
new assistants for specific needs.

Suppose that, for some reason, using a date picker for a Date field
in a form is not possible.

::: code-group

<<< @/../../../examples/draft-assistants/DateDraftAssistant.ts

<<< @/../../../examples/draft-assistants/DateDraftAssistant.test.ts

:::

## Breakdown

This example demonstrates a custom `DraftAssistant` implementation
for a specific case:

- It uses a `SectionDraftAssistant` that wraps a `FieldDraftAssistant<string>`.
- The user inputs a string expected to match the `YYYY-MM-DD` format (ISO date).
- A validation rule ensures the string is a valid date in that format.
- If the validation passes, a `Date` object is created and returned as the model.
- Otherwise, the model is considered invalid and validation errors are exposed.

### Purpose

This showcases how to:

- Build custom assistants for specialized fields.
- Wrap legacy types in a safe and testable way.
- Validate string inputs before converting to more complex objects.
- Compose assistants to manage draft data at multiple levels.
