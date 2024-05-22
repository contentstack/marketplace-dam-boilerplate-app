import React, { useContext, useState } from "react";
import { ActionTooltip, Tooltip } from "@contentstack/venus-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TypeAssetList } from "../../../common/types";
import constants from "../../../common/constants";
import CustomFieldUtils from "../../../common/utils/CustomFieldUtils";
import CustomFieldContext from "../../../common/contexts/CustomFieldContext";

const AssetList: React.FC<TypeAssetList> = function ({ id }) {
  const { removeAsset, renderAssets: assets } = useContext(CustomFieldContext);
  const asset = CustomFieldUtils.findAsset(assets, id);
  const [imageError, setImageError] = useState<boolean>(false);
  const { name, type, thumbnailUrl, previewUrl, platformUrl } = asset;
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
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className="Table__body__row"
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {isDragging ? (
        ""
      ) : (
        <ActionTooltip
          list={
            CustomFieldUtils.getListHoverActions(
              type,
              removeAsset,
              id,
              name?.charAt(0)?.toUpperCase() + name?.slice(1),
              platformUrl,
              previewUrl
            ) ?? []
          }
        >
          <div role="cell" className="Table__body__column">
            {!imageError
              ? CustomFieldUtils.getIconElement({
                  type,
                  thumbnailUrl,
                  handleImageError,
                })
              : CustomFieldUtils.noAssetElement}
          </div>
          <div role="cell" className="Table__body__column">
            <Tooltip
              content={name?.charAt(0)?.toUpperCase() + name?.slice(1)}
              position="top"
            >
              <p>{name?.charAt(0)?.toUpperCase() + name?.slice(1)}</p>
            </Tooltip>
          </div>
          <div role="cell" className="Table__body__column">
            {type?.charAt(0)?.toUpperCase() + type.slice(1)}
          </div>
        </ActionTooltip>
      )}
    </div>
  );
};

export default React.memo(AssetList);
