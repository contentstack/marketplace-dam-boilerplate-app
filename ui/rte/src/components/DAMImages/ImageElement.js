/* eslint-disable */
import React, { useRef, useEffect, useCallback } from "react";
import { Tooltip, Icon, cbModal } from "@contentstack/venus-components";
import PropTypes from "prop-types";
import { Resizable } from "re-resizable";
import cloneDeep from "lodash.clonedeep";
import EmbedBtn from "../EmbedBtn";
import ImageEditModal from "../ImageEditModal";
import DeleteModal from "../DeleteModal";
import utils from "../../common/utils";
import "../styles.scss";
import rteConfig from "../../rte_config/index";

const ImageElement = function ({
  attributes,
  children,
  element,
  attrs,
  rte,
  ...props
}) {
  const isSelected = rte?.selection?.isSelected();
  const isFocused = rte?.selection?.isFocused();
  const isHighlight = isFocused && isSelected;
  const alignment = attrs?.style?.textAlign;
  const icon = utils.getIconType(element?.attrs?.rte_resource_type);
  const isInline = !!(
    element?.attrs?.inline || element?.attrs?.["redactor-attributes"]?.inline
  );
  const imgRef = useRef(null);
  const parentRef = useRef(null);
  const displayType =
    element?.attrs?.rte_resource_type?.toLowerCase() === "image"
      ? "display"
      : "download";
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
        const divDOM = DOMVal[i];
        let descrip = divDOM?.getElementsByTagName("span")?.[0];
        if (
          element?.attrs?.position == "right" &&
          divDOM?.getAttribute("id") ==
            `right${btoa(element?.attrs?.rte_display_url)}`
        ) {
          descrip?.setAttribute("style", "float: left");
        } else if (
          element?.attrs?.position == "right" &&
          divDOM?.getAttribute("id") ==
            `left${btoa(element?.attrs?.rte_display_url)}`
        ) {
          let idRight = divDOM?.getElementsByTagName("p")?.[0]?.parentNode;
          idRight?.setAttribute("style", "overflow : hidden");
          descrip?.setAttribute("style", "float: left");
        } else if (
          element?.attrs?.position == "left" &&
          divDOM?.getAttribute("id") ==
            `right${btoa(element?.attrs?.rte_display_url)}`
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
    window.open(element?.attrs?.rte_display_url, "_blank");
  }, [element?.attrs?.rte_display_url]);

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
          type: "Asset",
          remove: useRemoveHook,
          name: element?.attrs?.name,
          ...props,
        }),
      modalProps: {
        size: "xsmall",
      },
    });
  }, [rte?.removeNode, element, element?.attrs?.name, props]);

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
    const iconType = rteConfig?.getViewIconforTooltip?.(
      element?.attrs?.rte_resource_type
    );
    return (
      <div contentEditable={false} className="embed--btn-group">
        {iconType && ["Eye", "NewTab"]?.includes(iconType) && (
          <EmbedBtn
            title="view"
            content={utils.getToolTipIconContent(iconType)}
            onClick={handleView}
          >
            <Icon icon={iconType} />
          </EmbedBtn>
        )}

        <EmbedBtn title="edit" content="Edit" onClick={handleEdit}>
          <Icon icon="Rename" />
        </EmbedBtn>

        <EmbedBtn title="delete" content="Delete" onClick={handleDelete}>
          <Icon icon="Delete" />
        </EmbedBtn>
      </div>
    );
  };

  const onResizeStop = useCallback(() => {
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
  }, [
    element,
    imgRef?.current?.offsetWidth,
    imgRef?.current?.offsetHeight,
    rte?.getPath,
    rte?.updateNode,
  ]);

  return (
    <div style={{ ...alignmentStyle, ...attrs?.style }}>
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
          <div ref={parentRef} contentEditable={false}>
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
                      src={element?.attrs?.rte_display_url}
                      onError={utils.handleImageError}
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
                      alt={element?.attrs?.["asset-alt"]}
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
                      tooltipContent={attrs?.name}
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
