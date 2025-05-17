import React from "react";
import type { DraftAssistant } from "self-assert";

/**
 * Hook to get the descriptions of the broken rules
 * reported by the `DraftAssistant`.
 *
 * @category Hooks
 */
export function useBrokenRulesDescriptions(
  draftAssistant: DraftAssistant
): string[] {
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
