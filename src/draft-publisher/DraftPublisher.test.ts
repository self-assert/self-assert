import { describe, expect, it } from "@jest/globals";
import { TestObjectsBucket } from "@testing-support/TestObjectsBucket";

import { DraftPublisher } from "./DraftPublisher";
import { LabeledRule } from "../rule";

describe("DraftPublisher", () => {
  it("should emit a 'draft:updated' event when the draft is changed", () => {
    const assistant = TestObjectsBucket.createNameAssistant();
    const publisher = DraftPublisher.for(assistant);

    let eventModel = "None";
    publisher.on("draft:updated", (model) => {
      eventModel = model;
    });

    assistant.setModel("Changed");

    expect(eventModel).toBe("Changed");
  });

  it("should emit a 'draft:updated' event every time the draft is changed", () => {
    const assistant = TestObjectsBucket.createNameAssistant();
    const publisher = DraftPublisher.for(assistant);

    let eventModel = "None";
    publisher.on("draft:updated", (model) => {
      eventModel = model;
    });

    assistant.setModel("Changed");
    assistant.setModel("Changed Again");

    expect(eventModel).toBe("Changed Again");
  });

  it("should emit a 'assertions:added' event when assertions are added", () => {
    const assistant = TestObjectsBucket.createNameAssistant();
    const publisher = DraftPublisher.for(assistant);

    const eventAssertions: LabeledRule[] = [];
    publisher.on("assertions:added", (assertions) => {
      eventAssertions.push(assertions);
    });

    const firstFailedAssertion = TestObjectsBucket.failingAssertion("AID.1", "1 description");
    const secondFailedAssertion = TestObjectsBucket.failingAssertion("AID.2", "2 description");

    assistant.addFailedAssertion(firstFailedAssertion);
    assistant.addFailedAssertion(secondFailedAssertion);

    expect(eventAssertions).toEqual([firstFailedAssertion, secondFailedAssertion]);
  });

  it("should emit a 'assertions:reset' event when assertions are reset", () => {
    const assistant = TestObjectsBucket.createNameAssistant();
    const publisher = DraftPublisher.for(assistant);
    let wasReset = false;
    publisher.on("assertions:reset", () => {
      wasReset = true;
    });

    assistant.removeFailedAssertions();

    expect(wasReset).toBe(true);
  });
});
