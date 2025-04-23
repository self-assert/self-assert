import { Assertion, Ruleset, FieldDraftAssistant, SectionDraftAssistant, Requirements } from "self-assert";

class Task {
  static readonly nameNotBlank = Assertion.requiring(
    "task.name.notBlank",
    "Task name must not be blank",
    Requirements.isNotBlank
  );

  static create(name: string) {
    Ruleset.ensureAll(this.nameNotBlank.evaluateFor(name));
    return new this(name);
  }

  protected constructor(protected name: string) {}

  getName() {
    return this.name;
  }
}

const nameAssistant = FieldDraftAssistant.handling<Task>("task.name.notBlank", (task) => task.getName());

const taskAssistant = SectionDraftAssistant.topLevelContainerWith<Task, [string]>(
  [nameAssistant],
  (name) => Task.create(name),
  []
);

nameAssistant.setModel("  ");

taskAssistant.withCreatedModelDo(
  () => {
    throw new Error("this should not happen");
  },
  () => console.log("Task not created")
);

nameAssistant.setModel("Write README");

taskAssistant.withCreatedModelDo(
  (task) => console.log(`Task created: ${task.getName()}`),
  () => {
    throw new Error("this should not happen");
  }
);
