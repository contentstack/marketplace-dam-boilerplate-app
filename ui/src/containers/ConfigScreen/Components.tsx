/* Import React modules */
import React, { useCallback, useState, useContext } from "react";
/* Import other node modules */
import {
  Field,
  FieldLabel,
  TextInput,
  InstructionText,
  Help,
  Select,
  Radio,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  Button,
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
import constants from "../../common/constants";
import AppConfigContext from "../../common/contexts/AppConfigContext";
import ConfigStateContext from "../../common/contexts/ConfigStateContext";
import ConfigScreenUtils from "../../common/utils/ConfigScreenUtils";
import rootConfig from "../../root_config";
/* Import node module CSS */
/* Import our CSS */

// component for Text Input Field
export const TextInputField = function ({
  objKey,
  objValue,
  updateConfig,
  acckey,
}: TypeConfigComponent) {
  const { installationData } = useContext(AppConfigContext);
  let fieldValue = "";
  if (objValue?.saveInConfig || objValue?.saveInServerConfig) {
    fieldValue = acckey
      ? installationData?.[
          objValue.saveInConfig ? "configuration" : "serverConfiguration"
        ]?.multi_config_keys?.[acckey]?.[objKey]
      : installationData?.[
          objValue.saveInConfig ? "configuration" : "serverConfiguration"
        ]?.[objKey];
  }

  return (
    <Field>
      <FieldLabel
        required={rootConfig.damEnv.REQUIRED_CONFIG_FIELDS?.includes(objKey)}
        htmlFor={`${objKey}-id`}
        data-testid="text_label"
        version="v2"
      >
        {" "}
        {objValue?.labelText}
      </FieldLabel>
      {objValue?.helpText && (
        <Help text={objValue?.helpText} data-testid="text_help" />
      )}
      <TextInput
        id={`${objKey}-id`}
        value={fieldValue}
        placeholder={objValue?.placeholderText}
        name={`${acckey}$--${objKey}`}
        onChange={updateConfig}
        type={objValue?.inputFieldType}
        canShowPassword
        data-testid="text_input"
        version="v2"
      />
      <InstructionText data-testid="text_instruction">
        <div
          dangerouslySetInnerHTML={{
            __html: objValue?.instructionText,
          }}
        />
      </InstructionText>
    </Field>
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
  acckey,
}: TypeConfigComponent) {
  const {
    RadioInputContext: { radioInputValues, updateRadioOptions },
  } = useContext(ConfigStateContext);

  return (
    <Field>
      <FieldLabel
        required={rootConfig.damEnv.REQUIRED_CONFIG_FIELDS?.includes(objKey)}
        htmlFor={`${objKey}_options`}
        data-testid="radio_label"
        version="v2"
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
            fieldName={`${acckey}$--${objKey}`}
            mode={option}
            index={index}
            radioOption={
              acckey
                ? radioInputValues?.[`${acckey}$:${objKey}`]
                : radioInputValues?.[objKey]
            }
            updateRadioOptions={updateRadioOptions}
          />
        ))}
      </div>
      <InstructionText data-testid="radio_instruction">
        <div
          dangerouslySetInnerHTML={{
            __html: objValue?.instructionText,
          }}
        />
      </InstructionText>
    </Field>
  );
};

// component for Select Options
export const SelectInputField = function ({
  objKey,
  objValue,
  acckey,
}: TypeConfigComponent) {
  const {
    SelectInputContext: { selectInputValues, updateSelectConfig },
  } = useContext(ConfigStateContext);
  const fieldValue = acckey
    ? selectInputValues?.[`${acckey}$:${objKey}`]
    : selectInputValues?.[objKey];
  return (
    <Field>
      <FieldLabel
        required={rootConfig.damEnv.REQUIRED_CONFIG_FIELDS?.includes(objKey)}
        htmlFor={`${objKey}-id`}
        data-testid="select_label"
        version="v2"
      >
        {objValue?.labelText}
      </FieldLabel>
      {objValue?.helpText && (
        <Help text={objValue?.helpText} data-testid="select_help" />
      )}
      <Select
        onChange={(e: TypeOption) =>
          updateSelectConfig(e, `${acckey}$--${objKey}`)
        }
        options={objValue?.options}
        placeholder={objValue?.placeholderText}
        value={fieldValue}
        name={`${objKey}-id`}
        data-testid="select_input"
        version="v2"
      />
      <InstructionText data-testid="select_instruction">
        <div
          dangerouslySetInnerHTML={{
            __html: objValue?.instructionText,
          }}
        />
      </InstructionText>
    </Field>
  );
};

const checkModalValue = ({ modalValue, customOptions }: any) => {
  let returnValue: any[] = [];
  modalValue = modalValue?.trim();
  const matchValue = customOptions?.find((i: any) => i?.value === modalValue);
  if (!matchValue) {
    returnValue = [{ label: modalValue, value: modalValue }];
  } else {
    Notification({
      displayContent: {
        error: {
          error_message: `${localeTexts.ConfigFields.customWholeJson.notification.error.replace(
            "$var",
            modalValue
          )}`,
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

export const ModalComponent = function ({ closeModal, handleModalValue }: any) {
  const {
    CustomOptionsContext: { customOptions },
  } = useContext(ConfigStateContext);
  const [modalValue, setModalValue] = useState("");
  const [selectOptions, setSelectOptions] = useState<any[]>([]);
  const [options, setOptions] = useState<any>([...customOptions]);
  const [isEmptySpace, setIsEmptySpace] = useState<boolean>(false);

  const handleChange = async (e: any) => {
    const value = e?.target?.value?.trim();
    if (/\s/.test(value) || value === "") {
      setIsEmptySpace(true);
    } else {
      setIsEmptySpace(false);
      setModalValue(value);
    }
  };

  const handleValueCreate = async (action: string) => {
    const updatedValue = checkModalValue({
      customOptions: options,
      modalValue,
    });
    if (updatedValue?.length) {
      setOptions([...options, ...updatedValue]);
      setSelectOptions([...selectOptions, ...updatedValue]);
      ConfigScreenUtils.toastMessage(
        localeTexts.ConfigFields.customWholeJson.modal.successToast
      );
    }
    if (action === "create") {
      setModalValue("");
    } else {
      handleModalValue(selectOptions, action, updatedValue);
      closeModal();
    }
  };

  return (
    <div className="ReactModalPortal">
      <div className="ReactModal__Overlay ReactModal__Overlay--after-open ReactModal__overlay-default flex-v-center">
        <div className="ReactModal__Content ReactModal__Content--after-open  ReactModal__Content--medium ">
          <ModalHeader
            title={localeTexts.ConfigFields.customWholeJson.modal.header}
            closeModal={() => {
              handleModalValue(selectOptions, "create", []);
              closeModal();
            }}
          />
          <ModalBody className="modalBodyCustomClass">
            <FieldLabel required htmlFor="label" version="v2">
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
                  closeModal();
                }}
              >
                {localeTexts.ConfigFields.customWholeJson.modal.btn.cancel}
              </Button>
              <Button
                onClick={() => handleValueCreate("create")}
                buttonType="secondary"
                size="small"
                disabled={!modalValue?.length || isEmptySpace}
                version="v2"
              >
                <Icon icon="CheckedPurple" />
                {localeTexts.ConfigFields.customWholeJson.modal.btn.create}
              </Button>
              <Button
                version="v2"
                size="small"
                disabled={!modalValue?.length || isEmptySpace}
                onClick={() => handleValueCreate("createApply")}
              >
                <Icon icon="CheckedWhite" />
                {localeTexts.ConfigFields.customWholeJson.modal.btn.apply}
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </div>
      </div>
    </div>
  );
};

export const JsonComponent = function () {
  const {
    CustomOptionsContext: { customOptions },
    CustomCheckContext: { isCustom },
    DamKeysContext: { damKeys },
    JSONCompContext: { handleModalValue, updateCustomJSON, updateTypeObj },
  } = useContext(ConfigStateContext);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Field className="json-field">
        <FieldLabel required htmlFor="is_custom_json" version="v2">
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
          <FieldLabel required htmlFor="dam_keys" version="v2">
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
            className="dam-keys-select"
            addOptionText={
              <>
                <Icon icon="Plus" />
                {localeTexts.ConfigFields.customWholeJson.modal.addOption}
              </>
            }
            addOption={() => setModalOpen(true)}
          />
          {isModalOpen && (
            <ModalComponent
              closeModal={() => setModalOpen(false)}
              handleModalValue={handleModalValue}
            />
          )}
        </Field>
      )}
    </>
  );
};
