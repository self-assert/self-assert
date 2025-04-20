import type { AssertionLabel } from "./AssertionLabel";
import type { AssertionId, LabeledAssertion } from "./types";

export abstract class Rule implements LabeledAssertion {
  protected constructor(protected label: AssertionLabel) {}

  hasLabel(anId: AssertionId, aDescription: string) {
    return this.label.hasLabel(anId, aDescription);
  }

  hasDescription(aDescription: string) {
    return this.label.hasDescription(aDescription);
  }

  hasLabelId(anId: AssertionId) {
    return this.label.hasLabelId(anId);
  }

  getId(): AssertionId {
    return this.label.getId();
  }

  getDescription() {
    return this.label.getDescription();
  }
}
