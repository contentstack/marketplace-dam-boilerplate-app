import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Icon,
  InfiniteScrollTable,
} from "@contentstack/venus-components";
import utils from "../utils";
import "../styles.scss";

interface TypeCustomComponent {
  selectedAssetIds: string[];
  successFn: Function;
  closeFn: Function;
  assetData: any[];
}

const CustomComponent: React.FC<TypeCustomComponent> = function ({
  selectedAssetIds,
  successFn,
  closeFn,
  assetData,
}) {
  const [selectedAssets, setSelectedAssets] = useState<any[]>([]);
  const [itemStatus, setItemStatus] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);

  const getSelectedRow = (ids: string[]) => {
    setSelectedAssets(
      assetData?.filter((fileObj: any) =>
        // eslint-disable-next-line
        ids?.includes(`${fileObj?._id}`)
      )
    );
  };

  const fetchTableData = async ({ searchText }: any) => {
    setItemStatus(utils.getItemStatusMap(15, "loading"));
    if (searchText) {
      const searchData = assetData?.filter((asset: any) =>
        asset?.assetName?.toLowerCase()?.includes(searchText?.toLowerCase())
      );
      setItemStatus(utils.getItemStatusMap(searchData?.length, "loaded"));
      setTableData(searchData);
    } else {
      setItemStatus(utils.getItemStatusMap(15, "loaded"));
      setTableData(assetData);
    }
  };

  return (
    <div className="selector-custom-component">
      <InfiniteScrollTable
        uniqueKey="_id"
        isRowSelect
        fullRowSelect
        canSearch
        loadMoreItems={() => {}}
        fetchTableData={fetchTableData}
        data={tableData}
        getSelectedRow={getSelectedRow}
        initialSelectedRowIds={selectedAssetIds}
        totalCounts={tableData?.length}
        loading={false}
        minBatchSizeToFetch={20}
        itemStatusMap={itemStatus}
        searchPlaceholder={utils.CustomComponentTexts.Table.search}
        emptyObj={utils.EmptySearch}
        name={utils.CustomComponentTexts.Table.name}
        columns={utils.tableColumns}
      />
      <ButtonGroup className="buttonGroup">
        <Button onClick={closeFn} buttonType="light">
          {utils.CustomComponentTexts.Table.cancel}
        </Button>
        <Button onClick={() => successFn(selectedAssets)} buttonType="primary">
          <Icon icon="AddPlus" />
          {`${utils.CustomComponentTexts.Table.addBtn.s} ${selectedAssets?.length} ${utils.CustomComponentTexts.Table.addBtn.e}`}
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default CustomComponent;
