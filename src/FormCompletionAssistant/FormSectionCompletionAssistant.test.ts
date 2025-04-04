import { describe, expect, it } from "@jest/globals";
import { FormSectionCompletionAssistant } from "./FormSectionCompletionAssistant";
import { FormFieldCompletionAssistant } from "./FormFieldCompletionAssistant";
import { FormCompletionAssistant } from "./FormCompletionAssistant";

class TestModel {
  constructor(protected name: string) {}

  getName(): string {
    return this.name;
  }
}

const nameAssistant = FormFieldCompletionAssistant.handling<string, TestModel>("", (model) => model.getName());

describe("FormSectionCompletionAssistant", () => {
  it("should be created invalid", () => {
    const assistant = FormSectionCompletionAssistant.with(
      [nameAssistant],
      (name) => new TestModel(name),
      () => new TestModel(""),
      ["nameAID"]
    );
    expect(FormCompletionAssistant.isInvalidModel(assistant.getModel())).toBe(true);
  });
});
