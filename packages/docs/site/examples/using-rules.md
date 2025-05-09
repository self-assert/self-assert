# Using `Rules`

## Handling Async Validations with `Inquiry`

When a rule needs an async check (e.g., server, database, API), use
`Inquiry` instead of `Assertion`.

::: code-group

<<< @/../../../examples/rules/inquiry.ts

:::

You can mix Assertions and Inquiries in the same `Ruleset`:

```ts
await Ruleset.workOn(
  person.nameNotBlank.evaluateFor(name),
  emailMustBeUnique.evaluateFor(email)
);
```
