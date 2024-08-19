import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  ButtonGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@contentstack/venus-components";
import localeTexts from "../../common/locale/en-us";

const DeleteModal = function ({ remove, name: itemName, closeModal }) {
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
            icon={localeTexts.Icons.removeFilled}
            iconProps={{
              size: "mini",
              className: "remove-modal-icon",
            }}
            size="small"
            version="v2"
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
