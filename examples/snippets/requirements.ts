import { Requirements } from "self-assert";

// #region composition
const myRequirement = Requirements.and(
  Requirements.greaterThan(0),
  (value) => value % 42 === 0
);

console.log(myRequirement(0)); // false
console.log(myRequirement(42)); // true
// #endregion composition
