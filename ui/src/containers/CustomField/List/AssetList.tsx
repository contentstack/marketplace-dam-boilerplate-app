import React, { useState } from "react";
import { ActionTooltip, Icon, Tooltip } from "@contentstack/venus-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TypeAssetList } from "../../../common/types";
import constants from "../../../common/constants";
import NoImage from "../../../components/NoImage";
import localeTexts from "../../../common/locale/en-us";
import utils from "../../../common/utils";

const AssetList: React.FC<TypeAssetList> = function ({
  id,
  asset,
  removeAsset,
}) {
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

  const noAssetElement = (
    <div className="noImage">
      <Tooltip
        content={localeTexts?.CustomFields?.toolTip?.content}
        position="top"
        showArrow={false}
        variantType="light"
        type="secondary"
      >
        <NoImage />
      </Tooltip>
    </div>
  );

  const handleImageError = () => {
    setImageError(true);
  };

  const getIconElement = () => {
    let returnEl;
    switch (type?.toLowerCase()) {
      case "image":
        returnEl = thumbnailUrl ? (
          <div className="rowImage">
            <img src={thumbnailUrl} alt="Asset" onError={handleImageError} />
          </div>
        ) : (
          noAssetElement
        );
        break;
      case "video":
        returnEl = (
          <div className="noImage icon-element">
            <Icon icon="MP4" size="small" />
          </div>
        );
        break;
      case "raw":
        returnEl = (
          <div className="noImage icon-element">
            <Icon icon="DOC2" />
          </div>
        );
        break;
      default:
        returnEl = noAssetElement;
    }
    return returnEl;
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
            utils.getListHoverActions(
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
            {!imageError ? getIconElement() : noAssetElement}
          </div>
          <div role="cell" className="Table__body__column">
            <p>{name?.charAt(0)?.toUpperCase() + name?.slice(1)}</p>
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
