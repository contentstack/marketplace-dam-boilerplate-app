/* eslint-disable */
import PropTypes from "prop-types";
import {
  Button,
  ButtonGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@contentstack/venus-components";
import React from "react";
import localeTexts from "../../common/locale/en-us";

const DeleteModal = function (props) {
  const { type, remove, name: itemName, closeModal } = props;
  return (
    <>
      <ModalHeader
        title={`${localeTexts.DeleteModal.header} ${type}`}
        closeModal={closeModal}
      />
      <ModalBody className="deleteModalBody">
        <p
          dangerouslySetInnerHTML={{
            __html: `${localeTexts.DeleteModal.body.replace("$", itemName)}`,
          }}
        />
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button buttonType="light" onClick={closeModal}>
            {localeTexts.DeleteModal.cancelButton}
          </Button>
          <Button
            buttonType="delete"
            icon="TrashMini"
            onClick={useCallback(() => {
              remove();
              closeModal();
            }, [remove, closeModal])}
          >
            {localeTexts.DeleteModal.confirmButton}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};

export default DeleteModal;

DeleteModal.propTypes = {
  type: PropTypes.string,
  remove: PropTypes.func,
  name: PropTypes.string,
  closeModal: PropTypes.func,
};
