import React, {
  useState,
  useMemo,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { Notification } from "@contentstack/venus-components";
import rootConfig from "../../root_config";
import { ConfigStateProviderProps, TypeOption } from "../types";
import ConfigStateContext from "../contexts/ConfigStateContext";
import AppConfigContext from "../contexts/AppConfigContext";
import ConfigScreenUtils from "../utils/ConfigScreenUtils";
import localeTexts from "../locale/en-us";

const ConfigStateProvider: React.FC<ConfigStateProviderProps> = function ({
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
  const [customOptions, setCustomOptions] = useState<TypeOption[] | []>(
    jsonOptions
  );
  // local state for custom / whole json boolean value
  const [isCustom, setIsCustom] = React.useState(false);
  // local state for selected options of custom json dropdown
  const [damKeys, setDamKeys] = React.useState<TypeOption[]>(
    defaultFeilds ?? []
  );
  // saved custom key options
  const [keyPathOptions, setKeyPathOptions] = useState<TypeOption[]>([]);
  // local state for radio option config
  const [radioInputValues, setRadioInputValues] = React.useState<
    Record<string, TypeOption>
  >({
    ...Object.keys(saveInConfig)?.reduce((acc, value) => {
      if (saveInConfig?.[value]?.type === "radioInputField")
        return {
          ...acc,
          [value]: saveInConfig?.[value]?.options?.filter(
            (option: TypeOption) =>
              option?.value === saveInConfig?.[value]?.defaultSelectedOption
          )?.[0],
        };
      return acc;
    }, {}),
    ...Object.keys(saveInServerConfig)?.reduce((acc, value) => {
      if (saveInServerConfig?.[value]?.type === "radioInputField")
        return {
          ...acc,
          [value]: saveInServerConfig?.[value]?.options?.filter(
            (option: TypeOption) =>
              option?.value ===
              saveInServerConfig?.[value]?.defaultSelectedOption
          )?.[0],
        };
      return acc;
    }, {}),
  });
  // local state for select option config
  const [selectInputValues, setSelectInputValues] = React.useState<
    Record<string, TypeOption>
  >({
    ...Object.keys(saveInConfig)?.reduce((acc, value) => {
      if (saveInConfig?.[value]?.type === "selectInputField")
        return {
          ...acc,
          [value]: saveInConfig?.[value]?.options?.filter(
            (option: TypeOption) =>
              option?.value === saveInConfig?.[value]?.defaultSelectedOption
          )?.[0],
        };
      return acc;
    }, {}),
    ...Object.keys(saveInServerConfig)?.reduce((acc, value) => {
      if (saveInServerConfig?.[value]?.type === "selectInputField")
        return {
          ...acc,
          [value]: saveInServerConfig?.[value]?.options?.filter(
            (option: TypeOption) =>
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

  const updateCustomJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const check = e?.target?.id !== "wholeJSON";
    setIsCustom(check);
    updateValueFunc("is_custom_json", check, true);
  };

  const updateTypeObj = (list: TypeOption[]) => {
    setDamKeys(list);
    updateValueFunc("dam_keys", list, true);
  };

  const handleModalValue = (
    modalValueArr: TypeOption[],
    mode: string,
    updatedValue: TypeOption[]
  ) => {
    const updatedOptions: TypeOption[] = [
      ...keyPathOptions,
      ...modalValueArr,
      ...updatedValue,
    ];

    if ([...customOptions, ...modalValueArr, ...updatedValue]?.length <= 150) {
      setKeyPathOptions(updatedOptions);
      updateValueFunc("keypath_options", updatedOptions, true);
      setCustomOptions([...customOptions, ...modalValueArr, ...updatedValue]);
      if (mode === "createApply") {
        const selectedKeys = [...damKeys, ...updatedValue];
        setDamKeys(selectedKeys);
        updateTypeObj(selectedKeys);
      }
    } else {
      Notification({
        displayContent: {
          error: {
            error_message:
              localeTexts.ConfigFields.customWholeJson.notification.limitError,
          },
        },
        notifyProps: {
          hideProgressBar: true,
          className: "modal_toast_message",
        },
        type: "error",
      });
    }
  };

  const transformObject = (input: any) =>
    Object.keys(input)?.reduce((output: any, key) => {
      const prefix = `${key}$:`;
      Object.keys(input[key]).forEach((nestedKey) => {
        const newKey = prefix + nestedKey;
        output[newKey] = input?.[key]?.[nestedKey];
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
    const optionsToAdd = keyOptions?.filter(
      (option: TypeOption) =>
        !customOptions?.some((opt: TypeOption) => opt?.value === option?.value)
    );
    setCustomOptions([...customOptions, ...optionsToAdd]);

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
