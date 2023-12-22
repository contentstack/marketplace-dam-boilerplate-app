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
  remove,
  id,
  name: itemName,
  ...props
}) {
  return (
    <>
      <ModalHeader
        title={localeTexts.DeleteModal.header}
        closeModal={props.closeModal}
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
            onClick={props.closeModal}
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
            onClick={useCallback(() => {
              props.closeModal();
              setTimeout(() => {
                remove(id);
              }, 300);
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
