import React, {
  useState,
  useMemo,
  useContext,
  useCallback,
  useEffect,
} from "react";
import rootConfig from "../../root_config";
import { TypeOption } from "../types";
import ConfigStateContext from "../contexts/ConfigStateContext";
import AppConfigContext from "../contexts/AppConfigContext";
import ConfigScreenUtils from "../utils/ConfigScreenUtils";

const ConfigStateProvider: React.FC<any> = function ({
  children,
  updateValueFunc,
}) {
  const configInputFields = rootConfig?.configureConfigScreen?.();

  const {
    jsonOptions,
    defaultFeilds,
    saveInConfig,
    saveInServerConfig,
    checkConfigFields,
    installationData,
  } = useContext(AppConfigContext);

  // local state for options of custom json
  const [customOptions, setCustomOptions] = useState<any[]>(jsonOptions);
  // local state for custom / whole json boolean value
  const [isCustom, setIsCustom] = React.useState(false);
  // local state for selected options of custom json dropdown
  const [damKeys, setDamKeys] = React.useState<any[]>(defaultFeilds ?? []);
  // saved custom key options
  const [keyPathOptions, setKeyPathOptions] = useState<any[]>([]);
  // local state for radio option config
  const [radioInputValues, setRadioInputValues] = React.useState<any>({
    ...Object.keys(saveInConfig)?.reduce((acc, value) => {
      if (saveInConfig?.[value]?.type === "radioInputFields")
        return {
          ...acc,
          [value]: saveInConfig?.[value]?.options?.filter(
            (option: any) =>
              option?.value === saveInConfig?.[value]?.defaultSelectedOption
          )?.[0],
        };
      return acc;
    }, {}),
    ...Object.keys(saveInServerConfig)?.reduce((acc, value) => {
      if (saveInServerConfig?.[value]?.type === "radioInputFields")
        return {
          ...acc,
          [value]: saveInServerConfig?.[value]?.options?.filter(
            (option: any) =>
              option?.value ===
              saveInServerConfig?.[value]?.defaultSelectedOption
          )?.[0],
        };
      return acc;
    }, {}),
  });
  // local state for select option config
  const [selectInputValues, setSelectInputValues] = React.useState<any>({
    ...Object.keys(saveInConfig)?.reduce((acc, value) => {
      if (saveInConfig?.[value]?.type === "selectInputFields")
        return {
          ...acc,
          [value]: saveInConfig?.[value]?.options?.filter(
            (option: any) =>
              option?.value === saveInConfig?.[value]?.defaultSelectedOption
          )?.[0],
        };
      return acc;
    }, {}),
    ...Object.keys(saveInServerConfig)?.reduce((acc, value) => {
      if (saveInServerConfig?.[value]?.type === "selectInputFields")
        return {
          ...acc,
          [value]: saveInServerConfig?.[value]?.options?.filter(
            (option: any) =>
              option?.value ===
              saveInServerConfig?.[value]?.defaultSelectedOption
          )?.[0],
        };
      return acc;
    }, {}),
  });

  const trandformFieldName = (fieldName: string) => {
    let transformedFieldName = fieldName;
    if (fieldName?.includes("undefined$--"))
      transformedFieldName = fieldName?.split("$--")?.[1];
    else if (fieldName?.includes("$--"))
      transformedFieldName = fieldName?.replace("$--", "$:");

    return transformedFieldName;
  };

  // updating the select option state
  const updateSelectConfig = useCallback(
    (e: TypeOption, fieldName: string) => {
      const transformedFieldName = trandformFieldName(fieldName);
      setSelectInputValues({ ...selectInputValues, [transformedFieldName]: e });
      updateValueFunc(fieldName, e?.value);
    },
    [selectInputValues]
  );

  // updating the radio option state
  const updateRadioOptions = useCallback(
    (fieldName: string, option: TypeOption) => {
      const transformedFieldName = trandformFieldName(fieldName);
      setRadioInputValues({
        ...radioInputValues,
        [transformedFieldName]: option,
      });
      updateValueFunc(fieldName, option?.value);
    },
    [radioInputValues]
  );

  const updateCustomJSON = (e: any) => {
    const check = e?.target?.id !== "wholeJSON";
    setIsCustom(check);
    updateValueFunc("is_custom_json", check, true);
  };

  const updateTypeObj = (list: any[]) => {
    const damKeysTemp: any[] = [];
    list?.forEach((key: any) => damKeysTemp?.push(key?.value));
    setDamKeys(list);
    updateValueFunc("dam_keys", list, true);
  };

  const handleModalValue = (
    modalValueArr: any[],
    mode: string,
    updatedValue: any[]
  ) => {
    const updatedOptions = [
      ...keyPathOptions,
      ...modalValueArr,
      ...updatedValue,
    ];
    setKeyPathOptions(updatedOptions);
    updateValueFunc("keypath_options", updatedOptions, true);
    setCustomOptions([...customOptions, ...modalValueArr, ...updatedValue]);
    if (mode === "createApply") {
      const selectedKeys = [...damKeys, ...updatedValue];
      setDamKeys(selectedKeys);
      updateTypeObj(selectedKeys);
    }
  };

  const transformObject = (input: any) =>
    Object.keys(input).reduce((output: any, key) => {
      const prefix = `${key}$:`;
      Object.keys(input[key]).forEach((nestedKey) => {
        const newKey = prefix + nestedKey;
        output[newKey] = input[key][nestedKey];
      });
      return output;
    }, {});

  useEffect(() => {
    // getting the default key names for radio and select input
    const { radioValuesKeys, selectValuesKeys } =
      ConfigScreenUtils.getDefaultInputValues(configInputFields);

    checkConfigFields(installationData);
    setIsCustom(installationData?.configuration?.is_custom_json ?? false);
    setDamKeys(installationData?.configuration?.dam_keys ?? []);
    const keyOptions = installationData?.configuration?.keypath_options ?? [];
    setKeyPathOptions(keyOptions);
    setCustomOptions([...customOptions, ...keyOptions]);

    const configCopy = {
      ...installationData?.configuration,
    };
    const multiConfig = {
      ...configCopy?.multi_config_keys,
    };
    const serverConfigCopy = {
      ...installationData?.serverConfiguration,
    };
    const multiServerConfig = {
      ...serverConfigCopy?.multi_config_keys,
    };
    delete configCopy.multi_config_keys;
    delete serverConfigCopy.multi_config_keys;

    const savedData = {
      ...configCopy,
      ...serverConfigCopy,
      ...transformObject(multiConfig),
      ...transformObject(multiServerConfig),
    };

    const { radioValuesObj, selectValuesObj } =
      ConfigScreenUtils.getIntialValueofComponents({
        savedData,
        radioValuesKeys,
        selectValuesKeys,
        configInputFields,
      });

    setRadioInputValues(radioValuesObj);
    setSelectInputValues(selectValuesObj);
  }, [installationData?.configuration, installationData?.serverConfiguration]);

  const contextValue = useMemo(
    () => ({
      CustomOptionsContext: {
        customOptions,
        setCustomOptions,
      },
      CustomCheckContext: {
        isCustom,
        setIsCustom,
      },
      DamKeysContext: {
        damKeys,
        setDamKeys,
      },
      RadioInputContext: {
        radioInputValues,
        setRadioInputValues,
        updateRadioOptions,
      },
      SelectInputContext: {
        selectInputValues,
        setSelectInputValues,
        updateSelectConfig,
      },
      JSONCompContext: {
        handleModalValue,
        updateCustomJSON,
        updateTypeObj,
      },
    }),
    [
      customOptions,
      setCustomOptions,
      isCustom,
      setIsCustom,
      damKeys,
      setDamKeys,
      radioInputValues,
      setRadioInputValues,
      updateRadioOptions,
      selectInputValues,
      setSelectInputValues,
      updateSelectConfig,
      handleModalValue,
      updateCustomJSON,
      updateTypeObj,
    ]
  );

  return (
    <ConfigStateContext.Provider value={contextValue}>
      {children}
    </ConfigStateContext.Provider>
  );
};
export default ConfigStateProvider;
