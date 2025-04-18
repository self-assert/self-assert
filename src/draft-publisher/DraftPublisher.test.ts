import { describe, expect, it } from "@jest/globals";
import { TestObjectsBucket } from "@testing-support/TestObjectsBucket";

import { DraftPublisher } from "./DraftPublisher";

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
});
