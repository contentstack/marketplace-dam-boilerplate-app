import React, { useCallback } from "react";
import {
  Button,
  ButtonGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@contentstack/venus-components";
import localeTexts from "../../common/locale/en-us";
import { Props } from "../../common/types";

const DeleteModal: React.FC<Props> = function ({
  type,
  remove,
  id,
  name: itemName,
  ...props
}) {
  return (
    <>
      <ModalHeader
        title={`${localeTexts.DeleteModal.header} ${type}`}
        closeModal={props.closeModal}
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
          <Button buttonType="light" onClick={props.closeModal}>
            {localeTexts.DeleteModal.cancelButton}
          </Button>
          <Button
            buttonType="delete"
            icon="TrashMini"
            onClick={useCallback(() => {
              remove(id);
              props.closeModal();
            }, [id, props])}
          >
            {localeTexts.DeleteModal.confirmButton}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};

export default DeleteModal;
