import { Assertion, Requirements } from "self-assert";

// #region require
const nameValid = Assertion.requiring(
  "customer.name.notBlank",
  "Name must not be blank",
  Requirements.isNotBlank
);
nameValid.require((name) => name !== "Johnny");

console.log(nameValid.hasFailed("")); // true
console.log(nameValid.hasFailed("Johnny")); // true
console.log(nameValid.doesHold("John")); // true
// #endregion require
