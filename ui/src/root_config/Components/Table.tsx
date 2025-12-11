import React, {
    useState,
    useRef,
    useEffect,
    useLayoutEffect,
    useCallback,
} from "react";
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

const THUMBNAIL_SIZE = 50;
const FADE_TRANSITION = "opacity 0.1s ease-in-out";

const iconBaseStyle: React.CSSProperties = {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    border: "1px solid #e1e5e9",
};

const containerStyle: React.CSSProperties = {
    position: "relative",
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
};


type ImageLoadStatus = "idle" | "loading" | "loaded" | "error";

interface ImageWithFallbackProps {
    src: string;
    alt: string;
}

const ImageWithFallback = React.memo<ImageWithFallbackProps>(
    ({ src, alt }) => {
        const [status, setStatus] = useState<ImageLoadStatus>("idle");
        const [wasCached, setWasCached] = useState(false);
        const imgRef = useRef<HTMLImageElement | null>(null);
        const previousSrcRef = useRef<string | null>(null);

        useEffect(() => {
            if (previousSrcRef.current !== src) {
                previousSrcRef.current = src;
                setStatus("idle");
                setWasCached(false);
            }
        }, [src]);

        useLayoutEffect(() => {
            const img = imgRef.current;
            if (!img || !src || previousSrcRef.current !== src) return;

            if (img?.complete && img?.naturalWidth > 0) {
                setWasCached(true);
                setStatus("loaded");
            } else if (status === "idle") {
                setStatus("loading");
            }
        }, [src, status]);

        const handleLoad = useCallback(() => {
            setStatus("loaded");
        }, []);

        const handleError = useCallback(() => {
            setStatus("error");
            setWasCached(false);
        }, []);

        const handleImageRef = useCallback((img: HTMLImageElement | null) => {
            if (!img) return;
            imgRef.current = img;

            if (src && img.complete && img.naturalWidth > 0) {
                setWasCached(true);
                setStatus("loaded");
            } else if (status === "idle") {
                setStatus("loading");
            }
        }, [src, status]);

        // Early return for error or missing src
        if (status === "error" || !src) {
            return (
                <div className="asset-icon" style={iconBaseStyle} role="img" aria-label={alt}>
                    <Icon icon="Document" size="small" version="v2" />
                </div>
            );
        }

        const isLoaded = status === "loaded";
        const shouldAnimate = !wasCached;

        return (
            <div style={containerStyle}>
                {/* Fallback icon - fades out when image loads */}
                <div
                    className="asset-icon"
                    style={{
                        ...iconBaseStyle,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        opacity: isLoaded ? 0 : 1,
                        transition: shouldAnimate ? FADE_TRANSITION : undefined,
                    }}
                    aria-hidden="true"
                >
                    <Icon icon="Document" size="small" version="v2" />
                </div>

                <img
                    ref={handleImageRef}
                    src={src}
                    alt={alt}
                    className="asset-thumbnail"
                    style={{
                        width: THUMBNAIL_SIZE,
                        height: THUMBNAIL_SIZE,
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 2,
                        opacity: isLoaded ? 1 : 0,
                        transition: shouldAnimate ? FADE_TRANSITION : undefined,
                    }}
                    onError={handleError}
                    onLoad={handleLoad}
                    loading="lazy"
                />
            </div>
        );
    },
    (prevProps, nextProps) => prevProps?.src === nextProps?.src && prevProps?.alt === nextProps?.alt
);

ImageWithFallback.displayName = "ImageWithFallback";

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
        const videoExtensions = [
            "mp4",
            "mov",
            "wmv",
            "avi",
            "avchd",
            "flv",
            "f4v",
            "swf",
            "ogg",
            "webm",
        ];
        const imageExtensions = [
            "jpeg",
            "jpg",
            "png",
            "gif",
            "bmp",
            "apng",
            "avif",
            "jfif",
            "pjpeg",
            "pjp",
            "svg",
            "webp",
            "ico",
            "cur",
            "tif",
            "tiff",
        ];
        const excelExtensions = [
            "xlsx",
            "xlsm",
            "xlsb",
            "xltx",
            "xltm",
            "xls",
            "xlt",
            "xml",
            "xlam",
            "xla",
            "xlw",
            "xlr",
        ];
        const presentationExtensions = [
            "pptx",
            "ppt",
            "pptm",
            "potx",
            "pot",
            "potm",
            "ppsx",
            "pps",
            "ppsm",
        ];

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
        const assetType = getAssetType(asset?.type);

        if (assetType === "image" && asset?.thumbnailUrl) {
            return (
                <ImageWithFallback src={asset?.thumbnailUrl} alt={asset?.name} />
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
            image: "File",
        };

        return (
            <div
                className="asset-icon"
                style={{
                    width: 50,
                    height: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px",
                    border: "1px solid #e1e5e9",
                }}
            >
                <Icon icon={iconMap[assetType] || "Document"} size="small" />
            </div>
        );
    };

    // Memoize the asset name accessor function
    const renderAssetName = useCallback(
        (asset: any) => <div className="asset-name">{asset?.name}</div>,
        []
    );

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
            id: "name",
            accessor: renderAssetName,
            columnWidthMultiplier: 2,
        },
        {
            Header: "File Type",
            id: "type",
            accessor: "type",
            columnWidthMultiplier: 1,
        },
        {
            Header: "Size",
            accessor: "size",
            columnWidthMultiplier: 1,
        },
        {
            Header: "Width",
            id: "width",
            accessor: "width",
            disableSortBy: true,
            columnWidthMultiplier: 1,
        },
        {
            Header: "Height",
            id: "height",
            accessor: "height",
            disableSortBy: true,
            columnWidthMultiplier: 1,
        },
        {
            Header: "Created Date",
            id: "createdDate",
            accessor: "createdDate",
            columnWidthMultiplier: 1.5,
        },
    ];

    const fetchData = async ({
        sortBy,
        fetchCalledByTable,
        searchText,
        skip,
        limit,
    }: any) => {
        try {
            if (!fetchCalledByTable) {
                tableRef?.current?.setTablePage(1);
            }

            updateLoading(true);

            await new Promise((resolve) => {
                setTimeout(resolve, 500);
            });

            // Filter data based on search
            let filteredData = assetData;
            if (searchText) {
                filteredData = assetData.filter((asset) =>
                    asset.name?.toLowerCase().includes(searchText.toLowerCase())
                );
            }

            // Apply sorting if needed
            if (sortBy) {
                // Replace sorting with query params in an API call
                filteredData = [...filteredData].sort((a, b) => {
                    const aVal = a[sortBy.id] || "";
                    const bVal = b[sortBy.id] || "";

                    // Handle different column types

                    if (sortBy.id === "name") {
                        // String sorting for asset names
                        return sortBy.sortingDirection === "asc"
                            ? aVal.localeCompare(bVal)
                            : bVal.localeCompare(aVal);
                    }
                    if (sortBy.id === "fileType") {
                        // String sorting for file types
                        return sortBy.sortingDirection === "asc"
                            ? aVal.localeCompare(bVal)
                            : bVal.localeCompare(aVal);
                    }
                    if (sortBy.id === "createdDate") {
                        // Date sorting
                        const aDate = new Date(aVal);
                        const bDate = new Date(bVal);
                        return sortBy.sortingDirection === "asc"
                            ? aDate.getTime() - bDate.getTime()
                            : bDate.getTime() - aDate.getTime();
                    }
                    // Default string sorting for other columns
                    return sortBy.sortingDirection === "asc"
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                });
            }

            // Update pagination state
            const currentSkip = skip || 0;
            const currentLimit = limit || pageSize;

            setPageSize(currentLimit);

            // Paginate the data
            const paginatedData = filteredData.slice(
                currentSkip,
                currentSkip + currentLimit
            );

            updateData(paginatedData);
            updateTotalCounts(filteredData.length);
            updateLoading(false);
        } catch (error) {
            setError({ isErr: true, errorText: "Failed to load assets" });
            updateLoading(false);
        }
    };

    // Pagination change handler
    const onChangePagination = (pageArgs: any) => {
        if (pageArgs && pageArgs.pageSize) {
            setPageSize(pageArgs.pageSize);
        }
    };

    const getSelectedRow = (
        singleSelectedRowIds: string[],
        selectedDataAssets: any
    ) => {
        const obj: any = {};
        const sel: any = [...singleSelectedRowIds];
        sel?.forEach((element: any) => {
            obj[element] = true;
        });
        setSelectedRows({ ...obj });

        const getAssetId = (asset: any) => asset?.id || "";

        const newAssets = selectedDataAssets?.filter(
            (newAsset: any) => {
                const newAssetId = getAssetId(newAsset);
                return !selectedAssets?.some(
                    (existingAsset: any) => getAssetId(existingAsset) === newAssetId
                );
            }
        ) || [];

        let updatedAssets: any[] = [];

        if (!selectedAssets || selectedAssets?.length === 0) {
            updatedAssets = [...newAssets];
        } else {
            updatedAssets = [...selectedAssets, ...newAssets];
        }

        // Filter to only keep assets that are in the current selection
        updatedAssets = updatedAssets?.filter((existingAsset: any) => {
            const assetId = getAssetId(existingAsset);
            return singleSelectedRowIds?.includes(assetId);
        });

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

            // Also populate selectedAssets with actual asset objects
            // Find assets from assetData that match the selected IDs
            const preselectedAssets = assetData?.filter((asset: any) => selectedAssetIds?.includes(asset?.id)) || [];

            if (preselectedAssets.length > 0) {
                setSelectedAssets(preselectedAssets);
            }
        } else {
            // Reset if no selected IDs
            setSelectedAssets([]);
            setSelectedRows({});
        }
    }, [selectedAssetIds, assetData]);

    // Handle window resize to adjust table height
    useEffect(() => {
        const handleResize = () => {
            const availableHeight = window.innerHeight - 275;
            setTableHeight(Math.max(availableHeight, 400));
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="default-table-selector">
            <InfiniteScrollTable
                ref={tableRef}
                data={data}
                columns={columns}
                uniqueKey="id"
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
                        // Use selectedAssets state which contains all selected assets across all pages
                        // This ensures all selected assets are returned, not just those on the current page
                        successFn(selectedAssets);
                    }}
                    disabled={!selectedAssets?.length}
                    style={{
                        backgroundColor:
                            !selectedAssets?.length ? "#ccc" : "#6366f1",
                        cursor:
                            !selectedAssets?.length
                                ? "not-allowed"
                                : "pointer",
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
                    {`Add ${selectedAssets?.length} Asset${selectedAssets?.length > 1 ? "s" : ""
                        }`}
                </Button>
            </div>
        </div>
    );
}

export default Table;
