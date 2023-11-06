/* Import React modules */
import React, { useContext } from "react";
/* Import other node modules */
import { AssetCardVertical } from "@contentstack/venus-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
/* Import our modules */
import { TypeAssetCard } from "../../../common/types";
import constants from "../../../common/constants";
import CustomFieldUtils from "../../../common/utils/CustomFieldUtils";
import CustomFieldContext from "../../../common/contexts/CustomFieldContext";
/* Import node module CSS */
/* Import our CSS */

// asset card component which is a dragable component
const AssetCard: React.FC<TypeAssetCard> = function ({ id }) {
  const { renderAssets: assets, removeAsset } = useContext(CustomFieldContext);
  const asset = CustomFieldUtils.findAsset(assets, id);
  const {
    name,
    type,
    thumbnailUrl,
    width,
    height,
    size,
    platformUrl,
    previewUrl,
  } = asset;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: asset?.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: isDragging ? constants.constantStyles.droppingDOMBorder : undefined,
    backgroundColor: isDragging
      ? constants.constantStyles.droppingDOMBackground
      : "inherit",
    borderRadius: 12,
  };

  return (
    <div
      key={`assetCard-${id}`}
      data-testid="render-list-item"
      className="selected-items"
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {isDragging ? (
        ""
      ) : (
        <AssetCardVertical
          title={name?.charAt(0)?.toUpperCase() + name?.slice(1)}
          assetType={type?.toLowerCase()}
          assetUrl={thumbnailUrl || ""}
          key={id}
          canHover
          width={width || ""}
          height={height || ""}
          size={Number(size)}
          actions={CustomFieldUtils.getHoverActions(
            type,
            removeAsset,
            id,
            name?.charAt(0)?.toUpperCase() + name?.slice(1),
            platformUrl,
            previewUrl
          )}
        />
      )}
    </div>
  );
};

export default AssetCard;
