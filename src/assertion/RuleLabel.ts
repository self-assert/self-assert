import type { LabelId, LabeledRule } from "./types";

export interface AssertionLabelAsJson {
  id: LabelId;
  description: string;
}

export class AssertionLabel implements LabeledRule {
  static fromJson({ id, description }: AssertionLabelAsJson): AssertionLabel {
    return new this(id, description);
  }

  constructor(protected id: LabelId, protected description: string) {}

  hasLabel(assertionId: LabelId, assertionDescription: string) {
    return this.hasLabelId(assertionId) && this.hasDescription(assertionDescription);
  }

  hasLabelId(assertionId: LabelId): boolean {
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
