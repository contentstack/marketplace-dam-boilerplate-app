/* eslint-disable */
import React, { useState, useRef, useEffect } from "react";
import {
    InfiniteScrollTable,
    Button,
    Icon,
} from "@contentstack/venus-components";
import { AssetData } from "../../common/types";
import "./Table.scss";

interface TableProps {
    setError: (errObj: any) => void;
    successFn: (assets: any[]) => void;
    closeFn: () => void;
    selectedAssetIds: string[];
    assetData: any[];
}

function Table({
    setError,
    successFn,
    closeFn,
    selectedAssetIds,
    assetData,
}: TableProps) {
    const rowPerPageOptions = [10, 20, 50];
    const initialPageSize = rowPerPageOptions[0];

    const [data, updateData] = useState<AssetData[]>([]);
    const [loading, updateLoading] = useState(false);
    const [totalCounts, updateTotalCounts] = useState<number>(0);
    const [selectedAssets, setSelectedAssets] = useState<any[]>([]); // currently selected assets
    const [selectedRows, setSelectedRows] = useState<any>({}); // initially selected rows - change variable name
    const [tableHeight, setTableHeight] = useState(window.innerHeight - 275);
    const [pageSize, setPageSize] = useState(10);

    const tableRef = useRef<any>(null);

    // Convert selectedAssetIds array to object 
    const getSelectedData = async (assetIds: string[] = []) => {
        if (assetIds?.length) {
            assetIds?.forEach((id: string) => {
                selectedRows[id] = true;
            });
        }
        setSelectedRows({ ...selectedRows });
        return selectedRows;
    };

    // Function to get asset type based on file extension
    const getAssetType = (fileType: string | undefined) => {
        if (!fileType) return "document";

        const extension = fileType.toLowerCase();
        const audioExtensions = ["mp3", "m4a", "flac", "wav", "wma", "aac"];
        const videoExtensions = ["mp4", "mov", "wmv", "avi", "avchd", "flv", "f4v", "swf", "ogg", "webm"];
        const imageExtensions = ["jpeg", "jpg", "png", "gif", "bmp", "apng", "avif", "jfif", "pjpeg", "pjp", "svg", "webp", "ico", "cur", "tif", "tiff"];
        const excelExtensions = ["xlsx", "xlsm", "xlsb", "xltx", "xltm", "xls", "xlt", "xml", "xlam", "xla", "xlw", "xlr"];
        const presentationExtensions = ["pptx", "ppt", "pptm", "potx", "pot", "potm", "ppsx", "pps", "ppsm"];

        if (videoExtensions.includes(extension)) {
            return "video";
        }
        if (audioExtensions.includes(extension)) {
            return "audio";
        }
        if (imageExtensions.includes(extension)) {
            return "image";
        }
        if (excelExtensions.includes(extension)) {
            return "excel";
        }
        if (presentationExtensions.includes(extension)) {
            return "presentation";
        }
        if (extension === "pdf") {
            return "pdf";
        }
        if (extension === "zip" || extension === "rar" || extension === "7z") {
            return "zip";
        }
        if (extension === "json") {
            return "json";
        }
        if (extension === "docx" || extension === "doc") {
            return "document";
        }
        if (extension === "html" || extension === "htm") {
            return "code";
        }
        return "document";
    };

    const renderAssetIcon = (asset: AssetData) => {
        const assetType = getAssetType(asset.fileType);

        if (assetType === "image" && asset.thumbnail) {
            return (
                <div style={{ position: 'relative' }}>
                    <img
                        src={asset.thumbnail}
                        alt={asset.assetName}
                        className="asset-thumbnail"
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const iconDiv = e.currentTarget.nextElementSibling as HTMLElement;
                            if (iconDiv) iconDiv.style.display = 'flex';
                        }}
                    />
                    <div className="asset-icon" style={{
                        width: 50,
                        height: 50,
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        border: '1px solid #e1e5e9'
                    }}>
                        <Icon icon="Document" size="small" />
                    </div>
                </div>
            );
        }


        const iconMap = {
            pdf: "PDF2",
            video: "MP4",
            audio: "MP3",
            excel: "XLS",
            presentation: "PPT",
            zip: "ZIP",
            json: "JSON",
            document: "DOC2",
            code: "DOC2",
            image: "File"
        };

        return (
            <div className="asset-icon" style={{
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                border: '1px solid #e1e5e9'
            }}>
                <Icon icon={iconMap[assetType] || "Document"} size="small" />
            </div>
        );
    };

    // Define table columns for DAM assets
    // get Default from root_config/customfield/index.tsx
    const columns = [
        {
            Header: "Image",
            id: "image",
            accessor: (asset: any) => renderAssetIcon(asset),
            disableSortBy: true,
            columnWidthMultiplier: 1,
        },
        {
            Header: "Name",
            id: "assetName",
            accessor: (asset: any) => (
                <div className="asset-name">{asset.assetName}</div>
            ),
            columnWidthMultiplier: 2,
        },
        {
            Header: "File Type",
            id: "fileType",
            accessor: "fileType",
            columnWidthMultiplier: 1,
        },
        {
            Header: "Size",
            accessor: "fileSize",
            columnWidthMultiplier: 1,
        },
        {
            Header: "Dimensions",
            id: "dimensions",
            accessor: (asset: any) => asset.dimensions ? `${asset.dimensions.width} x ${asset.dimensions.height}` : '--',
            disableSortBy: true,
            columnWidthMultiplier: 1.5,
        },
        {
            Header: "Created",
            accessor: "createdDate",
            columnWidthMultiplier: 1.5,
        }
    ];


    const fetchData = async ({ sortBy, fetchCalledByTable, searchText, skip, limit }: any) => {
        try {
            if (!fetchCalledByTable) {
                tableRef?.current?.setTablePage(1);
            }


            updateLoading(true);

            await new Promise(resolve => {
                setTimeout(resolve, 500);
            });

            // Filter data based on search
            let filteredData = assetData;
            if (searchText) {
                filteredData = assetData.filter(asset =>
                    asset.assetName?.toLowerCase().includes(searchText.toLowerCase())
                );
            }

            // Apply sorting if needed
            if (sortBy) {
                // Replace sorting with query params in an API call
                filteredData = [...filteredData].sort((a, b) => {
                    const aVal = a[sortBy.id] || '';
                    const bVal = b[sortBy.id] || '';

                    // Handle different column types

                    if (sortBy.id === 'assetName') {
                        // String sorting for asset names
                        return sortBy.sortingDirection === 'asc'
                            ? aVal.localeCompare(bVal)
                            : bVal.localeCompare(aVal);
                    }
                    if (sortBy.id === 'fileType') {
                        // String sorting for file types
                        return sortBy.sortingDirection === 'asc'
                            ? aVal.localeCompare(bVal)
                            : bVal.localeCompare(aVal);
                    }
                    if (sortBy.id === 'createdDate') {
                        // Date sorting
                        const aDate = new Date(aVal);
                        const bDate = new Date(bVal);
                        return sortBy.sortingDirection === 'asc'
                            ? aDate.getTime() - bDate.getTime()
                            : bDate.getTime() - aDate.getTime();
                    }
                    // Default string sorting for other columns
                    return sortBy.sortingDirection === 'asc'
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                });
            }

            // Update pagination state
            const currentSkip = skip || 0;
            const currentLimit = limit || pageSize;

            setPageSize(currentLimit);

            // Paginate the data
            const paginatedData = filteredData.slice(currentSkip, currentSkip + currentLimit);

            updateData(paginatedData);
            updateTotalCounts(filteredData.length);
            updateLoading(false);
        } catch (error) {
            setError({ isErr: true, errorText: 'Failed to load assets' });
            updateLoading(false);
        }
    };

    // Pagination change handler
    const onChangePagination = (pageArgs: any) => {
        if (pageArgs && pageArgs.pageSize) {
            setPageSize(pageArgs.pageSize);
        }
    };

    const getSelectedRow = (singleSelectedRowIds: string[], selectedDataAssets: any) => {
        const obj: any = {};
        const sel: any = [...singleSelectedRowIds];
        sel?.forEach((element: any) => {
            obj[element] = true;
        });
        setSelectedRows({ ...obj });

        const newAssets = selectedDataAssets?.filter(
            (newAsset: any) =>
                !selectedAssets?.some(
                    (existingAsset: any) => existingAsset?.id === newAsset?.id
                )
        );

        let updatedAssets: any[] = [];

        if (!selectedAssets) {
            updatedAssets = [...newAssets];
        } else {
            updatedAssets = [...selectedAssets, ...newAssets];
        }

        updatedAssets = updatedAssets?.filter((existingAsset: any) =>
            singleSelectedRowIds?.includes(existingAsset?.id || existingAsset?._id)
        );

        setSelectedAssets(updatedAssets);
    };

    // Load initial data when component mounts - only when API call
    useEffect(() => {
        fetchData({});
    }, []);

    // Initialize selected assets from props like S3
    useEffect(() => {
        if (selectedAssetIds?.length) {
            getSelectedData(selectedAssetIds);
        }
    }, [selectedAssetIds]);

    // Handle window resize to adjust table height
    useEffect(() => {
        const handleResize = () => {
            const availableHeight = window.innerHeight - 275;
            setTableHeight(Math.max(availableHeight, 400));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="default-table-selector">
            <InfiniteScrollTable
                ref={tableRef}
                data={data}
                columns={columns}
                uniqueKey="_id"
                loading={loading}
                totalCounts={totalCounts}
                minBatchSizeToFetch={10}
                getSelectedRow={getSelectedRow}
                initialSelectedRowIds={selectedRows}
                canSearch
                searchPlaceholder="Search assets..."
                isRowSelect
                fullRowSelect
                columnSelector
                canRefresh
                tableHeight={tableHeight}
                initialPageSize={initialPageSize}
                rowPerPageOptions={rowPerPageOptions}
                fetchTableData={fetchData}
                onChangePagination={onChangePagination}
                v2Features={{
                    isNewEmptyState: true,
                    pagination: true,
                }}
                emptyObj={{
                    heading: "No assets found",
                    description: "Try adjusting your search criteria",
                }}
            />

            <div className="button-group">
                <Button
                    buttonType="light"
                    version="v2"
                    onClick={closeFn}
                    data-testid="close-btn"
                    className="margin-right-20"
                >
                    Cancel
                </Button>
                <Button
                    buttonType="primary"
                    className="add-asset-btn"
                    data-testid="add-asset-btn"
                    version="v2"
                    onClick={() => {
                        // Get selected assets from all data based on selectedRows
                        const selectedAssetObjects = assetData.filter(asset =>
                            selectedRows[asset.id] || selectedRows[asset._id]
                        );
                        successFn(selectedAssetObjects);
                    }}
                    disabled={Object.keys(selectedRows).length === 0}
                    style={{
                        backgroundColor: Object.keys(selectedRows).length === 0 ? '#ccc' : '#6366f1',
                        cursor: Object.keys(selectedRows).length === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="Icon--original"
                        name="AddPlus"
                        data-test-id="cs-icon"
                    >
                        <path d="M6 0v12M12 6H0" stroke="#fff" strokeWidth="2" />
                    </svg>
                    {`Add ${Object.keys(selectedRows).length} Asset${Object.keys(selectedRows).length !== 1 ? 's' : ''}`}
                </Button>
            </div>
        </div>
    );
};

export default Table;