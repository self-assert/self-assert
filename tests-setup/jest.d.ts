import "@jest/expect";

declare module "@jest/expect" {
  interface Matchers<R> {
    toFailAssertion(anAID: string, description: string): R;
  }
}
