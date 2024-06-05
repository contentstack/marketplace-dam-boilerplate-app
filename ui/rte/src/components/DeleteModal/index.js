import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  TextInput,
  Button,
  ButtonGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@contentstack/venus-components";
import localeTexts from "../../common/locale/en-us";

const DeleteModal = function ({ remove, name: itemName, closeModal }) {
  const [deleteConfirmationName, setDeleteConfirmationName] = useState("");
  const [deleteBtnDisable, setDeleteBtnDisable] = useState(true);

  const handleDeleteInput = (e) => {
    const inputValue = e?.target?.value?.trim();
    if (inputValue === itemName) {
      setDeleteConfirmationName(inputValue);
      setDeleteBtnDisable(false);
    } else {
      setDeleteBtnDisable(true);
    }
  };

  return (
    <>
      <ModalHeader
        title={localeTexts.DeleteModal.header}
        closeModal={closeModal}
      />
      <ModalBody className="deleteModalBody">
        <p
          dangerouslySetInnerHTML={{
            __html: `${localeTexts.DeleteModal.body.replace(/\$/g, itemName)}`,
          }}
        />
        <br />
        <TextInput
          required
          placeholder={localeTexts.DeleteModal.textPlaceholder}
          name="deleteConfirmationName"
          value={deleteConfirmationName}
          onChange={handleDeleteInput}
          version="v2"
        />
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button
            buttonType="light"
            size="small"
            version="v2"
            onClick={closeModal}
          >
            {localeTexts.DeleteModal.cancelButton}
          </Button>
          <Button
            buttonType="delete"
            icon="RemoveFilled"
            iconProps={{
              size: "mini",
              className: "remove-modal-icon",
            }}
            size="small"
            version="v2"
            disabled={deleteBtnDisable}
            onClick={() => {
              remove();
              closeModal();
            }}
          >
            {localeTexts.DeleteModal.confirmButton}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};

export default DeleteModal;

// eslint-disable-next-line
DeleteModal.propTypes = {
  type: PropTypes.string,
  remove: PropTypes.func,
  name: PropTypes.string,
  closeModal: PropTypes.func,
};
