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

function BranchSpecificConfig({
  mappings,
  leftOptions,
  rightOptions,
  onAddMapping,
  onLeftSelect,
  onRightSelect,
  onDelete = () => {
    console.warn("handleDelete function not implemented");
  },
}: any) {
  const texts = localeTexts.ConfigFields.AdvancedConfig;

  return (
    <div>
      <Field>
        <FieldLabel
          htmlFor="contentType"
          className="contentMapWrapper-tags-label"
        >
          {texts.branchSpecific.label}
        </FieldLabel>
        <Help type="basic" text={texts.branchSpecific.helpText} />
        <Paragraph
          className="contentMapWrapper-heading"
          tagName="p"
          variant="p2"
          text={texts.branchSpecific.heading}
        />
      </Field>

      <MiniScrollableTable
        width="700px"
        headerComponent={<TableHeader title={texts.branchSpecific.tableTitle} />}
        rowComponent={
          <PairSelector
            mappings={mappings}
            leftOptions={leftOptions}
            rightOptions={rightOptions}
            onLeftSelect={onLeftSelect}
            onRightSelect={onRightSelect}
            onDelete={onDelete}
            config={{
              leftPlaceholder: texts.branchSpecific.leftPlaceholder,
              rightPlaceholder: texts.branchSpecific.rightPlaceholder,
              noOptionsMessage: texts.common.noOptionsMessage,
              deleteTooltip: texts.common.deleteTooltip,
              separator: texts.common.separator,
              containerClass: "custom-pair-container",
              selectWidth: "220px",
              separatorClass: "custom-separator",
              iconClass: "custom-delete-icon",
              showTooltip: true,
              showDeleteIcon: true,
              isRightDisabled: false,
              isSearchable: true,
              multiDisplayLimit: 10,
              isMultiLeft: true,
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
              {texts.branchSpecific.addMoreBtn}
            </Button>
          </div>
        }
      />
    </div>
  );
}

export default BranchSpecificConfig;
