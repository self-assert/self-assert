import { Assertion, Inquiry, Requirements } from "self-assert";

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

// #region evaluateFor
const nameNotBlank = Assertion.requiring(
  "customer.name.notBlank",
  "Name must not be blank",
  Requirements.isNotBlank
);
const evaluation = nameNotBlank.evaluateFor("John");

console.log(evaluation.doesHold()); // true
// #endregion evaluateFor

// #region assertion-basic-usage
const integerGreaterThan42 = Assertion.requiring(
  "integer.greaterThan42",
  "A human-readable description",
  Requirements.and(Requirements.isInteger, Requirements.greaterThan(42))
);

console.log(integerGreaterThan42.doesHold(42)); // false
console.log(integerGreaterThan42.doesHold(42.1)); // false
console.log(integerGreaterThan42.doesHold(43)); // true
// #endregion assertion-basic-usage

const isReady = () => true;
// #region assertion-requiring-void
/** Typed as Assertion<void> */
const systemIsReady = Assertion.requiring(
  "sys.ready",
  "System must be ready",
  () => isReady()
);
// #endregion assertion-requiring-void

// #region assertion-requiring-value
/** Typed as Assertion<number> */
const greaterThan18 = Assertion.requiring(
  "age.min",
  "Must be over 18",
  (age: number) => age > 18
);
// #endregion assertion-requiring-value

const isEmailTaken = (email: string) => Promise.resolve(false);
// #region inquiry
const emailMustBeUnique = Inquiry.requiring<string>(
  "user.email.unique",
  "Email must be unique",
  async (email) => !(await isEmailTaken(email))
);

await emailMustBeUnique.mustHold("taken@email.com");
// #endregion inquiry
