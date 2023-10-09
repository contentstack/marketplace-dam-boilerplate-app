/* eslint-disable */

import { createContext } from "react";

interface TypeAppConfigContext {
  ErrorContext: {
    errorState: any;
  };
  StateContext: {
    state: any;
  };
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
  KeyPathContext: {
    keyPathOptions: any[];
    setKeyPathOptions: Function;
  };
  RadioInputContext: {
    radioInputValues: any;
    setRadioInputValues: Function;
  };
  SelectInputContext: {
    selectInputValues: any;
    setSelectInputValues: Function;
  };
  CustomFieldsContext: {
    configInputFields: any;
  };
  checkConfigFields: Function;
}

const AppConfigContext = createContext<TypeAppConfigContext>({
  ErrorContext: {
    errorState: [],
  },
  StateContext: {
    state: {},
  },
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
  KeyPathContext: {
    keyPathOptions: [],
    setKeyPathOptions: () => {},
  },
  RadioInputContext: {
    radioInputValues: {},
    setRadioInputValues: () => {},
  },
  SelectInputContext: {
    selectInputValues: {},
    setSelectInputValues: () => {},
  },
  CustomFieldsContext: {
    configInputFields: {},
  },
  checkConfigFields: () => {},
});

export default AppConfigContext;
