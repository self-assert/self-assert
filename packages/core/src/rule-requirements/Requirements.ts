/* eslint-disable @typescript-eslint/no-misused-spread */
import { ListsRequirements } from "./lists/ListsRequirements";
import { LogicalRequirement } from "./LogicalRequirements";
import { NumbersRequirements } from "./numbers/NumbersRequirements";

import type { RuleRequirement } from "../rule";

/**
 * @category Supporting types
 */
export type Predicate<ValueType> = RuleRequirement<boolean, ValueType>;

const { not } = LogicalRequirement;

class StringsRequirements {
  /**
   * A predicate that evaluates to `true` if the string is empty or contains only whitespace characters.
   * @function @category Strings
   * @see {@link isNotBlank}
   */
  static isBlank: Predicate<string> = (value) =>
    ListsRequirements.isEmpty(value.trim());

  /**
   * Opposite of {@link isBlank}.
   * @function @category Strings
   */
  static isNotBlank = not(this.isBlank);
}

/**
 * A collection of common rule requirements.
 *
 * It also provides a way to compose requirements using the `and`, `or` and `not` functions.
 *
 * @namespace
 *
 * @category Rules
 * @categoryDescription Composition
 * Methods for composing requirements. Example:
 * {@includeCode ../../examples/snippets/requirements.ts#composition}
 */
export const Requirements = {
  /**
   * A predicate that always evaluates to `true`.
   */
  hold: () => true,
  /**
   * A predicate that always evaluates to `false`.
   */
  fail: () => false,
  ...LogicalRequirement,
  ...NumbersRequirements,
  ...ListsRequirements,
  ...StringsRequirements,
  /**
   * @hidden
   * @privateRemarks
   * This is to avoid TypeDoc from showing the prototype in the docs
   */
  prototype: Object.prototype,
};
