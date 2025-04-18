import { EventEmitter } from "events";

import type { DraftAssistant } from "@/draft-assistant";
import type { DraftViewer } from "@/types";
import type { LabeledAssertion } from "@/assertion";

type PublisherEvents<Model = unknown> =
  | { "draft:updated": [Model] }
  | { "assertions:added": [LabeledAssertion] }
  | { "assertions:reset": [] };

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

  onFailure(aFailedAsserion: LabeledAssertion) {
    this.emit("assertions:added", aFailedAsserion);
  }

  onFailuresReset() {
    this.emit("assertions:reset");
  }
}
