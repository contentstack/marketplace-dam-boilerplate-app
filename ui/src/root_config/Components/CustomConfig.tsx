import React, { useState } from "react";
import { Field, Select } from "@contentstack/venus-components";
import { TypeCustomConfig } from "../../common/types";
import "../styles.scss";

const CustomConfig: React.FC<TypeCustomConfig> = function ({
  customConfig,
  currentConfigLabel,
}) {
  // eslint-disable-next-line
  const { config, serverConfig, handleCustomConfigUpdate } = customConfig ?? {
    config: {},
    serverConfig: {},
    handleCustomConfigUpdate: () => {},
  };
  const [selectValues, setSelectValues] = useState(null);

  const getOptions = (num: number) => {
    const options: any = [];
    for (let i = 0; i < num; i += 1) {
      options[i] = {
        label: `item ${i}`,
        value: `value_${i}`,
      };
    }
    return options;
  };

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
        onChange={(value: any) => {
          setSelectValues(value);
          handleCustomConfigUpdate(currentConfigLabel, "customField", value); // currentConfigLabel is MultiConfig label and is required.
        }}
      />
    </Field>
  );
};

export default CustomConfig;
