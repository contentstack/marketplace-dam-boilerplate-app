/* Import React modules */
import React, { useCallback } from "react";
import {
  Field,
  FieldLabel,
  TextInput,
  Line,
  InstructionText,
  Help,
  Select,
  Radio,
} from "@contentstack/venus-components";
/* Import other node modules */
import {
  TypeConfigComponent,
  TypeOption,
  TypeRadioOption,
} from "../../common/types";
/* Import our modules */
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
          onChange={useCallback(
            (e: TypeOption) => updateConfig(e, objKey),
            [objKey]
          )}
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
