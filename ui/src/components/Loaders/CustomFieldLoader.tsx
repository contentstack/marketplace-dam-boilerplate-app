import React from "react";
import { SkeletonTile } from "@contentstack/venus-components";

const CustomFieldLoader: React.FC = function () {
  return (
    <div className="">
      <SkeletonTile
        numberOfTiles={1}
        tileHeight={160}
        tileWidth={160}
        tileBottomSpace={5}
        tileTopSpace={5}
        tileleftSpace={30}
        tileRadius={10}
      />
      <SkeletonTile
        numberOfTiles={1}
        tileHeight={160}
        tileWidth={160}
        tileBottomSpace={5}
        tileTopSpace={5}
        tileleftSpace={30}
        tileRadius={10}
      />
      <SkeletonTile
        numberOfTiles={1}
        tileHeight={160}
        tileWidth={160}
        tileBottomSpace={5}
        tileTopSpace={5}
        tileleftSpace={30}
        tileRadius={10}
      />
      <SkeletonTile
        numberOfTiles={1}
        tileHeight={160}
        tileWidth={160}
        tileBottomSpace={5}
        tileTopSpace={5}
        tileleftSpace={30}
        tileRadius={10}
      />
      <SkeletonTile
        numberOfTiles={1}
        tileHeight={40}
        tileWidth={200}
        tileBottomSpace={5}
        tileTopSpace={30}
        tileleftSpace={30}
        tileRadius={10}
      />
    </div>
  );
};
export default CustomFieldLoader;
