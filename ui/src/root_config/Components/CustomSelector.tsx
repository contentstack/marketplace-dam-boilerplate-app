/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import "../styles.scss";
import Table from "../../components/Table";
import mockAssetData from "../mockData/selectorMockData";
import { TypeCustomComponent } from "../../common/types";

const CustomSelector: React.FC<TypeCustomComponent> = function ({
  config,
  setError,
  successFn,
  closeFn,
  selectedAssetIds,
}: TypeCustomComponent) {

  return (
    <Table
      setError={setError}
      successFn={successFn}
      closeFn={closeFn}
      selectedAssetIds={selectedAssetIds}
      assetData={mockAssetData}
    />
  );
};

export default CustomSelector;
