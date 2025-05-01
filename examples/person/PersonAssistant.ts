import {
  FieldDraftAssistant,
  IntegerDraftAssistant,
  SectionDraftAssistant,
} from "self-assert";
import { Person } from "./Person";

// #region assistant-creation
function createPersonAssistant() {
  const nameAssistant = FieldDraftAssistant.handlingAll(
    ["name.notBlank"],
    (person: Person) => person.getName()
  );

  const ageAssistant = IntegerDraftAssistant.for(
    "age.positive",
    (person: Person) => person.getAge()
  );

  const personAssistant = SectionDraftAssistant.topLevelContainerWith(
    [nameAssistant, ageAssistant],
    (name, age) => Person.named(name, age),
    []
  );

  return Object.assign(personAssistant, { nameAssistant, ageAssistant });
}
// #endregion assistant-creation

// #region assistant-usage
const personAssistant = createPersonAssistant();

personAssistant.nameAssistant.setModel("   ");
personAssistant.ageAssistant.setModel(30);

personAssistant.withCreatedModelDo(
  () => {
    throw new Error("this should not happen");
  },
  () => console.log("Person not created")
);

console.log(personAssistant.hasBrokenRules());

personAssistant.nameAssistant.setModel("John");
personAssistant.ageAssistant.setModel(50);

personAssistant.withCreatedModelDo(
  (person) => console.log(`Person created: ${person.getName()}`),
  () => {
    throw new Error("this should not happen");
  }
);
// #endregion assistant-usage
