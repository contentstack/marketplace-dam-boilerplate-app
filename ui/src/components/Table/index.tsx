import React, {
    useState,
    useRef,
    useEffect,
    useLayoutEffect,
    useCallback,
    useContext,
} from "react";
import {
    InfiniteScrollTable,
    Button,
    Icon,
} from "@contentstack/venus-components";
import { AssetData, TableProps } from "../../common/types";
import { getAssetType, getAssetIcon } from "../../common/utils/TableUtils";
import localeTexts from "../../common/locale/en-us";
import { MarketplaceAppContext } from "../../common/contexts/MarketplaceAppContext";
import { UI_LOCATIONS } from "../../common/constants";
import "./Table.scss";


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
                <div className="asset-icon" role="img" aria-label={alt}>
                    <Icon icon="Document" size="small" version="v2" />
                </div>
            );
        }

        const isLoaded = status === "loaded";
        const shouldAnimate = !wasCached;

        return (
            <div className="image-container">
                {/* Fallback icon - fades out when image loads */}
                <div
                    className={`asset-icon fallback-icon ${isLoaded ? "image-loaded" : ""} ${shouldAnimate ? "with-transition" : ""}`}
                    aria-hidden="true"
                >
                    <Icon icon="Document" size="small" version="v2" />
                </div>

                <img
                    ref={handleImageRef}
                    src={src}
                    alt={alt}
                    className={`asset-thumbnail ${isLoaded ? "image-loaded" : ""} ${shouldAnimate ? "with-transition" : ""}`}
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
    config,
    setError,
    successFn,
    closeFn,
    selectedAssetIds,
}: TableProps) {
    const { makeAPIRequest } = useContext(MarketplaceAppContext);

    const rowPerPageOptions = [10, 20, 50];
    const initialPageSize = rowPerPageOptions[0];
    const [data, updateData] = useState<AssetData[]>([]);
    const [loading, updateLoading] = useState(false);
    const [totalCounts, updateTotalCounts] = useState<number>(0);
    const [selectedAssets, setSelectedAssets] = useState<any[]>([]); // currently selected assets
    const [selectedRowIdsMap, setSelectedRowIdsMap] = useState<Record<string, boolean>>({}); // map of selected row IDs for table component
    const [tableHeight, setTableHeight] = useState(window.innerHeight - 275);
    const [pageSize, setPageSize] = useState(10);

    const tableRef = useRef<any>(null);

    // Convert selectedAssetIds array to object
    const getSelectedData = async (assetIds: string[] = []) => {
        if (assetIds?.length) {
            assetIds?.forEach((id: string) => {
                selectedRowIdsMap[id] = true;
            });
        }
        setSelectedRowIdsMap({ ...selectedRowIdsMap });
        return selectedRowIdsMap;
    };

    const renderAssetIcon = (asset: AssetData) => {
        const assetType = getAssetType(asset?.type);

        if (assetType === "image" && asset?.thumbnailUrl) {
            return (
                <ImageWithFallback src={asset?.thumbnailUrl} alt={asset?.name} />
            );
        }

        const iconName = getAssetIcon(assetType);

        return (
            <div className="asset-icon">
                <Icon icon={iconName || "Document"} size="small" />
            </div>
        );
    };

    // Memoize the asset name accessor function
    const renderAssetName = useCallback(
        (asset: any) => <div className="asset-name">{asset?.name}</div>,
        []
    );

    // Define table columns for DAM assets
    const columns = [
        {
            Header: localeTexts.SelectorPage.table.headers.image,
            id: "image",
            accessor: (asset: any) => renderAssetIcon(asset),
            disableSortBy: true,
            columnWidthMultiplier: 1,
        },
        {
            Header: localeTexts.SelectorPage.table.headers.name,
            id: "name",
            accessor: renderAssetName,
            columnWidthMultiplier: 2,
        },
        {
            Header: localeTexts.SelectorPage.table.headers.fileType,
            id: "type",
            accessor: "type",
            columnWidthMultiplier: 1,
        },
        {
            Header: localeTexts.SelectorPage.table.headers.size,
            accessor: "size",
            columnWidthMultiplier: 1,
        },
        {
            Header: localeTexts.SelectorPage.table.headers.width,
            id: "width",
            accessor: "width",
            disableSortBy: true,
            columnWidthMultiplier: 1,
        },
        {
            Header: localeTexts.SelectorPage.table.headers.height,
            id: "height",
            accessor: "height",
            disableSortBy: true,
            columnWidthMultiplier: 1,
        },
        {
            Header: localeTexts.SelectorPage.table.headers.createdDate,
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

            if (!config) return;

            // if searchText, then client-side search on existing data
            if (searchText) {
                updateLoading(true);

                // use current data for search to filter the data
                const dataToSearch = data;

                // apply client-side search
                let filteredData = dataToSearch?.filter((asset: any) =>
                    asset.name?.toLowerCase().includes(searchText.toLowerCase())
                );

                // Apply client-side sorting
                if (sortBy) {
                    filteredData = [...filteredData].sort((a: any, b: any) => {
                        const aVal = a[sortBy?.id] ?? "";
                        const bVal = b[sortBy?.id] ?? "";

                        if (sortBy?.id === "name") {
                            return sortBy?.sortingDirection === "asc"
                                ? aVal?.localeCompare(bVal)
                                : bVal?.localeCompare(aVal);
                        }
                        if (sortBy?.id === "fileType") {
                            return sortBy?.sortingDirection === "asc"
                                ? aVal?.localeCompare(bVal)
                                : bVal?.localeCompare(aVal);
                        }
                        if (sortBy?.id === "createdDate") {
                            const aDate = new Date(aVal);
                            const bDate = new Date(bVal);
                            return sortBy?.sortingDirection === "asc"
                                ? aDate.getTime() - bDate.getTime()
                                : bDate.getTime() - aDate.getTime();
                        }
                        return sortBy?.sortingDirection === "asc"
                            ? aVal?.localeCompare(bVal)
                            : bVal?.localeCompare(aVal);
                    });
                }

                // Apply client-side pagination to search results
                const currentSkip = skip ?? 0;
                const currentLimit = limit ?? pageSize;
                const paginatedData = filteredData?.slice(currentSkip, currentSkip + currentLimit);

                updateData(paginatedData);
                updateTotalCounts(filteredData?.length);
                updateLoading(false);
                return;
            }

            // No searchText - proceed with normal API call for pagination
            updateLoading(true);

            // Update pagination state
            const currentSkip = skip ?? 0;
            const currentLimit = limit ?? pageSize;
            setPageSize(currentLimit);

            // Build query params for API call (only pagination, no search/sort)
            const queryParams = `mode=getAllAssets&location=${UI_LOCATIONS.SELECTOR_PAGE}&limit=${currentLimit}&skip=${currentSkip}&config=${encodeURIComponent(JSON.stringify(config))}`;

            // Fetch paginated data from API
            const response = await makeAPIRequest({
                queryParams,
                method: "GET",
            });

            const apiData = await response?.json();

            // Handle different response structures
            const assets = apiData?.assets || apiData?.data || apiData || [];
            const total = apiData?.total || 0;

            // Apply client-side search
            let filteredData = Array.isArray(assets) ? assets : [];
            if (searchText) {
                filteredData = filteredData?.filter((asset: any) =>
                    asset.name?.toLowerCase().includes(searchText.toLowerCase())
                );
            }

            // Apply client-side sorting
            if (sortBy) {
                filteredData = [...filteredData]?.sort((a: any, b: any) => {
                    const aVal = a[sortBy?.id] ?? "";
                    const bVal = b[sortBy?.id] ?? "";

                    // Handle different column types
                    if (sortBy?.id === "name") {
                        // String sorting for asset names
                        return sortBy?.sortingDirection === "asc"
                            ? aVal?.localeCompare(bVal)
                            : bVal?.localeCompare(aVal);
                    }
                    if (sortBy?.id === "fileType") {
                        // String sorting for file types
                        return sortBy?.sortingDirection === "asc"
                            ? aVal?.localeCompare(bVal)
                            : bVal?.localeCompare(aVal);
                    }
                    if (sortBy?.id === "createdDate") {
                        // Date sorting
                        const aDate = new Date(aVal);
                        const bDate = new Date(bVal);
                        return sortBy?.sortingDirection === "asc"
                            ? aDate?.getTime() - bDate?.getTime()
                            : bDate?.getTime() - aDate?.getTime();
                    }
                    // Default string sorting for other columns
                    return sortBy?.sortingDirection === "asc"
                        ? aVal?.localeCompare(bVal)
                        : bVal?.localeCompare(aVal);
                });
            }

            updateData(filteredData);
            updateTotalCounts(total || filteredData?.length);
            updateLoading(false);
        } catch (error) {
            console.error("Error fetching assets:", error);
            setError({ isErr: true, errorText: localeTexts.SelectorPage.table.errors.failedToLoadAssets });
            updateLoading(false);
        }
    };

    // Pagination change handler
    const onChangePagination = (pageArgs: any) => {
        if (pageArgs && pageArgs?.pageSize) {
            setPageSize(pageArgs?.pageSize);
        }
    };

    const getSelectedRow = (
        singleSelectedRowIds: string[],
        selectedDataAssets: any
    ) => {
        const getAssetId = (asset: any) => asset?.id || "";

        const currentPageAssetIds = data?.map((asset: any) => getAssetId(asset)) || [];

        const newMap = { ...selectedRowIdsMap };

        // Removal of selections for assets on current page 
        currentPageAssetIds?.forEach((assetId: string) => {
            if (!singleSelectedRowIds?.includes(assetId)) {
                delete newMap?.[assetId];
            }
        });

        // Add new selections for current page
        singleSelectedRowIds?.forEach((id: string) => {
            newMap[id] = true;
        });

        // Update selectedRowIdsMap
        setSelectedRowIdsMap(newMap);

        // Get IDs of newly selected assets from current page
        const newSelectedIds = singleSelectedRowIds?.filter(
            (id: string) => !selectedAssets?.some(
                (existingAsset: any) => getAssetId(existingAsset) === id
            )
        ) || [];

        // Get new asset objects that were just selected
        const newAssets = selectedDataAssets?.filter(
            (newAsset: any) => {
                const newAssetId = getAssetId(newAsset);
                return newSelectedIds?.includes(newAssetId);
            }
        ) || [];

        // Start with existing selected assets
        let updatedAssets: any[] = [...(selectedAssets || [])];

        updatedAssets = updatedAssets?.filter((existingAsset: any) => {
            const assetId = getAssetId(existingAsset);
            const isInMap = newMap[assetId] === true;
            // Keep if asset is in the map (selected across any page)
            return isInMap;
        });

        // Add newly selected assets
        updatedAssets = [...updatedAssets, ...newAssets];

        // IMPORTANT: Ensure all assets in the map are in the array
        const allSelectedIds = Object.keys(newMap);
        allSelectedIds?.forEach((assetId: string) => {
            // Check if this asset is already in the array
            const existsInArray = updatedAssets?.some((asset: any) => getAssetId(asset) === assetId);
            if (!existsInArray) {
                // Try to find it in current page data first
                const assetFromCurrentPage = data?.find((asset: any) => getAssetId(asset) === assetId);
                if (assetFromCurrentPage) {
                    updatedAssets?.push(assetFromCurrentPage);
                } else {
                    // Asset is on another page - check if we have it in selectedAssets from before
                    const assetFromPreviousSelection = selectedAssets?.find((asset: any) => getAssetId(asset) === assetId);
                    if (assetFromPreviousSelection) {
                        updatedAssets?.push(assetFromPreviousSelection);
                    }
                }
            }
        });

        setSelectedAssets(updatedAssets);
    };

    useEffect(() => {
        if (config) {
            fetchData({ skip: 0, limit: initialPageSize });
        }
    }, [config]);

    const prevSelectedAssetIdsRef = useRef<string[] | undefined>(undefined);

    useEffect(() => {
        const prevSelectedAssetIds = prevSelectedAssetIdsRef.current;
        const selectedAssetIdsChanged = JSON.stringify(prevSelectedAssetIds) !== JSON.stringify(selectedAssetIds);

        if (!selectedAssetIdsChanged && prevSelectedAssetIds !== undefined) {
            return;
        }

        if (selectedAssetIds?.length) {
            getSelectedData(selectedAssetIds);

            // Also populate selectedAssets with actual asset objects
            // Find assets from current data that match the selected IDs
            const preselectedAssets = data?.filter((asset: any) => selectedAssetIds?.includes(asset?.id)) || [];

            if (preselectedAssets?.length) {
                setSelectedAssets((prevAssets) => {
                    const existingIds = prevAssets?.map((a: any) => a?.id || "") || [];
                    const newAssets = preselectedAssets?.filter(
                        (asset: any) => !existingIds?.includes(asset?.id || "")
                    );
                    return [...(prevAssets || []), ...newAssets];
                });
            }
        } else if (selectedAssetIdsChanged && selectedAssetIds !== undefined && selectedAssetIds?.length === 0) {
            // Only reset if selectedAssetIds actually changed to empty (not just when data changes)
            setSelectedAssets([]);
            setSelectedRowIdsMap({});
        }

        // Update ref for next comparison
        prevSelectedAssetIdsRef.current = selectedAssetIds;
    }, [selectedAssetIds, data]); // Keep data to find preselected assets, but only reset when selectedAssetIds actually changes

    // Sync selectedAssets with selectedRowIdsMap when data changes
    useEffect(() => {
        if (!data?.length || !selectedRowIdsMap) return;

        const getAssetId = (asset: any) => asset?.id || "";
        const currentAssetIds = selectedAssets?.map((a: any) => getAssetId(a)) || [];

        // Find assets in the map that are on the current page but not in the array
        const missingAssets = data.filter((asset: any) => {
            const assetId = getAssetId(asset);
            return selectedRowIdsMap?.[assetId] === true && !currentAssetIds?.includes(assetId);
        });

        if (missingAssets?.length > 0) {
            setSelectedAssets((prevAssets) => {
                const existingIds = prevAssets?.map((a: any) => getAssetId(a)) || [];
                const newAssets = missingAssets?.filter((asset: any) => !existingIds?.includes(getAssetId(asset)));
                return [...(prevAssets || []), ...newAssets];
            });
        }

        // Also remove assets that are no longer in the map
        const assetsToRemove = selectedAssets?.filter((asset: any) => {
            const assetId = getAssetId(asset);
            return !selectedRowIdsMap?.[assetId];
        }) || [];

        if (assetsToRemove?.length > 0) {
            setSelectedAssets((prevAssets) => prevAssets?.filter((asset: any) => {
                const assetId = getAssetId(asset);
                return selectedRowIdsMap[assetId] === true;
            }) || []);
        }
    }, [data, selectedRowIdsMap]);


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
                initialSelectedRowIds={selectedRowIdsMap}
                canSearch
                searchPlaceholder={localeTexts.SelectorPage.table.searchPlaceholder}
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
                    heading: localeTexts.SelectorPage.table.emptyState.heading,
                    description: localeTexts.SelectorPage.table.emptyState.description,
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
                    {localeTexts.SelectorPage.table.buttons.cancel}
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
                    disabled={Object.keys(selectedRowIdsMap || {}).length === 0}
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
                    {(() => {
                        // Use selectedRowIdsMap as source of truth for count (includes all pages)
                        const mapCount = Object.keys(selectedRowIdsMap || {}).length;
                        const count = mapCount; 
                        return `${localeTexts.SelectorPage.table.buttons.add} ${count} ${count !== 1 ? localeTexts.SelectorPage.table.buttons.addAssets : localeTexts.SelectorPage.table.buttons.addAsset}`;
                    })()}
                </Button>
            </div>
        </div>
    );
}

export default Table;

