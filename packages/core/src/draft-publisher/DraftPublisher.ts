import { EventEmitter } from "events";

import type { DraftAssistant } from "../draft-assistant";
import type { DraftViewer } from "../types";
import type { LabeledRule } from "../rule";

/**
 * Events emitted by a {@link DraftPublisher}.
 *
 * This allows consumers to subscribe to:
 * - `draft:updated`: when the draft model changes
 * - `assertions:added`: when a new failed assertion is reported
 * - `assertions:reset`: when all failed assertions are cleared
 *
 * @category Draft assistants
 */
export type PublisherEvents<Model = unknown> =
  | { "draft:updated": [Model] }
  | { "assertions:added": [LabeledRule] }
  | { "assertions:reset": [] };

/**
 * Observes changes to a {@link DraftAssistant} by emitting structured events.
 *
 * `DraftPublisher` provides an alternative to the {@link DraftViewer} interface for reacting to changes in a draft.
 * Instead of relying on callbacks, it follows an event-driven approach using `EventEmitter`.
 *
 * This allows consumers to subscribe to {@link PublisherEvents}.
 *
 * This can be especially useful when integrating with frameworks or systems already based on events.
 *
 * @example
 * ```ts
 * const assistant = SectionDraftAssistant.handling(...);
 * const publisher = DraftPublisher.for(assistant);
 *
 * publisher.on("draft:updated", (model) => {
 *   console.log("Draft changed:", model);
 * });
 * ```
 *
 * @template Model The type of model the assistant works with.
 *
 * @category Draft assistants
 */
export class DraftPublisher<Model = unknown>
  extends EventEmitter<PublisherEvents<Model>>
  implements DraftViewer<Model>
{
  static for<Model = unknown>(anAssistant: DraftAssistant<Model, never>) {
    const instance = new this<Model>();
    anAssistant.accept(instance);
    return instance;
  }

  onDraftChanged(aModel: Model) {
    this.emit("draft:updated", aModel);
  }

  onFailure(aFailedAsserion: LabeledRule) {
    this.emit("assertions:added", aFailedAsserion);
  }

  onFailuresReset() {
    this.emit("assertions:reset");
  }
}
