import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Icon,
  InfiniteScrollTable,
} from "@contentstack/venus-components";
import utils from "../../common/utils/index";
import "../styles.scss";

interface TypeCustomComponent {
  selectedAssetIds: string[];
  successFn: Function;
  closeFn: Function;
  assetData: any[];
}

const CustomComponentTexts = {
  EmptySearch: {
    heading: "No matching results found!",
    description:
      "Please try changing the search query or filters to find what you are looking for.",
    actions: "Not sure where to start? Visit our",
    help: "help center",
    helplink: "https://contentstack.com",
  },
  NoImg: {
    content: "File Image Not Available",
    alt: "No Image available",
  },
  Table: {
    search: "Search by Name",
    name: {
      singular: "Asset",
      plural: "Assets",
    },
    cancel: "Cancel",
    addBtn: {
      s: "Add",
      e: "Asset(s)",
    },
  },
};

const tableColumns = [
  {
    Header: "Image",
    id: "Image",
    accessor: (obj: any) =>
      utils.getImageDOM(obj?.assetUrl, {
        toolTip: CustomComponentTexts.NoImg.content,
        altText: CustomComponentTexts.NoImg.alt,
      }),
    default: true,
    disableSortBy: true,
    columnWidthMultiplier: 1,
    addToColumnSelector: true,
  },
  {
    Header: "ID",
    id: "ID",
    accessor: (obj: any) =>
      // eslint-disable-next-line
      obj?._id?.toString() ?? "",
    default: true,
    disableSortBy: true,
    columnWidthMultiplier: 1,
    addToColumnSelector: true,
  },
  {
    Header: "Name",
    id: "Name",
    accessor: (obj: any) => obj?.assetName ?? "--",
    default: true,
    disableSortBy: true,
    columnWidthMultiplier: 2,
    addToColumnSelector: true,
  },
  {
    Header: "Dimensions (H x W)",
    id: "Dimensions",
    accessor: (obj: any) => (
      <div>{`${obj?.dimensions?.height} x ${obj?.dimensions?.width}`}</div>
    ),
    default: false,
    disableSortBy: true,
    columnWidthMultiplier: 3.5,
    addToColumnSelector: true,
  },
];

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
        searchPlaceholder={CustomComponentTexts.Table.search}
        emptyObj={utils.EmptySearch({
          EmptySearchHeading: CustomComponentTexts.EmptySearch.heading,
          EmptySearchDescription: CustomComponentTexts.EmptySearch.description,
          EmptySearchMessage: CustomComponentTexts.EmptySearch.actions,
          EmptySearchHelpLink: CustomComponentTexts.EmptySearch.helplink,
          EmptySearchHelpText: CustomComponentTexts.EmptySearch.help,
        })}
        name={CustomComponentTexts.Table.name}
        columns={tableColumns}
      />
      <ButtonGroup className="buttonGroup">
        <Button onClick={closeFn} buttonType="light">
          {CustomComponentTexts.Table.cancel}
        </Button>
        <Button onClick={() => successFn(selectedAssets)} buttonType="primary">
          <Icon icon="AddPlus" />
          {`${CustomComponentTexts.Table.addBtn.s} ${selectedAssets?.length} ${CustomComponentTexts.Table.addBtn.e}`}
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default CustomComponent;
