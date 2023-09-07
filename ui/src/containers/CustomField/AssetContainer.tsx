/* Import React modules */
import React, { useCallback, useState } from "react";
/* Import other node modules */
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Dropdown, Tooltip, Icon } from "@contentstack/venus-components";
/* Import our modules */
import { TypeSelectedItems } from "../../common/types";
import utils from "../../common/utils";
import localeTexts from "../../common/locale/en-us";
import AssetCardContainer from "./Card/AssetCardContainer";
import AssetListContainer from "./List/AssetListContainer";
/* Import node module CSS */
/* Import our CSS */

// component contains the asset container structure which acts as a droppable space for DnD context
const AssetContainer: React.FC<TypeSelectedItems> = function ({
  assets,
  removeAsset,
  setRearrangedAssets,
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [view, setView] = useState<any>({ value: "card" });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 0.1 } })
  );

  const onDragStart = useCallback(({ active }: any) => {
    if (!active) {
      return;
    }
    setActiveId(active?.id);
  }, []);

  const onDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const onDragEnd = useCallback(
    (event: any) => {
      const { active, over } = event;
      setActiveId(null);
      if (active?.id !== over?.id) {
        const oldIndex = utils.findAssetIndex(assets, active?.id);
        const newIndex = utils.findAssetIndex(assets, over?.id);

        const updated = arrayMove(assets, oldIndex, newIndex);
        setRearrangedAssets(updated);
      }
    },
    [assets]
  );

  const handleToggle = (event: any) => {
    setView(event);
  };

  return (
    <div className="asset-box" data-testid="assetBox">
      <div className="box-header" data-testid="assetBox-header">
        <span>
          {assets?.length}{" "}
          {assets?.length > 1
            ? localeTexts.CustomFields.header.asset.plural
            : localeTexts.CustomFields.header.asset.singular}
        </span>
        <div className="viewToggler">
          <Dropdown
            list={utils.gridViewDropdown}
            dropDownType="primary"
            type="click"
            viewAs="label"
            onChange={handleToggle}
            withArrow
            withIcon
            dropDownPosition="bottom"
            closeAfterSelect
            highlightActive={false}
          >
            <Tooltip
              content={localeTexts.CustomFields.header.changeView}
              position="top"
            >
              <Icon
                icon={
                  view?.value === "card"
                    ? localeTexts?.CustomFields?.toolTip?.thumbnail
                    : localeTexts?.CustomFields?.toolTip?.list
                }
                size="original"
              />
            </Tooltip>
          </Dropdown>
        </div>
      </div>
      {view?.value === "card" ? (
        <AssetCardContainer
          assets={assets}
          removeAsset={removeAsset}
          sensors={sensors}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
          onDragStart={onDragStart}
          activeId={activeId}
        />
      ) : (
        <AssetListContainer
          assets={assets}
          removeAsset={removeAsset}
          sensors={sensors}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
          onDragStart={onDragStart}
          activeId={activeId}
        />
      )}
    </div>
  );
};

export default AssetContainer;
