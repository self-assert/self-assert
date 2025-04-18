import { EventEmitter } from "events";

import type { DraftAssistant } from "@/draft-assistant";
import type { DraftViewer } from "@/types";

type PublisherEvents = "draft:updated";
type PublisherEventsMap<Model = unknown> = Record<PublisherEvents, [Model]>;

export class DraftPublisher<Model = unknown>
  extends EventEmitter<PublisherEventsMap<Model>>
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
}
