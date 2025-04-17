import type { AssertionId, LabeledAssertion } from "./types";

export interface AssertionLabelAsJson {
  id: AssertionId;
  description: string;
}

export class AssertionLabel implements LabeledAssertion {
  static fromJson({ id, description }: AssertionLabelAsJson): AssertionLabel {
    return new this(id, description);
  }

  constructor(protected id: AssertionId, protected description: string) {}

  hasLabel(assertionId: AssertionId, assertionDescription: string) {
    return this.hasLabelId(assertionId) && this.hasDescription(assertionDescription);
  }

  hasLabelId(assertionId: AssertionId): boolean {
    return this.id === assertionId;
  }

  hasDescription(description: string): boolean {
    return this.description === description;
  }

  getId() {
    return this.id;
  }

  getDescription(): string {
    return this.description;
  }
}
