/* Import React modules */
import React, { useContext } from "react";
/* Import other node modules */
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
/* Import our modules */
import { TypeAsset, TypeCardContainer } from "../../../common/types";
import AssetCard from "./AssetCard";
import CustomFieldContext from "../../../common/contexts/CustomFieldContext";
/* Import node module CSS */
/* Import our CSS */

// component contains the asset container structure which acts as a droppable space for DnD context
const AssetCardContainer: React.FC<TypeCardContainer> = function (props: any) {
  const { onDragEnd, onDragCancel, onDragStart, activeId, sensors } = props;
  const { renderAssets: assets } = useContext(CustomFieldContext);

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
            <AssetCard key={`assetCard-${asset?.id}`} id={asset?.id} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>{activeId ? <AssetCard id={activeId} /> : null}</DragOverlay>
    </DndContext>
  );
};

export default AssetCardContainer;
