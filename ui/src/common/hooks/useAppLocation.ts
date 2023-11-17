import { useContext, useMemo } from "react";
import { get, isEmpty, keys } from "lodash";
import {
  MarketplaceAppContext,
  MarketplaceAppContextType,
} from "../contexts/MarketplaceAppContext";

const useAppLocation = () => {
  const { appSdk } = useContext(
    MarketplaceAppContext
  ) as MarketplaceAppContextType;
  const locations = useMemo(() => keys(appSdk?.location), [appSdk]);

  const { locationName, location } = useMemo(() => {
    let appLocation = null;
    let appLocationName: string = "";
    const locationsLength = locations?.length;
    for (let i = 0; i <= locationsLength; i += 1) {
      if (!isEmpty(get(appSdk, `location.${locations[i]}`, undefined))) {
        appLocationName = locations[i];
        appLocation = get(appSdk?.location, appLocationName);
        break;
      }
    }
    return { location: appLocation, locationName: appLocationName };
  }, [locations, appSdk]);

  return { locationName, location };
};

export default useAppLocation;
