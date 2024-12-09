import { createContext } from "react";
import { GenericObjectType } from "@contentstack/app-sdk/dist/src/types/common.types";
import { Props, Configurations, TypeOption } from "../types";

interface TypeAppConfigContext {
  installationData: Props;
  setInstallationData: Function;
  appConfig: GenericObjectType;
  jsonOptions: TypeOption[] | [];
  defaultFeilds: TypeOption[];
  saveInConfig: Configurations;
  saveInServerConfig: Configurations;
  checkConfigFields: Function;
}

const AppConfigContext = createContext<TypeAppConfigContext>({
  installationData: { configuration: {}, serverConfiguration: {} },
  setInstallationData: () => {},
  appConfig: {},
  jsonOptions: [],
  defaultFeilds: [],
  saveInConfig: {},
  saveInServerConfig: {},
  checkConfigFields: () => {},
});

export default AppConfigContext;
