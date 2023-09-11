/* Import React modules */
import React, { useCallback, useState } from "react";
/* Import other node modules */
import {
  Field,
  FieldLabel,
  TextInput,
  Line,
  InstructionText,
  Help,
  Select,
  Radio,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  Button,
  cbModal,
  Icon,
  Notification,
} from "@contentstack/venus-components";
/* Import our modules */
import {
  TypeConfigComponent,
  TypeOption,
  TypeRadioOption,
} from "../../common/types";
import localeTexts from "../../common/locale/en-us";
import WarningMessage from "../../components/WarningMessage";
import utils from "../../common/utils";
import constants from "../../common/constants";
/* Import node module CSS */
/* Import our CSS */

// component for Text Input Field
export const TextInputField = function ({
  objKey,
  objValue,
  currentValue,
  updateConfig,
}: TypeConfigComponent) {
  return (
    <>
      <Field>
        <FieldLabel required htmlFor={`${objKey}-id`} data-testid="text_label">
          {" "}
          {/* Change the label caption as per your requirement */}
          {objValue?.labelText}
        </FieldLabel>
        {objValue?.helpText && (
          <Help text={objValue?.helpText} data-testid="text_help" />
        )}
        {/* Change the help caption as per your requirement */}
        <TextInput
          id={`${objKey}-id`}
          required
          value={currentValue}
          placeholder={objValue?.placeholderText}
          name={objKey}
          onChange={updateConfig}
          data-testid="text_input"
          version="v2"
        />
        <InstructionText data-testid="text_instruction">
          {objValue?.instructionText}
        </InstructionText>
      </Field>
      <Line type="dashed" />
    </>
  );
};

// component for single radio option
export const RadioOption = function ({
  fieldName,
  mode,
  index,
  radioOption,
  updateRadioOptions,
}: TypeRadioOption) {
  const updateRadio = useCallback(
    () => updateRadioOptions(fieldName, mode),
    [fieldName, mode]
  );

  return (
    <Radio
      key={`${fieldName}_${index}_option`}
      id={mode?.value}
      checked={mode?.value === radioOption?.value}
      required
      label={mode?.label}
      name={`${fieldName}_options`}
      onChange={updateRadio}
    />
  );
};

// component for Radio Options
export const RadioInputField = function ({
  objKey,
  objValue,
  currentValue,
  updateConfig,
}: TypeConfigComponent) {
  return (
    <>
      <Field>
        <FieldLabel
          required
          htmlFor={`${objKey}_options`}
          data-testid="radio_label"
        >
          {objValue?.labelText}
        </FieldLabel>
        {objValue?.helpText && (
          <Help text={objValue?.helpText} data-testid="radio_help" />
        )}
        <div className="Radio-wrapper" data-testid="radio_wrapper">
          {objValue?.options?.map((option: TypeOption, index: number) => (
            <RadioOption
              key={option?.value}
              fieldName={objKey}
              mode={option}
              index={index}
              radioOption={currentValue}
              updateRadioOptions={updateConfig}
            />
          ))}
        </div>
        <InstructionText data-testid="radio_instruction">
          {objValue?.instructionText}
        </InstructionText>
      </Field>
      <Line type="dashed" />
    </>
  );
};

// component for Select Options
export const SelectInputField = function ({
  objKey,
  objValue,
  currentValue,
  updateConfig,
}: TypeConfigComponent) {
  return (
    <>
      <Field>
        <FieldLabel
          required
          htmlFor={`${objKey}-id`}
          data-testid="select_label"
        >
          {objValue?.labelText}
        </FieldLabel>
        {objValue?.helpText && (
          <Help text={objValue?.helpText} data-testid="select_help" />
        )}
        <Select
          onChange={(e: TypeOption) => updateConfig(e, objKey)}
          options={objValue?.options}
          placeholder={objValue?.placeholderText}
          value={currentValue}
          name={`${objKey}-id`}
          data-testid="select_input"
        />
        <InstructionText data-testid="select_instruction">
          {objValue?.instructionText}
        </InstructionText>
      </Field>
      <Line type="dashed" />
    </>
  );
};

const checkModalValue = ({ modalValue, customOptions }: any) => {
  let returnValue: any[] = [];
  modalValue = modalValue?.trim();
  const matchValue = customOptions?.find((i: any) => i?.value === modalValue);
  if (matchValue === undefined) {
    returnValue = [{ label: modalValue, value: modalValue }];
  } else {
    Notification({
      displayContent: {
        error: {
          error_message: `${localeTexts.ConfigFields.customWholeJson.notification.errorS} "${modalValue}" ${localeTexts.ConfigFields.customWholeJson.notification.errorE}`,
        },
      },
      notifyProps: {
        hideProgressBar: true,
        className: "modal_toast_message",
      },
      type: "error",
    });
  }
  return returnValue;
};

export const ModalComponent = function ({
  props,
  handleModalValue,
  customOptions,
}: any) {
  const [modalValue, setModalValue] = useState("");
  const [selectOptions, setSelectOptions] = useState<any[]>([]);
  const [options, setOptions] = useState<any>([...customOptions]);

  const handleChange = async (e: any) => {
    setModalValue(e?.target?.value);
  };

  const handleValueCreate = async (action: string) => {
    const updatedValue = checkModalValue({
      customOptions: options,
      modalValue,
    });
    if (updatedValue?.length) {
      setOptions([...options, ...updatedValue]);
      setSelectOptions([...selectOptions, ...updatedValue]);
      utils.toastMessage(
        localeTexts.ConfigFields.customWholeJson.modal.successToast
      );
    }
    if (action === "create") {
      setModalValue("");
    } else {
      handleModalValue(selectOptions, action, updatedValue);
      props?.closeModal();
    }
  };

  return (
    <>
      <ModalHeader
        title={localeTexts.ConfigFields.customWholeJson.modal.header}
        closeModal={() => {
          handleModalValue(selectOptions, "create", []);
          props?.closeModal();
        }}
      />
      <ModalBody className="modalBodyCustomClass">
        <FieldLabel required htmlFor="label">
          {localeTexts.ConfigFields.customWholeJson.modal.label}
        </FieldLabel>
        <TextInput
          required
          autoFocus
          value={modalValue}
          placeholder={
            localeTexts.ConfigFields.customWholeJson.modal.placeholder
          }
          name="label"
          autoComplete="off"
          onChange={handleChange}
          version="v2"
        />
        <InstructionText>
          {localeTexts.ConfigFields.customWholeJson.modal.instructionS}
          <br />
          <p className="note-p">
            {localeTexts.ConfigFields.customWholeJson.modal.note}
          </p>
          {localeTexts.ConfigFields.customWholeJson.modal.instructionE}
        </InstructionText>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button
            buttonType="light"
            version="v2"
            size="small"
            onClick={() => {
              handleModalValue(selectOptions, "create", []);
              props?.closeModal();
            }}
          >
            {localeTexts.ConfigFields.customWholeJson.modal.btn.cancel}
          </Button>
          <Button
            onClick={() => handleValueCreate("create")}
            buttonType="secondary"
            size="small"
            disabled={!modalValue?.length}
            version="v2"
          >
            <Icon icon="CheckedPurple" />
            {localeTexts.ConfigFields.customWholeJson.modal.btn.create}
          </Button>
          <Button
            version="v2"
            size="small"
            disabled={!modalValue?.length}
            onClick={() => handleValueCreate("createApply")}
          >
            <Icon icon="CheckedWhite" />
            {localeTexts.ConfigFields.customWholeJson.modal.btn.apply}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};

export const JsonComponent = function ({
  handleModalValue,
  isCustom,
  updateCustomJSON,
  customOptions,
  updateTypeObj,
  damKeys,
}: any) {
  return (
    <>
      <Line type="dashed" />
      <Field className="json-field">
        <FieldLabel required htmlFor="is_custom_json">
          {localeTexts.ConfigFields.entrySaveRadioButton.label}
        </FieldLabel>
        <Help text={localeTexts.ConfigFields.entrySaveRadioButton.help} />
        <br />
        <br />
        <WarningMessage
          content={localeTexts.ConfigFields.entrySaveRadioButton.notetext}
        />
        <div className="Radio-wrapper">
          <Radio
            id="wholeJSON"
            checked={!isCustom}
            required
            label={localeTexts.ConfigFields.entrySaveRadioButton.wholeJson}
            name="is_custom_json"
            value={false}
            onChange={updateCustomJSON}
          />
          <Radio
            id="customJSON"
            checked={isCustom}
            required
            label={localeTexts.ConfigFields.entrySaveRadioButton.customJson}
            name="is_custom_json"
            value
            onChange={updateCustomJSON}
          />
        </div>
        <InstructionText>
          {localeTexts.ConfigFields.entrySaveRadioButton.instruction}{" "}
          {localeTexts.ConfigFields.entrySaveRadioButton.referS}{" "}
          <a
            href={constants.limitationsDocUrl}
            target="_blank"
            rel="noreferrer"
          >
            {localeTexts.ConfigFields.entrySaveRadioButton.custom}
          </a>{" "}
          {localeTexts.ConfigFields.entrySaveRadioButton.referE}
        </InstructionText>
      </Field>
      {isCustom && (
        <Field className="dam-keys">
          <FieldLabel required htmlFor="dam_keys">
            {localeTexts.ConfigFields.keysField.label}
          </FieldLabel>
          <Help text={localeTexts.ConfigFields.keysField.help} />
          <Select
            options={customOptions}
            onChange={updateTypeObj}
            value={damKeys}
            isMulti
            isSearchable
            version="v2"
            hasAddOption
            addOptionText={
              <>
                <Icon icon="Plus" />
                {localeTexts.ConfigFields.customWholeJson.modal.addOption}
              </>
            }
            addOption={() =>
              cbModal({
                // eslint-disable-next-line
                component: (props: any) => (
                  <ModalComponent
                    props={props}
                    handleModalValue={handleModalValue}
                    customOptions={customOptions}
                  />
                ),
                testId: "cs-modal",
              })
            }
          />
        </Field>
      )}
    </>
  );
};
