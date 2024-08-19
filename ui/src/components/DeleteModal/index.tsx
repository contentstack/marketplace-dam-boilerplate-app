import React, { useCallback, useState } from "react";
import {
  Button,
  ButtonGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
} from "@contentstack/venus-components";
import localeTexts from "../../common/locale/en-us";
import { Props } from "../../common/types";

const DeleteModal: React.FC<Props> = function ({
  remove,
  id,
  name: itemName,
  configLocation,
  ...props
}) {
  const [deleteConfirmationName, setDeleteConfirmationName] = useState("");
  const [deleteBtnDisable, setDeleteBtnDisable] = useState(true);

  const handleDeleteInput = (e: any) => {
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
        title={
          configLocation
            ? localeTexts.ConfigFields.DeleteModal.header
            : localeTexts.CustomFields.DeleteModal.header
        }
        closeModal={props.closeModal}
      />
      <ModalBody className="deleteModalBody">
        <p
          dangerouslySetInnerHTML={{
            __html: `${
              configLocation
                ? localeTexts.ConfigFields.DeleteModal.body.replace(
                    /\$/g,
                    itemName
                  )
                : localeTexts.CustomFields.DeleteModal.body.replace(
                    /\$/g,
                    itemName
                  )
            }`,
          }}
        />
        {configLocation && (
          <>
            <br />
            <TextInput
              required
              maxLength={50}
              showCharacterCount
              hideCharCountError={false}
              placeholder={localeTexts.ConfigFields.DeleteModal.textPlaceholder}
              name="deleteConfirmationName"
              value={deleteConfirmationName}
              onChange={handleDeleteInput}
              version="v2"
            />
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button
            buttonType="light"
            size="small"
            version="v2"
            onClick={props.closeModal}
          >
            {localeTexts.CustomFields.DeleteModal.cancelButton}
          </Button>
          <Button
            buttonType="delete"
            icon={
              configLocation
                ? localeTexts.Icons.delete
                : localeTexts.Icons.removeFilled
            }
            iconProps={{
              size: "mini",
              className: "remove-modal-icon",
            }}
            size="small"
            version="v2"
            disabled={configLocation && deleteBtnDisable}
            onClick={useCallback(() => {
              props.closeModal();
              setTimeout(() => {
                remove(id);
              }, 300);
            }, [id, props])}
          >
            {configLocation
              ? localeTexts.ConfigFields.DeleteModal.confirmButton
              : localeTexts.CustomFields.DeleteModal.confirmButton}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};

export default DeleteModal;
