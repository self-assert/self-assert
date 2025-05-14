import "@testing-library/jest-dom";
import { act, render, screen, fireEvent } from "@testing-library/react";
import { FieldDraftAssistant, RuleLabel } from "self-assert";
import { FormField } from "./FormField";

const rule = new RuleLabel("some.rule", "Some error");
const initialValue = "initial";

const assistant = FieldDraftAssistant.handlingAll(
  [rule.getId()],
  () => "",
  initialValue
);

describe("FormField", () => {
  beforeEach(() => {
    assistant.resetModel();
    assistant.removeBrokenRules();
  });

  test("renders input with initial model value", () => {
    render(
      <FormField
        draftAssistant={assistant}
        inputProps={{ placeholder: "Your name", name: "name" }}
      />
    );

    const input = screen.getByPlaceholderText("Your name");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(initialValue);
  });

  test("updates model value on input change", () => {
    render(
      <FormField
        draftAssistant={assistant}
        inputProps={{ placeholder: "Your name", name: "name" }}
      />
    );

    const input = screen.getByPlaceholderText("Your name");

    act(() => {
      fireEvent.change(input, { target: { value: "John" } });
    });

    expect(assistant.getModel()).toBe("John");
  });

  test("renders the label when labelText is provided", () => {
    render(
      <FormField
        draftAssistant={assistant}
        labelText="First Name"
        inputProps={{ placeholder: "Your name", name: "name" }}
      />
    );

    expect(screen.getByText("First Name")).toBeInTheDocument();
  });

  test("does not render ErrorMessage when showErrorMessage is false", () => {
    render(
      <FormField
        draftAssistant={assistant}
        showErrorMessage={false}
        inputProps={{ placeholder: "Your name", name: "name" }}
      />
    );

    act(() => {
      assistant.addBrokenRule(rule);
    });

    expect(screen.queryByText(rule.getDescription())).not.toBeInTheDocument();
  });

  test("renders ErrorMessage when showErrorMessage is true (default)", () => {
    render(
      <FormField
        draftAssistant={assistant}
        inputProps={{ placeholder: "Your name", name: "name" }}
      />
    );

    act(() => {
      assistant.addBrokenRule(rule);
    });

    expect(screen.getByText(rule.getDescription())).toBeInTheDocument();
  });

  test("renders custom wrapper when 'as' prop is provided", () => {
    render(
      <FormField
        draftAssistant={assistant}
        as="section"
        inputProps={{ placeholder: "Your name", name: "name" }}
      />
    );

    const wrapper = screen.getByPlaceholderText("Your name").closest("section");
    expect(wrapper).toBeInTheDocument();
  });

  test("passes extra className to wrapper", () => {
    const { container } = render(
      <FormField
        draftAssistant={assistant}
        className="custom-wrapper"
        inputProps={{ placeholder: "Your name", name: "name" }}
      />
    );

    expect(container.firstChild).toHaveClass("custom-wrapper");
  });

  test("forwards inputProps correctly", () => {
    render(
      <FormField
        draftAssistant={assistant}
        inputProps={{
          "data-testid": "custom-input",
          type: "email",
          placeholder: "Your name",
          name: "name",
        }}
      />
    );

    const input = screen.getByTestId("custom-input");
    expect(input).toHaveAttribute("type", "email");
  });

  test("forwards labelProps correctly", () => {
    render(
      <FormField
        draftAssistant={assistant}
        labelText="My Label"
        labelProps={{ "data-testid": "custom-label" }}
      />
    );

    expect(screen.getByTestId("custom-label")).toHaveTextContent("My Label");
  });

  test("accepts externar rules descriptions", () => {
    render(
      <FormField
        draftAssistant={assistant}
        inputProps={{ placeholder: "Your name", name: "name" }}
        brokenRulesDescriptions={[rule.getDescription()]}
      />
    );

    expect(screen.getByText(rule.getDescription())).toBeInTheDocument();
  });
  
});
