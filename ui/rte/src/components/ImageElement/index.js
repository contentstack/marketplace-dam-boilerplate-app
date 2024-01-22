import React, { useRef, useEffect, useCallback } from "react";
import { Tooltip, Icon, cbModal } from "@contentstack/venus-components";
import PropTypes from "prop-types";
import { Resizable } from "re-resizable";
import cloneDeep from "lodash.clonedeep";
import EmbedBtn from "../EmbedBtn";
import ImageEditModal from "../ImageEditModal";
import DeleteModal from "../DeleteModal";
import utils from "../../common/utils";
import rteConfig from "../../rte_config/index";
import localeTexts from "../../common/locale/en-us";
import "../styles.scss";

const ImageElement = function ({
  attributes,
  children,
  element,
  attrs,
  rte,
  ...props
}) {
  const RTE_RESOURCE_TYPE = rteConfig?.getAssetType?.(element?.attrs) ?? "";
  const RTE_DISPLAY_URL = rteConfig?.getDisplayUrl?.(element?.attrs) ?? "";
  const isSelected = rte?.selection?.isSelected();
  const isFocused = rte?.selection?.isFocused();
  const isHighlight = isFocused && isSelected;
  const alignment = attrs?.style?.textAlign;
  const icon = utils.getIconType(RTE_RESOURCE_TYPE);
  const isInline = !!(
    element?.attrs?.inline || element?.attrs?.["redactor-attributes"]?.inline
  );
  const imgRef = useRef(null);
  const parentRef = useRef(null);
  const displayType =
    RTE_RESOURCE_TYPE?.toLowerCase() === "image" ? "display" : "download";
  const initialDimensions = utils.getInitialDimensions(element, displayType);

  useEffect(() => {
    let newAttrs = cloneDeep(element?.attrs);
    const imagePath = rte?.getPath(element);

    if (element?.attrs?.position) {
      rte?.updateNode(
        rteConfig?.damEnv?.DAM_APP_NAME,
        {
          ...newAttrs,
        },
        { at: imagePath }
      );
    }
    if (!element?.attrs?.["asset-caption"]) {
      newAttrs["asset-caption"] = "";
      rte?.updateNode(
        rteConfig?.damEnv?.DAM_APP_NAME,
        {
          ...newAttrs,
        },
        { at: imagePath }
      );
    }
  }, [element?.attrs?.["asset-caption"]]);

  useEffect(() => {
    const DOMVal = document?.querySelectorAll(
      `div[classname='${rteConfig?.damEnv?.DAM_APP_NAME}']`
    );
    const DOMValLength = DOMVal?.length;
    if (DOMValLength) {
      for (let i = 0; i < DOMValLength; i++) {
        const divDOM = DOMVal?.[i];
        let descrip = divDOM?.getElementsByTagName("span")?.[0];
        if (
          element?.attrs?.position == "right" &&
          divDOM?.getAttribute("id") == `right${btoa(RTE_DISPLAY_URL)}`
        ) {
          descrip?.setAttribute("style", "float: left");
        } else if (
          element?.attrs?.position == "right" &&
          divDOM?.getAttribute("id") == `left${btoa(RTE_DISPLAY_URL)}`
        ) {
          let idRight = divDOM?.getElementsByTagName("p")?.[0]?.parentNode;
          idRight?.setAttribute("style", "overflow : hidden");
          descrip?.setAttribute("style", "float: left");
        } else if (
          element?.attrs?.position == "left" &&
          divDOM?.getAttribute("id") == `right${btoa(RTE_DISPLAY_URL)}`
        ) {
          let idLeft = divDOM?.getElementsByTagName("p")?.[0]?.parentNode;
          idLeft?.setAttribute(
            "style",
            "display: inline-block",
            "overflow : hidden"
          );
        }
      }
    }
  }, [element?.attrs?.position, rte?.getPath(element)]);

  const handleView = useCallback(() => {
    window.open(RTE_DISPLAY_URL, "_blank");
  }, [RTE_DISPLAY_URL]);

  const handleEdit = useCallback(() => {
    cbModal({
      component: (compProps) =>
        ImageEditModal({
          element,
          rte,
          icon,
          path: rte?.getPath(element),
          ...compProps,
        }),
    });
  }, [element, rte, icon, rte?.getPath]);

  const useRemoveHook = useCallback(
    () => rte?.removeNode(element),
    [rte?.removeNode, element]
  );

  const handleDelete = useCallback(() => {
    cbModal({
      component: (props) =>
        DeleteModal({
          remove: useRemoveHook,
          name: element?.attrs?.[rteConfig?.damEnv?.ASSET_NAME_PARAM],
          ...props,
        }),
      modalProps: {
        size: "xsmall",
      },
    });
  }, [
    rte?.removeNode,
    element,
    element?.attrs?.[rteConfig?.damEnv?.ASSET_NAME_PARAM],
    props,
  ]);

  const alignmentStyle = utils.getAlignmentStyle(alignment, attrs, isInline);

  const { highlightclass, downloadTypeclass } = utils.getProperties(
    isHighlight,
    isInline,
    displayType
  );

  const tooltipclass = isInline
    ? `embed-asset--inline ${highlightclass}`
    : `embed-asset ${highlightclass} ${downloadTypeclass}`;

  const CustomComponent = () => {
    const iconType = rteConfig?.getViewIconforTooltip?.(RTE_RESOURCE_TYPE);
    return (
      <div contentEditable={false} className="embed--btn-group">
        {iconType && ["Eye", "NewTab"]?.includes(iconType) && (
          <EmbedBtn
            title={localeTexts.RTE.iconContent.preview}
            content={utils.getToolTipIconContent(iconType)}
            onClick={handleView}
          >
            <Icon icon={iconType} />
          </EmbedBtn>
        )}

        <EmbedBtn
          title="edit"
          content={localeTexts.RTE.iconContent.edit}
          onClick={handleEdit}
        >
          <Icon icon="Rename" />
        </EmbedBtn>

        <EmbedBtn
          title="remove"
          content={localeTexts.RTE.iconContent.remove}
          onClick={handleDelete}
        >
          <Icon icon="RemoveFilled" size="tiny" />
        </EmbedBtn>
      </div>
    );
  };

  const onResizeStop = () => {
    const { attrs: elementAttrs } = element;
    const width = imgRef?.current?.offsetWidth;
    const height = imgRef?.current?.offsetHeight;
    const newAttrs = { ...elementAttrs };
    newAttrs.width = width;
    newAttrs.height = height;
    const newStyles = { ...newAttrs?.style };
    newAttrs.style = { ...newStyles };
    newAttrs.style["max-width"] = `${width}px`;
    newAttrs.width = `${width}`;
    newAttrs.height = `${height}`;
    const imagePath = rte?.getPath(element);
    rte?.updateNode(
      rteConfig?.damEnv?.DAM_APP_NAME,
      {
        ...newAttrs,
      },
      { at: imagePath }
    );
  };

  return (
    <div
      style={{ ...alignmentStyle, ...attrs?.style }}
      className="embed-asset-container"
    >
      <Tooltip
        zIndex={909}
        className="p-0"
        position="bottom"
        variantType="light"
        offset={[0, -15]}
        content={<CustomComponent />}
      >
        <span
          {...attributes}
          {...attrs}
          data-type="asset"
          contentEditable={false}
        >
          <div ref={parentRef} contentEditable={false} className="noLineHeight">
            <Resizable
              lockAspectRatio
              onResizeStop={onResizeStop}
              size={initialDimensions}
              className="scrte--img-container"
              handleStyles={{
                right: { right: 0, width: "15px" },
                left: { left: 0, width: "15px" },
                bottom: { bottom: "0" },
              }}
            >
              <div
                ref={imgRef}
                contentEditable={false}
                style={{ width: "100%", height: "100%" }}
              >
                <div className={tooltipclass}>
                  {!icon && (
                    <img
                      src={RTE_DISPLAY_URL}
                      onError={utils.handleImageError}
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
                      alt={element?.attrs?.["asset-alt"]}
                      title={
                        element?.attrs?.[rteConfig?.damEnv?.ASSET_NAME_PARAM]
                      }
                    />
                  )}
                  {!isInline && (
                    <div className="embed-icon">
                      <Icon icon="Embed" />
                    </div>
                  )}
                  {icon && (
                    <Icon
                      icon={icon}
                      size="large"
                      withTooltip
                      tooltipContent={
                        attrs?.[rteConfig?.damEnv?.ASSET_NAME_PARAM]
                      }
                      tooltipPosition="top"
                    />
                  )}
                </div>
              </div>
              <span
                contentEditable={false}
                className="scrte-image-resizer-feedback-left"
              >
                <span
                  contentEditable={false}
                  className="scrte-image-resizer-feedback"
                />
              </span>
              <span
                contentEditable={false}
                className="scrte-image-resizer-feedback-right"
              >
                <span
                  contentEditable={false}
                  className="scrte-image-resizer-feedback"
                />
              </span>
              {element?.attrs?.["asset-caption"] && (
                <p className="scrte--caption">
                  {element?.attrs?.["asset-caption"]}
                </p>
              )}
            </Resizable>
          </div>
          {children}
        </span>
      </Tooltip>
    </div>
  );
};

export default ImageElement;

ImageElement.propTypes = {
  attributes: PropTypes.any,
  children: PropTypes.any,
  element: PropTypes.any,
  attrs: PropTypes.any,
  rte: PropTypes.any,
};
