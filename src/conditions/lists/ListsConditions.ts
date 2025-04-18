import { LogicalConditions } from "../LogicalConditions";

const { identical, not } = LogicalConditions;

import type { Predicate } from "../Conditions";

export class ListsConditions {
  static isEmpty: Predicate<ArrayLike<unknown>> = (list) => identical(0)(list.length);

  static isNotEmpty = not(this.isEmpty);
}
