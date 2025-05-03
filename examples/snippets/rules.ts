import { Assertion, Inquiry, Requirements, Ruleset } from "self-assert";

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
// #region email-unique
const emailMustBeUnique = Inquiry.requiring<string>(
  "user.email.unique",
  "Email must be unique",
  async (email) => !(await isEmailTaken(email))
);
// #endregion email-unique

await emailMustBeUnique.mustHold("taken@email.com");
// #endregion inquiry

const firstNameNotEmptyDescription = "";
const lastNameNotEmptyDescription = "";
// #region ruleset-ensureAll
const firstNameNotEmpty = Assertion.requiring(
  "firstName",
  firstNameNotEmptyDescription,
  Requirements.isNotEmpty
);
const lastNameNotEmpty = Assertion.requiring(
  "lastName",
  lastNameNotEmptyDescription,
  Requirements.isNotEmpty
);

/** Throws because last name is empty */
Ruleset.ensureAll(
  firstNameNotEmpty.evaluateFor("Jane"),
  lastNameNotEmpty.evaluateFor("")
);
// #endregion ruleset-ensureAll

const isDisposable = (email: string) => Promise.resolve(false);
const emailMustNotBeDisposableDescription = "";
// #region ruleset-workOn
const emailMustNotBeDisposable = Inquiry.requiring<string>(
  "email",
  emailMustNotBeDisposableDescription,
  async (email) => !(await isDisposable(email))
);

/** Throws because email is disposable */
await Ruleset.workOn(
  emailMustBeUnique.evaluateFor("example@disposable.com"),
  emailMustNotBeDisposable.evaluateFor("example@disposable.com")
);
// #endregion ruleset-workOn
