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
} from "@contentstack/venus-components";
import parse from "html-react-parser";
import { debounce } from "lodash";
/* Import our modules */
import {
  TypeConfigComponent,
  TypeOption,
  TypeRadioOption,
} from "../../common/types";
import localeTexts from "../../common/locale/en-us";
import InfoMessage from "../../components/InfoMessage";
import AppConfigContext from "../../common/contexts/AppConfigContext";
import ConfigStateContext from "../../common/contexts/ConfigStateContext";
import utils from "../../common/utils";
import rootConfig from "../../root_config";

// component for Text Input Field
export const TextInputField = function ({
  objKey,
  objValue,
  updateConfig = () => {},
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
        <Help
          text={objValue?.helpText}
          data-testid="text_help"
          type="primary"
        />
      )}
      <TextInput
        id={`${objKey}-id`}
        value={fieldValue}
        maxLength={250}
        showCharacterCount
        hideCharCountError={false}
        placeholder={objValue?.placeholderText}
        name={`${acckey}$--${objKey}`}
        onChange={updateConfig}
        type={objValue?.inputFieldType}
        canShowPassword
        data-testid="text_input"
        version="v2"
      />
      <InstructionText data-testid="text_instruction">
        <div>{parse(objValue?.instructionText ?? "")}</div>
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
        <Help
          text={objValue?.helpText}
          data-testid="radio_help"
          type="primary"
        />
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
        <div>{parse(objValue?.instructionText ?? "")}</div>
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
        <Help
          text={objValue?.helpText}
          data-testid="select_help"
          type="primary"
        />
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
        <div>{parse(objValue?.instructionText ?? "")}</div>
      </InstructionText>
    </Field>
  );
};

const checkModalValue = ({
  modalValue,
  customOptions,
}: {
  modalValue: string;
  customOptions: TypeOption[];
}) => {
  let returnValue: TypeOption[] = [];
  modalValue = modalValue?.trim();
  const matchValue = customOptions?.find(
    (i: TypeOption) => i?.value === modalValue
  );
  if (!matchValue) {
    returnValue = [{ label: modalValue, value: modalValue }];
  } else {
    utils.toastMessage({
      type: "error",
      content: {
        error: {
          error_message: `${localeTexts.ConfigFields.customWholeJson.notification.error.replace(
            "$var",
            modalValue
          )}`,
        },
      },
    });
  }
  return returnValue;
};

export const ModalComponent = function ({
  closeModal,
  handleModalValue,
}: {
  closeModal: () => void;
  handleModalValue: Function;
}) {
  const {
    CustomOptionsContext: { customOptions },
  } = useContext(ConfigStateContext);
  const [modalValue, setModalValue] = useState("");
  const [selectOptions, setSelectOptions] = useState<TypeOption[]>([]);
  const [options, setOptions] = useState<TypeOption[]>([...customOptions]);
  const [isEmptySpace, setIsEmptySpace] = useState<boolean>(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if ([...options, ...selectOptions, ...updatedValue]?.length <= 150) {
        utils.toastMessage({
          type: "success",
          content: {
            text: localeTexts.ConfigFields.customWholeJson.modal.successToast,
          },
        });
      }
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
              maxLength={250}
              showCharacterCount
              hideCharCountError={false}
              value={modalValue}
              placeholder={
                localeTexts.ConfigFields.customWholeJson.modal.placeholder
              }
              name="label"
              autoComplete="off"
              onChange={debounce(handleChange, 300)}
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
                <Icon icon={localeTexts.Icons.checkedPurple} />
                {localeTexts.ConfigFields.customWholeJson.modal.btn.create}
              </Button>
              <Button
                version="v2"
                size="small"
                disabled={!modalValue?.length || isEmptySpace}
                onClick={() => handleValueCreate("createApply")}
              >
                <Icon icon={localeTexts.Icons.checkedWhite} />
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
        <Help
          text={localeTexts.ConfigFields.entrySaveRadioButton.help}
          type="primary"
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
          {!isCustom
            ? localeTexts.ConfigFields.entrySaveRadioButton
                .all_field_instruction
            : localeTexts.ConfigFields.entrySaveRadioButton
                .custom_field_instruction}
        </InstructionText>
        <br />
        <InfoMessage
          content={localeTexts.ConfigFields.entrySaveRadioButton.notetext}
        />
      </Field>
      {isCustom && (
        <Field className="dam-keys">
          <FieldLabel required htmlFor="dam_keys" version="v2">
            {localeTexts.ConfigFields.keysField.label}
          </FieldLabel>
          <Help text={localeTexts.ConfigFields.keysField.help} type="primary" />
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
                <Icon icon={localeTexts.Icons.plus} />
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
