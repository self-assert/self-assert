import { Inquiry, Ruleset, RulesBroken } from "self-assert";

function isEmailTaken(email: string): Promise<boolean> {
  return Promise.resolve(email.toLowerCase() === "taken@email.com");
}

const emailMustBeUnique = Inquiry.requiring<string>(
  "user.email.unique",
  "Email must be unique",
  async (email) => !(await isEmailTaken(email))
);

async function runInquiry() {
  try {
    await Ruleset.workOn(emailMustBeUnique.evaluateFor("taken@email.com"));
  } catch (error) {
    if (error instanceof RulesBroken) {
      console.log("Inquiry failed:");
      console.log(error);
    }
  }
}

runInquiry()
  .catch(console.error)
  .finally(() => {
    console.log("Done");
  });
