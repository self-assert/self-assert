import React from "react";
import type { DraftAssistant } from "self-assert";
import { useBrokenRulesDescriptions } from "../hooks";

const defaultRenderErrorClosure = (descriptions: string[]) => (
  <ul>
    {descriptions.map((msg, i) => (
      <li key={i}>{msg}</li>
    ))}
  </ul>
);

export type ErrorMessageProps<ContainerType extends React.ElementType = "div"> =
  React.ComponentPropsWithoutRef<ContainerType> & {
    draftAssistant: DraftAssistant;
    brokenRulesDescriptions?: string[];
    renderErrors?: (descriptions: string[]) => React.ReactNode;
    as?: ContainerType;
  };

/**
 * Component to display a DraftAssistant's broken rules.
 */
export function ErrorMessage<ContainerType extends React.ElementType = "div">({
  draftAssistant,
  brokenRulesDescriptions = [],
  renderErrors = defaultRenderErrorClosure,
  as,
  ...rest
}: ErrorMessageProps<ContainerType>) {
  const Wrapper = as ?? "div";
  const descriptions = useBrokenRulesDescriptions(draftAssistant);
  const allDescriptions = [...brokenRulesDescriptions, ...descriptions];

  if (allDescriptions.length === 0) return null;

  return <Wrapper {...rest}>{renderErrors(allDescriptions)}</Wrapper>;
}
