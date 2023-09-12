/* Import React modules */
import React from "react";
/* Import other node modules */
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
/* Import our modules */
import { TypeAsset, TypeCardContainer } from "../../../common/types";
import utils from "../../../common/utils";
import AssetList from "./AssetList";
import localeTexts from "../../../common/locale/en-us";
/* Import node module CSS */
/* Import our CSS */

// component contains the asset container structure which acts as a droppable space for DnD context
const AssetListContainer: React.FC<TypeCardContainer> = function ({
  assets,
  removeAsset,
  onDragEnd,
  onDragCancel,
  onDragStart,
  activeId,
  sensors,
}) {
  return (
    <div
      role="table"
      className="Table"
      style={{ height: assets?.length > 4 ? "400px" : "203px" }}
    >
      <div role="rowgroup">
        <div className="table-relative">
          <div className="table-overflow">
            <div className="Table__head">
              <div role="row" className="Table__head__row">
                <div
                  aria-colspan={1}
                  role="columnheader"
                  className="Table__head__column  "
                >
                  <div>
                    <span className="Table__head__column-text">
                      {localeTexts?.CustomFields?.listViewTable?.thumbnailCol}
                    </span>
                  </div>
                </div>
                <div
                  aria-colspan={1}
                  role="columnheader"
                  className="Table__head__column  "
                >
                  <div>
                    <span className="Table__head__column-text">
                      {localeTexts?.CustomFields?.listViewTable?.assetNameCol}
                    </span>
                  </div>
                </div>
                <div
                  aria-colspan={1}
                  role="columnheader"
                  className="Table__head__column  "
                >
                  <div>
                    <span className="Table__head__column-text">
                      {localeTexts.CustomFields.listViewTable.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="Table__body"
              style={{
                height: `${assets?.length * 60}`,
              }}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
                onDragCancel={onDragCancel}
                onDragStart={onDragStart}
              >
                <SortableContext items={assets}>
                  {assets?.map((asset: TypeAsset) => (
                    <AssetList
                      key={`assetCard-${asset?.id}`}
                      id={asset?.id}
                      asset={asset}
                      removeAsset={removeAsset}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <AssetList
                      id={activeId}
                      asset={utils.findAsset(assets, activeId)}
                      removeAsset={removeAsset}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetListContainer;
