import { createContext } from "react";

interface TypeConfigStateContext {
  CustomOptionsContext: {
    customOptions: any[];
    setCustomOptions: Function;
  };
  CustomCheckContext: {
    isCustom: boolean;
    setIsCustom: Function;
  };
  DamKeysContext: {
    damKeys: any[];
    setDamKeys: Function;
  };
  RadioInputContext: {
    radioInputValues: any;
    setRadioInputValues: Function;
    updateRadioOptions: Function;
  };
  SelectInputContext: {
    selectInputValues: any;
    setSelectInputValues: Function;
    updateSelectConfig: Function;
  };
  JSONCompContext: {
    handleModalValue: Function;
    updateCustomJSON: Function;
    updateTypeObj: Function;
  };
}

const ConfigStateContext = createContext<TypeConfigStateContext>({
  CustomOptionsContext: {
    customOptions: [],
    setCustomOptions: () => {},
  },
  CustomCheckContext: {
    isCustom: false,
    setIsCustom: () => {},
  },
  DamKeysContext: {
    damKeys: [],
    setDamKeys: () => {},
  },
  RadioInputContext: {
    radioInputValues: {},
    setRadioInputValues: () => {},
    updateRadioOptions: () => {},
  },
  SelectInputContext: {
    selectInputValues: {},
    setSelectInputValues: () => {},
    updateSelectConfig: () => {},
  },
  JSONCompContext: {
    handleModalValue: () => {},
    updateCustomJSON: () => {},
    updateTypeObj: () => {},
  },
});

export default ConfigStateContext;
