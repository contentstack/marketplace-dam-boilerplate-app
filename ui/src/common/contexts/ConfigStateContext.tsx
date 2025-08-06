import { createContext } from "react";
import { TypeOption } from "../types";

interface TypeConfigStateContext {
  CustomOptionsContext: {
    customOptions: TypeOption[] | [];
    setCustomOptions: Function;
  };
  CustomCheckContext: {
    isCustom: boolean;
    setIsCustom: Function;
  };
  DamKeysContext: {
    damKeys: TypeOption[];
    setDamKeys: Function;
  };
  RadioInputContext: {
    radioInputValues: Record<string, TypeOption>;
    setRadioInputValues: Function;
    updateRadioOptions: Function;
  };
  SelectInputContext: {
    selectInputValues: Record<string, TypeOption>;
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
