/* Import React modules */
import React from "react";
/* Import other node modules */
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
/* Import our modules */
import { TypeAsset, TypeCardContainer } from "../../../common/types";
import utils from "../../../common/utils";
import AssetCard from "./AssetCard";
/* Import node module CSS */
/* Import our CSS */

// component contains the asset container structure which acts as a droppable space for DnD context
const AssetCardContainer: React.FC<TypeCardContainer> = function (props: any) {
  const {
    assets,
    removeAsset,
    onDragEnd,
    onDragCancel,
    onDragStart,
    activeId,
    sensors,
  } = props;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
      onDragStart={onDragStart}
    >
      <SortableContext items={assets}>
        <div className="render-items" data-testid="renderItems-wrapper">
          {assets?.map((asset: TypeAsset) => (
            <AssetCard
              key={`assetCard-${asset?.id}`}
              id={asset?.id}
              asset={asset}
              removeAsset={removeAsset}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <AssetCard
            id={activeId}
            asset={utils.findAsset(assets, activeId)}
            removeAsset={removeAsset}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default AssetCardContainer;
