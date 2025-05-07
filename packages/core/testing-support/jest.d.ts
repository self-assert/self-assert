import "@jest/expect";

declare module "@jest/expect" {
  interface Matchers<R> {
    toFailAssertion(anAID: string, description: string): R;

    toHoldWith(aValue?: unknown): R;
    toFailWith(aValue?: unknown): R;
    toHold(): R;
    toFail(): R;
  }
}
