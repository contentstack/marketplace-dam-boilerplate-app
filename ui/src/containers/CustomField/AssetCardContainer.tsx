/* Import React modules */
import React, { useCallback, useState } from "react";
/* Import other node modules */
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
/* Import our modules */
import { TypeAsset, TypeSelectedItems } from "../../common/types";
import utils from "../../common/utils";
import AssetCard from "./AssetCard";
/* Import node module CSS */
/* Import our CSS */

// component contains the asset container structure which acts as a droppable space for DnD context
const AssetCardContainer: React.FC<TypeSelectedItems> = function ({
  assets,
  removeAsset,
  setRearrangedAssets,
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
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

  return (
    <div className="asset-box" data-testid="assetBox">
      <div className="box-header" data-testid="assetBox-header">
        <span>
          {assets?.length} {assets?.length > 1 ? "Assets" : "Asset"}
        </span>
      </div>
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
    </div>
  );
};

export default AssetCardContainer;
