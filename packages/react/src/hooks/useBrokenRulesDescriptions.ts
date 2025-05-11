import React from "react";
import type { DraftAssistant } from "self-assert";

export function useBrokenRulesDescriptions(draftAssistant: DraftAssistant) {
  const [errors, setErrors] = React.useState<string[]>([]);

  React.useEffect(() => {
    const draftViewer = {
      onFailure: () => setErrors(draftAssistant.brokenRulesDescriptions()),
      onFailuresReset: () => setErrors([]),
    };

    draftAssistant.accept(draftViewer);

    return () => draftAssistant.removeViewer(draftViewer);
  }, [draftAssistant]);

  return errors;
}
