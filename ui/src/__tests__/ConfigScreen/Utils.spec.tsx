import { Notification } from "@contentstack/venus-components";
import ConfigScreenUtils from "../../common/utils/ConfigScreenUtils";

jest.mock("@contentstack/venus-components", () => ({
  Notification: jest.fn(),
}));

jest.mock("../../root_config/index.tsx", () => ({
  customWholeJson: () => {
    const customJsonOptions: string[] = ["option 1", "option 2"];
    const defaultFeilds: string[] = ["option 1"];
    return {
      customJsonOptions,
      defaultFeilds,
    };
  },
}));

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

describe("mergeObjects", () => {
  it("should merge properties from source to target", () => {
    const target = {
      prop1: "value1",
      prop2: "value2",
    };
    const source = {
      prop3: "value3",
      prop4: "value4",
    };
    const result = ConfigScreenUtils.mergeObjects(target, source);
    expect(result).toEqual({
      prop1: "value1",
      prop2: "value2",
      prop3: "value3",
      prop4: "value4",
    });
  });

  it("should overwrite properties in target with properties from source", () => {
    const target = {
      prop1: "value1",
      prop2: "value2",
    };
    const source = {
      prop2: "newValue",
    };
    const result = ConfigScreenUtils.mergeObjects(target, source);
    expect(result).toEqual({
      prop1: "value1",
      prop2: "newValue",
    });
  });

  it("should recursively merge nested objects", () => {
    const target = {
      prop1: {
        nested1: "value1",
      },
    };
    const source = {
      prop1: {
        nested2: "value2",
      },
    };
    const result = ConfigScreenUtils.mergeObjects(target, source);
    expect(result).toEqual({
      prop1: {
        nested1: "value1",
        nested2: "value2",
      },
    });
  });
});

describe("toastMessage", () => {
  it("should call Notification with correct params", () => {
    const type = "success";
    const text = "Test message";
    ConfigScreenUtils.toastMessage({ type, text });
    expect(Notification).toHaveBeenCalledWith({
      notificationContent: {
        text,
      },
      notifyProps: {
        className: "modal_toast_message",
        hideProgressBar: true,
      },
      type,
    });
  });
});

describe("getOptions", () => {
  it("should return array of objects with label & value", () => {
    const arr = ["opt1", "opt2"];
    const expected = [
      {
        label: "opt1",
        value: "opt1",
        isDisabled: false,
      },
      { label: "opt2", value: "opt2", isDisabled: false },
    ];
    expect(ConfigScreenUtils.getOptions(arr)).toEqual(expected);
  });

  it("should use defaultFeilds array if provided", () => {
    const arr = ["opt1", "opt2"];
    const defaultFields = ["opt1"];
    const expected = [
      { label: "opt1", value: "opt1", isDisabled: true },
      { label: "opt2", value: "opt2", isDisabled: false },
    ];
    expect(ConfigScreenUtils.getOptions(arr, defaultFields)).toEqual(expected);
  });
});

describe("configRootUtils", () => {
  it("should return custom config from rootConfig", () => {
    const expected = {
      customJsonConfigObj: {
        dam_keys: [
          {
            isDisabled: false,
            label: "option 1",
            value: "option 1",
          },
        ],
        is_custom_json: false,
      },
      defaultFeilds: [
        {
          isDisabled: false,
          label: "option 1",
          value: "option 1",
        },
      ],
      jsonOptions: [
        {
          isDisabled: true,
          label: "option 1",
          value: "option 1",
        },
        {
          isDisabled: false,
          label: "option 2",
          value: "option 2",
        },
      ],
    };
    expect(ConfigScreenUtils.configRootUtils()).toEqual(expected);
  });
});

describe("getSaveConfigOptions", () => {
  it("should return config objects to be saved", () => {
    const configInputFields = {
      field1: { saveInConfig: true },
      field2: { saveInServerConfig: true },
    };
    const expected = {
      saveInConfig: {
        field1: {
          saveInConfig: true,
        },
      },
      saveInServerConfig: {
        field2: {
          saveInServerConfig: true,
        },
      },
    };
    const result = ConfigScreenUtils.getSaveConfigOptions(configInputFields);
    expect(result).toEqual(expected);
  });
});

describe("getDefaultInputValues", () => {
  it("should return object with saveInConfig and saveInServerConfig properties", () => {
    const result = ConfigScreenUtils.getDefaultInputValues(ConfigScreenObj);
    expect(result).toEqual({
      radioValuesKeys: ["radioInput1", "radioInput1"],
      selectValuesKeys: ["selectField1", "selectField1"],
    });
  });
});

describe("getIntialValueofComponents", () => {
  it("should return initial values from savedData", () => {
    const { radioValuesKeys, selectValuesKeys } =
      ConfigScreenUtils.getDefaultInputValues(ConfigScreenObj);
    expect(
      ConfigScreenUtils.getIntialValueofComponents({
        savedData: {
          selectField1: "option5",
          radioInput1: "MultiSelect",
          textField: "example text",
        },
        radioValuesKeys,
        selectValuesKeys,
        configInputFields: ConfigScreenObj,
      })
    ).toEqual({
      radioValuesObj: {
        radioInput1: {
          label: "Multi Select",
          value: "MultiSelect",
        },
      },
      selectValuesObj: {
        selectField1: {
          label: "option 5",
          value: "option5",
        },
      },
    });
  });
});
