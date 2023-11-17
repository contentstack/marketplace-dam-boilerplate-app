import { createContext } from "react";

interface TypeAppConfigContext {
  errorState: any;
  installationData: any;
  setInstallationData: Function;
  appConfig: any;
  jsonOptions: any[];
  defaultFeilds: any[];
  saveInConfig: any;
  saveInServerConfig: any;
  checkConfigFields: Function;
}

const AppConfigContext = createContext<TypeAppConfigContext>({
  errorState: [],
  installationData: {},
  setInstallationData: () => {},
  appConfig: {},
  jsonOptions: [],
  defaultFeilds: [],
  saveInConfig: {},
  saveInServerConfig: {},
  checkConfigFields: () => {},
});

export default AppConfigContext;
