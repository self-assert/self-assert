import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { FieldDraftAssistant, RuleLabel } from "self-assert";
import { ErrorMessage } from "./ErrorMessage";

const firstHandledRule = new RuleLabel("handled.error", "An error description");
const secondHandledRule = new RuleLabel(
  "handled.error2",
  "Another error description"
);

const fieldAssistant = FieldDraftAssistant.handlingAll(
  [firstHandledRule.getId(), secondHandledRule.getId()],
  () => ""
);

describe("ErrorMessage", () => {
  beforeEach(() => {
    fieldAssistant.removeBrokenRules();
  });

  test("it should be empty if there are no errors", () => {
    const { container } = render(
      <ErrorMessage draftAssistant={fieldAssistant} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("it should render the error description when the draft has a broken rule", () => {
    render(<ErrorMessage draftAssistant={fieldAssistant} />);

    act(() => {
      fieldAssistant.addBrokenRule(firstHandledRule);
    });

    expect(
      screen.getByText(firstHandledRule.getDescription())
    ).toBeInTheDocument();
  });

  test("it should render the error descriptions when the draft has multiple broken rules", () => {
    render(<ErrorMessage draftAssistant={fieldAssistant} />);

    act(() => {
      fieldAssistant.addBrokenRules([firstHandledRule, secondHandledRule]);
    });

    expect(
      screen.getByText(firstHandledRule.getDescription())
    ).toBeInTheDocument();
    expect(
      screen.getByText(secondHandledRule.getDescription())
    ).toBeInTheDocument();
  });

  test("it should apply the given className to the wrapper element", () => {
    const className = "custom-class";
    const { container } = render(
      <ErrorMessage draftAssistant={fieldAssistant} className={className} />
    );

    act(() => {
      fieldAssistant.addBrokenRule(firstHandledRule);
    });

    expect(container.firstChild).toHaveClass(className);
  });

  test("it should render using the provided renderErrors prop", () => {
    const customRenderer = (messages: string[]) => (
      <p>{messages.join(" | ")}</p>
    );
    render(
      <ErrorMessage
        draftAssistant={fieldAssistant}
        renderErrors={customRenderer}
      />
    );

    act(() => {
      fieldAssistant.addBrokenRules([firstHandledRule, secondHandledRule]);
    });

    expect(
      screen.getByText(
        `${firstHandledRule.getDescription()} | ${secondHandledRule.getDescription()}`
      )
    ).toBeInTheDocument();
  });

  test("it should use the specified element type via 'as' prop", () => {
    render(<ErrorMessage draftAssistant={fieldAssistant} as="section" />);

    act(() => {
      fieldAssistant.addBrokenRule(firstHandledRule);
    });

    const section = screen
      .getByText(firstHandledRule.getDescription())
      .closest("section");
    expect(section).not.toBeNull();
    expect(section).toBeInTheDocument();
  });
});
