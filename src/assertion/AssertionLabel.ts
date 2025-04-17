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

  isIdentifiedAsWith(assertionId: AssertionId, assertionDescription: string) {
    return this.isIdentifiedAs(assertionId) && this.hasDescription(assertionDescription);
  }

  isIdentifiedAs(assertionId: AssertionId): boolean {
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
