import React from "react";
import { ErrorMessage } from "./ErrorMessage";
import type { DraftAssistant } from "self-assert";
import { useDraftAssistantModel } from "../hooks/useDraftAssistantModel";

export type FormFieldProps<
  Model extends string,
  ContainerType extends React.ElementType = "div"
> = React.ComponentPropsWithoutRef<ContainerType> & {
  draftAssistant: DraftAssistant<Model>;
  /**
   * Whether or not to show the broken rules descriptions
   * of the `DraftAssistant`.
   * @default true
   */
  showErrorMessage?: boolean;
  /**
   * The HTML element to use as the container.
   * @default "div"
   */
  as?: ContainerType;
  /**
   * The HTML attributes to apply to the input element.
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> &
    Record<`data-${string}`, unknown>;
  labelText?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement> &
    Record<`data-${string}`, unknown>;
};

export function FormField<
  Model extends string = string,
  ContainerType extends React.ElementType = "div"
>({
  draftAssistant,
  as,
  showErrorMessage = true,
  inputProps,
  labelText,
  labelProps,
  ...rest
}: FormFieldProps<Model, ContainerType>) {
  const [model, setModel] = useDraftAssistantModel(draftAssistant);
  const Wrapper = as ?? "div";

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModel(e.target.value as Model);
  };

  return (
    <Wrapper {...rest}>
      {labelText && <label {...labelProps}>{labelText}</label>}
      <input type="text" {...inputProps} value={model} onChange={onChange} />
      {showErrorMessage && <ErrorMessage draftAssistant={draftAssistant} />}
    </Wrapper>
  );
}
