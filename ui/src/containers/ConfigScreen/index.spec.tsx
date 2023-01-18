import React from "react";
import { fireEvent, render, screen } from "@testing-library/react/pure";
import ConfigScreen from "./index";

jest.mock("../../root_config/index.tsx", () => ({
  damEnv: jest.fn(() => ({
    DAM_APP_NAME: "DAM",
  })),
  configureConfigScreen: jest.fn(() => ({
    configField1: {
      type: "textInputFields",
      labelText: "DAM URL",
      helpText: "DAM domain URL",
      placeholderText: "Enter Your DAM URL",
      instructionText: "Your DAM domain URL",
      saveInConfig: false,
      saveInServerConfig: true,
    },
    selectField1: {
      type: "selectInputFields",
      labelText: "DAM Select Input Option 1",
      helpText: "DAM Select Input Option 1",
      placeholderText: "DAM Select Input Option 1",
      instructionText: "DAM Select Input Instruction Text",
      options: [
        { label: "option 1", value: "option1" },
        { label: "option 2", value: "option2" },
        { label: "option 3", value: "option3" },
        { label: "option 4", value: "option4" },
        { label: "option 5", value: "option5" },
      ],
      defaultSelectedOption: "option5",
      saveInConfig: true,
      saveInServerConfig: false,
    },
    radioInput1: {
      type: "radioInputFields",
      labelText: "DAM Radio Input Option 1",
      helpText: "DAM Radio Input Option 1",
      instructionText: "DAM Radio Input Instruction Text",
      options: [
        {
          label: "Single Select",
          value: "SingleSelect",
        },
        {
          label: "Multi Select",
          value: "MultiSelect",
        },
      ],
      defaultSelectedOption: "MultiSelect",
      saveInConfig: true,
      saveInServerConfig: false,
    },
  })),
  customConfig: jest.fn(() => <div data-testid="custom-config-component" />),
}));

const configScreenUIElementsIDs = [
  "config-wrapper",
  "text_label",
  "text_help",
  "text_input",
  "text_instruction",
  "radio_label",
  "radio_help",
  "radio_wrapper",
  "radio_instruction",
  "select_label",
  "select_help",
  "select_instruction",
  "custom-config-component",
];

let configScreenRenderedDOM: any = null;
beforeAll(async () => {
  jest.spyOn(React, "useEffect").mockImplementation();
  configScreenRenderedDOM = render(<ConfigScreen />);
});

describe(`UI Elements of Config Screen`, () => {
  configScreenUIElementsIDs.forEach((id: string) => {
    test(`Rendered ${id} element`, async () => {
      expect(screen.getByTestId(`${id}`)).toBeTruthy();
    });
  });

  test(`Rendered 'Select' Venus Component`, () => {
    const selectElement = configScreenRenderedDOM?.container?.querySelector(
      `[data-test-id=cs-select]`
    );
    expect(selectElement).toBeTruthy();
  });

  test(`Input Change: FireEvent Functionality`, async () => {
    const textInput: HTMLInputElement = screen.getByTestId(`text_input`);
    fireEvent.change(textInput, { target: { value: "sample-input" } });
    expect(textInput.value).toBe("sample-input");
  });
});
