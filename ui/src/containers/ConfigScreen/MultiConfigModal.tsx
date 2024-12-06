import React, { useState } from "react";
import {
  ModalHeader,
  Field,
  FieldLabel,
  TextInput,
  ModalFooter,
  ButtonGroup,
  Button,
  InstructionText,
} from "@contentstack/venus-components";
import { debounce } from "lodash";
import { AddMultiConfigurationModalProps } from "../../common/types";
import localeTexts from "../../common/locale/en-us";

const MultiConfigModal: React.FC<AddMultiConfigurationModalProps> = function ({
  handleMultiConfig,
  multiConfigData,
  closeModal,
}) {
  const [enteredConfigName, setEnteredConfigName] = useState<any>("");
  const [hasDuplicateName, setHasDuplicateName] = useState<boolean>(false);
  const [nameLengthError, setNameLengthError] = useState<boolean>(false);
  const [hasLegacyName, setHasLegacyName] = useState<boolean>(false);
  const [hasNullUndefined, setHasNullUndefined] = useState<boolean>(false);

  const onInputChange = (e: any) => {
    const enteredValue = e?.target?.value?.trim();
    if (enteredValue?.length >= 1 && enteredValue?.length <= 50) {
      setNameLengthError(false);
    } else {
      setNameLengthError(true);
    }

    if (enteredValue === "legacy_config") {
      setHasLegacyName(true);
    } else {
      setHasLegacyName(false);
    }

    if (
      enteredValue?.toLowerCase() === "null" ||
      enteredValue?.toLowerCase() === "undefined"
    ) {
      setHasNullUndefined(true);
    } else {
      setHasNullUndefined(false);
    }

    setEnteredConfigName(enteredValue);

    const multiConfigKeys = Object.keys(multiConfigData);
    if (multiConfigKeys?.length) {
      const isDuplicate = multiConfigKeys?.some(
        (key: string) => key === enteredValue
      );
      setHasDuplicateName(isDuplicate);
    }
  };

  const onSaveConfiguration = () => {
    handleMultiConfig(enteredConfigName);
    closeModal();
  };

  return (
    <div className="ReactModalPortal">
      <div className="ReactModal__Overlay ReactModal__Overlay--after-open ReactModal__overlay-default flex-v-center">
        <div className="ReactModal__Content ReactModal__Content--after-open  ReactModal__Content--medium ">
          <ModalHeader
            title={localeTexts.ConfigFields.accModal.header}
            closeModal={closeModal}
            closeIconTestId="cs-default-header-close"
          />
          <Field>
            <FieldLabel required htmlFor="multiconfiglabel">
              {localeTexts.ConfigFields.accModal.textLabel}
            </FieldLabel>
            <TextInput
              required
              maxLength={50}
              showCharacterCount
              placeholder={localeTexts.ConfigFields.accModal.textPlaceholder}
              name="multiConfigLabelName"
              data-testid="multiconfiglabel-input"
              onChange={debounce(onInputChange, 300)}
              error={
                hasDuplicateName ||
                nameLengthError ||
                hasLegacyName ||
                hasNullUndefined
              }
              version="v2"
            />
            {hasDuplicateName && (
              <InstructionText className="multiConfig--warn">
                {localeTexts.ConfigFields.accModal.duplicateError}
              </InstructionText>
            )}
            {nameLengthError && (
              <InstructionText className="multiConfig--warn">
                {localeTexts.ConfigFields.accModal.nameLengthError}
              </InstructionText>
            )}
            {hasLegacyName && (
              <InstructionText className="multiConfig--warn">
                {localeTexts.ConfigFields.accModal.legacyNameError}
              </InstructionText>
            )}
            {hasNullUndefined && (
              <InstructionText className="multiConfig--warn">
                {localeTexts.ConfigFields.accModal.nullundefinedError}
              </InstructionText>
            )}
          </Field>
          <ModalFooter>
            <ButtonGroup>
              <Button buttonType="light" onClick={closeModal}>
                {localeTexts.ConfigFields.accModal.cancelBtn}
              </Button>
              <Button
                onClick={onSaveConfiguration}
                disabled={
                  !enteredConfigName ||
                  hasDuplicateName ||
                  nameLengthError ||
                  hasLegacyName
                }
              >
                {localeTexts.ConfigFields.accModal.addBtn}
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </div>
      </div>
    </div>
  );
};

export default MultiConfigModal;
