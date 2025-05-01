---
title: Getting started
---

# Getting started

## Try It Live

You can try `self-assert` directly in your browser on [CodeSandbox](https://codesandbox.io/p/sandbox/github/self-assert/self-assert-react-demo).

## Installation

::: code-group

```sh [npm]
npm install self-assert
```

```sh [pnpm]
pnpm add self-assert
```

```sh [yarn]
yarn add self-assert
```

:::

## Validating Domain Objects with `Assertion`

The `Assertion` class lets you express rules declaratively. You can:

- Define **self-contained** rules (no parameters)
- Define **reusable** rules that apply to different values

A typical example:

::: code-group

<<< ../examples/person/Person.ts

:::

If any rule fails, a `RulesBroken` error is thrown with details.

## Suggesting Completion with Draft Assistants

`FieldDraftAssistant` and `SectionDraftAssistant` help you manage
**incomplete** or draft objects, especially useful in UI flows or external interfaces.

::: code-group

<<< ../examples/person/PersonAssistant.ts#assistant-creation

:::

The assistant lets you defer object creation until all validations pass:

::: code-group

<<< ../examples/person/PersonAssistant.ts#assistant-usage

:::
