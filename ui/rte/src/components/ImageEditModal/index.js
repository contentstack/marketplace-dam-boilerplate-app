/* eslint-disable */
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  ModalFooter,
  ModalBody,
  ModalHeader,
  ButtonGroup,
  Button,
  Field,
  FieldLabel,
  TextInput,
  Checkbox,
  Select,
  Icon,
} from "@contentstack/venus-components";
import cloneDeep from "lodash.clonedeep";
import { v4 } from "uuid";
import utils from "../../common/utils";
import constantValues from "../../common/constants/index";
import "../styles.scss";
import rteConfig from "../../rte_config/index";
import localeTexts from "../../common/locale/en-us/index";

const ImageEditModal = function (props) {
  const { element, rte, icon, closeModal, path } = props;
  const [state, setState] = useState({});
  let modalTitle;
  switch (icon) {
    case "Video":
      modalTitle = localeTexts.ModalTitle.video;
      break;
    case "Audio":
      modalTitle = localeTexts.ModalTitle.audio;
      break;
    case null:
      modalTitle = localeTexts.ModalTitle.image;
      break;
    default:
      modalTitle = localeTexts.ModalTitle.default;
  }

  useEffect(() => {
    setState(element?.attrs);
  }, []);

  const imgAlignment = (imgAlign) => {
    switch (imgAlign) {
      case "right":
        return {
          style: { overflow: "hidden" },
          classname: rteConfig?.damEnv?.DAM_APP_NAME,
          id: `right${btoa(element?.attrs?.rte_display_url)}`,
        };
      case "left":
        return {
          style: { display: "inline-block", overflow: "hidden" },
          classname: rteConfig?.damEnv?.DAM_APP_NAME,
          id: `left${btoa(element?.attrs?.rte_display_url)}`,
        };
    }
  };

  const handleSave = useCallback(() => {
    closeModal();
    let node = rte?.getNode(rte?.getPath(element));
    let newNode = cloneDeep(node[0]);
    newNode.attrs = { ...(state || {}) };
    if (state?.inline) {
      if (rte?._adv?.editor?.isInline(element)) {
        rte?._adv?.Transforms?.setNodes(
          rte?._adv?.editor,
          { attrs: state },
          { at: path }
        );
      } else {
        rte?._adv?.Transforms?.removeNodes(rte?._adv?.editor, {
          at: rte?.getPath(element),
        });
        const inlineReference = {
          type: "p",
          attrs: imgAlignment(state?.position),
          uid: v4().split("-").join(""),
          children: [{ text: "" }, newNode, { text: "" }],
        };
        rte?._adv?.Transforms?.insertNodes(rte?._adv?.editor, inlineReference, {
          at: rte?.getPath(element),
        });
      }
    } else {
      if (rte?._adv?.editor?.isInline(element)) {
        rte?._adv?.Transforms?.removeNodes(rte?._adv?.editor, {
          at: path,
        });
        let blockPath = [path[0], path[1] + 1];
        rte?._adv?.Transforms?.insertNodes(rte?._adv?.editor, newNode, {
          at: blockPath,
        });
      } else {
        rte?._adv?.Transforms?.setNodes(
          rte?._adv?.editor,
          { attrs: state },
          { at: rte?.getPath(element) }
        );
      }
    }
  }, [
    path,
    state,
    element,
    closeModal,
    state?.position,
    state?.inline,
    rte?.getNode,
    rte?.getPath,
    rte?._adv?.editor,
    rte?._adv?.editor?.isInline,
    rte?._adv?.Transforms?.setNodes,
    rte?._adv?.Transforms?.removeNodes,
    rte?._adv?.Transforms?.insertNodes,
  ]);

  const updateSelect = async (e) => {
    const fieldValue = e?.value;
    if (fieldValue === "none") {
      if (state?.inline) {
        await setState((prevState) => ({
          ...prevState,
          inline: false,
          "redactor-attributes": {
            ...prevState["redactor-attributes"],
            inline: false,
          },
        }));
      }
    }
    await setState((prevState) => ({
      ...prevState,
      position: fieldValue,
      "redactor-attributes": {
        ...prevState["redactor-attributes"],
        position: fieldValue,
      },
      style:
        fieldValue === "none"
          ? {}
          : {
              "text-align": fieldValue,
              "max-width": prevState.width ? `${prevState.width}px` : undefined,
              // Add float: fieldValue, if elements should be inline by default
            },
    }));
  };

  const updateCheckbox = async (e) => {
    const isCheckd = e?.target?.checked;
    const fieldName = e?.target?.name;

    if (
      fieldName === "inline" &&
      isCheckd &&
      (state?.position == "center" || !state?.position)
    ) {
      await setState((prevState) => ({
        ...prevState,
        position: "left",
        "redactor-attributes": {
          ...prevState["redactor-attributes"],
          position: "left",
        },
        style: {
          "text-align": "left",
          "max-width": prevState?.width ? `${prevState?.width}px` : undefined,
          float: "left",
        },
      }));
    }
    if (state?.inline) {
      const stateStyleCopy = { ...state?.style };
      delete stateStyleCopy.float;
      await setState({ ...state, style: stateStyleCopy });
    }
    await setState((prevState) => ({
      ...prevState,
      [fieldName]: isCheckd
        ? utils.getTargetValue(fieldName, "attrs")
        : undefined,
      "redactor-attributes": {
        ...prevState["redactor-attributes"],
        [fieldName]: isCheckd
          ? true
          : utils.getTargetValue(fieldName, "redactor-attributes"),
      },
    }));
  };

  const updateText = async (e) => {
    const fieldName = e?.target?.name;
    const fieldValue = e?.target?.value;
    const attr = {
      alt: "asset-alt",
      caption: "asset-caption",
      anchorLink: "link",
    };
    const fname = attr[fieldName];
    await setState((prevState) => ({
      ...prevState,
      [fname]: fieldValue || undefined,
      "redactor-attributes": {
        ...prevState["redactor-attributes"],
        [fieldName]: fieldValue || undefined,
      },
    }));
  };

  const updateData = useCallback(
    async (e) => {
      if (e?.type === "select") {
        await updateSelect(e);
      } else if (e?.target?.type === "checkbox") {
        await updateCheckbox(e);
      } else if (e?.target?.type === "text") {
        await updateText(e);
      }
    },
    [updateSelect, updateCheckbox, updateText]
  );

  let { dropdownList } = constantValues;

  if (state?.inline) {
    dropdownList = dropdownList.filter((ele) => ele?.value !== "center");
  }

  return (
    <>
      <ModalHeader title={modalTitle} closeModal={closeModal} />

      <ModalBody className="modalBodyCustomClass">
        <div className="scrte-form-container">
          <div>
            {!icon ? (
              <img
                src={element?.attrs?.rte_display_url}
                className="modal"
                alt={element?.attrs?.["asset-alt"]}
              />
            ) : (
              <Icon className="modal-icon" icon={icon} />
            )}
          </div>
          <div>
            <Field>
              <FieldLabel htmlFor="alt">
                {constantValues.constants.altText.label}
              </FieldLabel>
              <TextInput
                value={state?.["asset-alt"]}
                placeholder={constantValues.constants.altText.placeholder}
                name="alt"
                onChange={updateData}
              />
            </Field>
            <Field>
              <Select
                selectLabel={constantValues.constants.alignment.label}
                value={{
                  label: state?.position || "none",
                  value: state?.position || "none",
                  type: "select",
                }}
                onChange={updateData}
                options={dropdownList}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="caption">
                {constantValues.constants.caption.label}
              </FieldLabel>
              <TextInput
                value={state?.["asset-caption"]}
                placeholder={constantValues.constants.caption.placeholder}
                name="caption"
                onChange={updateData}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="anchorLink">
                {constantValues.constants.embedLink.label}
              </FieldLabel>
              <TextInput
                value={state?.link}
                placeholder={constantValues.constants.embedLink.placeholder}
                name="anchorLink"
                onChange={updateData}
              />
            </Field>
            <Field>
              <Checkbox
                checked={state?.["redactor-attributes"]?.target || false}
                name="target"
                label={constantValues.constants.newTab.label}
                onChange={updateData}
                className="modal-checkbox"
              />
            </Field>
            <Field>
              <Checkbox
                checked={state?.inline}
                name="inline"
                className="modal-checkbox"
                label={constantValues.constants.inlineImage.label}
                onChange={updateData}
                disabled={
                  state?.position === "center" || state?.position === "none"
                    ? true
                    : false
                }
              />
            </Field>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <ButtonGroup>
          <Button onClick={closeModal} buttonType="light">
            {localeTexts.RTE.button.cancel}
          </Button>
          <Button onClick={handleSave} icon="SaveWhite">
            {localeTexts.RTE.button.save}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};

export default ImageEditModal;

// eslint-disable-next-line
ImageEditModal.propTypes = {
  element: PropTypes.object,
  rte: PropTypes.object,
  icon: PropTypes.string,
  closeModal: PropTypes.func,
};
