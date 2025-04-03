import "@jest/expect";
// import type { AssertionId } from "../src/Assertion/Assertion";

declare module "@jest/expect" {
  interface Matchers<R> {
    toFailAssertion(anAID: string, description: string): R;
  }
}
