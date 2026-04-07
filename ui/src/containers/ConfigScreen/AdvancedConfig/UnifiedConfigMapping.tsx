import {
  Field,
  FieldLabel,
  Help,
  Paragraph,
  MiniScrollableTable,
  Button,
} from "@contentstack/venus-components";
import React from "react";
import PairSelector from "./PairSelector";
import localeTexts from "../../../common/locale/en-us";

const TableHeader: React.FC<{ title: string }> = function ({ title }) {
  return (
    <div className="flex-v-center">
      <FieldLabel
        htmlFor="Content Types"
        className="contentTypeRows__label field-color lang-mapper"
      >
        {title}
      </FieldLabel>
    </div>
  );
};

function UnifiedConfigMapping({
  mappings,
  leftOptions,
  middleOptions,
  rightOptions,
  onAddMapping,
  onLeftSelect,
  onMiddleSelect,
  onRightSelect,
  onDelete = () => {
    console.warn("handleDelete function not implemented");
  },
}: any) {
  const texts = localeTexts?.ConfigFields?.AdvancedConfig;

  if (!texts || !texts?.unified || !texts?.common) {
    return null;
  }

  const safeLeftOptions = Array.isArray(leftOptions) ? leftOptions : [];
  const safeMiddleOptions = Array.isArray(middleOptions) ? middleOptions : [];
  const safeRightOptions = Array.isArray(rightOptions) ? rightOptions : [];
  const safeMappings = Array.isArray(mappings) ? mappings : [];

  return (
    <div>
      <Field>
        <FieldLabel
          htmlFor="contentType"
          className="contentMapWrapper-tags-label"
        >
          {texts?.unified?.label || "Config Rule Selector"}
        </FieldLabel>
        <Help type="basic" text={texts?.unified?.helpText || "help"} />
        <Paragraph
          className="contentMapWrapper-heading"
          tagName="p"
          variant="p2"
          text={texts?.unified?.heading || "Choose your default config rules"}
        />
      </Field>

      <MiniScrollableTable
        width="700px"
        headerComponent={<TableHeader title={texts?.unified?.tableTitle || "Config Mapping"} />}
        rowComponent={
          <PairSelector
            mappings={safeMappings}
            leftOptions={safeLeftOptions}
            middleOptions={safeMiddleOptions}
            rightOptions={safeRightOptions}
            onLeftSelect={onLeftSelect}
            onMiddleSelect={onMiddleSelect}
            onRightSelect={onRightSelect}
            onDelete={onDelete}
            config={{
              leftPlaceholder: texts?.unified?.leftPlaceholder || "Select Branch",
              middlePlaceholder: texts?.unified?.middlePlaceholder || "Select Locale (Optional)",
              rightPlaceholder: texts?.unified?.rightPlaceholder || "Select Config",
              noOptionsMessage: texts?.common?.noOptionsMessage || "No options available",
              deleteTooltip: texts?.common?.deleteTooltip || "Remove mapping",
              separator: texts?.common?.separator || "-",
              containerClass: "custom-pair-container",
              selectWidth: "180px",
              separatorClass: "custom-separator",
              iconClass: "custom-delete-icon",
              showTooltip: true,
              showDeleteIcon: true,
              isRightDisabled: false,
              isSearchable: true,
              multiDisplayLimit: 10,
              isMultiLeft: false,
              isMultiMiddle: true,
              isLeftExhaustive: false,
              isMiddleExhaustive: false,
              isRightExhaustive: false,
              maxCharacters: 15,
            }}
          />
        }
        footerComponent={
          <div className="add-more-btn">
            <Button
              buttonType="tertiary-outline"
              onClick={onAddMapping}
              icon="Plus"
              iconAlignment="left"
            >
              {texts?.unified?.addMoreBtn || "add more"}
            </Button>
          </div>
        }
      />
    </div>
  );
}

export default UnifiedConfigMapping;
