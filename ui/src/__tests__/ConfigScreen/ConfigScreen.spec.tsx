import React from "react";
import { fireEvent, render, screen } from "@testing-library/react/pure";
import ConfigScreen from "../../containers/ConfigScreen/index";
import AppConfigContext from "../../common/contexts/AppConfigContext";
import ConfigScreenUtils from "../../common/utils/ConfigScreenUtils";

const ConfigScreenObj = {
  configField1: {
    type: "textInputFields",
    labelText: "DAM URL",
    helpText: "Help: DAM domain URL",
    placeholderText: "Placeholder: Enter Your DAM URL",
    instructionText: "Instruction: Your DAM domain URL",
    saveInConfig: true,
    saveInServerConfig: true,
  },
  selectField1: {
    type: "selectInputFields",
    labelText: "DAM Select Input Option 1",
    helpText: "Help: DAM Select Input Option 1",
    placeholderText: "Placeholder: DAM Select Input Option 1",
    instructionText: "Instruction: DAM Select Input Instruction Text",
    options: [
      { label: "option 1", value: "option1" },
      { label: "option 2", value: "option2" },
      { label: "option 3", value: "option3" },
      { label: "option 4", value: "option4" },
      { label: "option 5", value: "option5" },
    ],
    defaultSelectedOption: "option5",
    saveInConfig: true,
    saveInServerConfig: true,
  },
  radioInput1: {
    type: "radioInputFields",
    labelText: "DAM Radio Input Option 1",
    helpText: "Help: DAM Radio Input Option 1",
    instructionText: "Instruction: DAM Radio Input Instruction Text",
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
    saveInServerConfig: true,
  },
};

jest.mock("../../root_config/index.tsx", () => ({
  damEnv: jest.fn(() => ({
    DAM_APP_NAME: "DAM",
  })),
  configureConfigScreen: jest.fn(() => ConfigScreenObj),
  customConfigComponent: jest.fn(() => (
    <div data-testid="custom-config-component" />
  )),
  customWholeJson: jest.fn(() => ({
    customJsonOptions: ["option 1", "option 2", "option 3"],
    defaultFeilds: ["option 1"],
  })),
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

const configLabels = [
  "DAM URL",
  "Instruction: Your DAM domain URL",
  "DAM Select Input Option 1",
  "Instruction: DAM Select Input Instruction Text",
  "DAM Radio Input Option 1",
  "Instruction: DAM Radio Input Instruction Text",
];

let ConfigScreenRenderedDOM: any = null;

const { saveInConfig, saveInServerConfig } =
  ConfigScreenUtils.getSaveConfigOptions(ConfigScreenObj);

const ConfigContextValue = {
  errorState: [],
  installationData: {},
  setInstallationData: jest.fn(),
  appConfig: {},
  jsonOptions: [],
  defaultFeilds: [],
  saveInConfig,
  saveInServerConfig,
  checkConfigFields: jest.fn(),
};

beforeAll(async () => {
  jest.spyOn(React, "useEffect").mockImplementation();
  ConfigScreenRenderedDOM = render(
    <AppConfigContext.Provider value={ConfigContextValue}>
      <ConfigScreen />
    </AppConfigContext.Provider>
  );
});

describe(`UI Elements of Config Screen`, () => {
  configScreenUIElementsIDs.forEach((id: string) => {
    test(`Rendered ${id} element`, async () => {
      expect(screen.getByTestId(`${id}`)).toBeTruthy();
    });
  });

  test(`Rendered 'Select' Venus Component`, () => {
    const selectElement = ConfigScreenRenderedDOM?.container?.querySelector(
      `[data-test-id=cs-select]`
    );
    expect(selectElement).toBeTruthy();
  });

  test(`Input Change: FireEvent Functionality`, async () => {
    const textInput: HTMLInputElement = screen.getByTestId(`text_input`);
    fireEvent.change(textInput, { target: { value: "sample-input" } });
    expect(textInput.value).toBe("sample-input");
  });

  test(`Label Text Rendered`, () => {
    configLabels.forEach((labelText: string) => {
      expect(screen.getByText(`${labelText}`)).toBeTruthy();
    });
  });

  test(`Custom Whole JSON`, () => {
    expect(screen.getByText(`Save In Entry`)).toBeTruthy();
    expect(
      screen.getByText(
        `When you change the settings from All Fields to Custom Fields, and vice versa, the existing assets follow the old configuration settings, whereas new assets added to the entry will store the data according to the updated configuration settings.`
      )
    ).toBeTruthy();
    const allFieldsRadio = screen.getByLabelText("All Fields");
    expect(allFieldsRadio).toBeChecked();
    const customFieldRadio = screen.getByLabelText("Custom Fields");
    expect(customFieldRadio).not.toBeChecked();
    fireEvent.click(customFieldRadio);
    expect(customFieldRadio).toBeChecked();
    expect(allFieldsRadio).not.toBeChecked();
    const selectElement = ConfigScreenRenderedDOM?.container?.querySelector(
      `[data-test-id=cs-select]`
    );
    expect(selectElement).toBeTruthy();
  });
});
