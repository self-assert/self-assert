import type { AssertionId } from "./types";

export class AssertionLabel {
  constructor(protected id: AssertionId, protected description: string) {}

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
