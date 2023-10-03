import React from "react";
import { SkeletonTile } from "@contentstack/venus-components";

const Loader: React.FC = function () {
  return (
    <div className="loader-component">
      <SkeletonTile
        numberOfTiles={10}
        tileBottomSpace={10}
        tileHeight={15}
        tileTopSpace={10}
        tileWidth={700}
        tileleftSpace={50}
        tileRadius={10}
      />
    </div>
  );
};
export default Loader;
