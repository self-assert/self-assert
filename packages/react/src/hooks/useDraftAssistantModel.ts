import React from "react";
import type { DraftAssistant, DraftViewer } from "self-assert";

/**
 * Hook to get and set the model of a `DraftAssistant`,
 * triggering a re-render whenever the model changes.
 *
 * @category Hooks
 */
export function useDraftAssistantModel<Model>(
  draftAssistant: DraftAssistant<Model>
): [Model, (aModel: Model) => void] {
  const [model, setModel] = React.useState(draftAssistant.getModel());

  const onChange = React.useCallback(
    (aModel: Model) => {
      draftAssistant.setModel(aModel);
    },
    [draftAssistant]
  );

  React.useEffect(() => {
    const draftViewer: DraftViewer<Model> = {
      onDraftChanged: (aModel) => {
        setModel(aModel);
      },
    };

    draftAssistant.accept(draftViewer);

    return () => draftAssistant.removeViewer(draftViewer);
  }, [draftAssistant]);

  return [model, onChange];
}
