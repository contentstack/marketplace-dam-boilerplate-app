import React, { useEffect, useState } from "react";
import { Field, Select } from "@contentstack/venus-components";
import { TypeCustomConfig, TypeOption } from "../../common/types";
import "../styles.scss";

const CustomConfig: React.FC<TypeCustomConfig> = function ({
  customConfig,
  currentConfigLabel,
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { config, serverConfig, handleCustomConfigUpdate } = customConfig ?? {
    config: {},
    serverConfig: {},
    handleCustomConfigUpdate: () => {},
  };
  const [selectValues, setSelectValues] = useState<TypeOption[] | null>(null);

  const getOptions = (num: number) => {
    const options: TypeOption[] = [];
    for (let i = 0; i < num; i += 1) {
      options[i] = {
        label: `item ${i}`,
        value: `value_${i}`,
      };
    }
    return options;
  };

  useEffect(() => {
    let savedValue: TypeOption[] | null = null;
    if (customConfig?.config?.customField) {
      savedValue = customConfig?.config?.customField;
    }
    if (
      currentConfigLabel &&
      customConfig?.config?.multi_config_keys?.[currentConfigLabel]?.customField
    ) {
      savedValue =
        customConfig?.config?.multi_config_keys?.[currentConfigLabel]
          ?.customField;
    }
    setSelectValues(savedValue);
  }, []);

  return (
    <Field>
      <Select
        selectLabel="Sample Multiple Select"
        placeholder="Select Multiple Options"
        value={selectValues}
        isMulti
        isClearable
        name="multi-select"
        version="v2"
        className="sample-multiple-select"
        multiDisplayLimit={4}
        options={getOptions(10)}
        onChange={(value: TypeOption[]) => {
          setSelectValues(value);
          handleCustomConfigUpdate(currentConfigLabel, "customField", value); // currentConfigLabel is MultiConfig label and is required.
        }}
      />
    </Field>
  );
};

export default CustomConfig;
