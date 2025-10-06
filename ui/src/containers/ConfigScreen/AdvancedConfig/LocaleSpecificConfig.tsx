import {
  FieldLabel,
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

function LocaleSpecificConfig({
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
  const texts = localeTexts.ConfigFields.AdvancedConfig;

  return (
    <div>

      <MiniScrollableTable
        width="700px"
        headerComponent={<TableHeader title={texts.localeSpecific.tableTitle} />}
        rowComponent={
          <PairSelector
            mappings={mappings}
            leftOptions={leftOptions}
            middleOptions={middleOptions}
            rightOptions={rightOptions}
            onLeftSelect={onLeftSelect}
            onMiddleSelect={onMiddleSelect}
            onRightSelect={onRightSelect}
            onDelete={onDelete}
            config={{
              leftPlaceholder: texts.localeSpecific.leftPlaceholder,
              middlePlaceholder: texts.localeSpecific.middlePlaceholder,
              rightPlaceholder: texts.localeSpecific.rightPlaceholder,
              noOptionsMessage: texts.common.noOptionsMessage,
              deleteTooltip: texts.common.deleteTooltip,
              separator: texts.common.separator,
              containerClass: "custom-pair-container",
              selectWidth: "180px",
              separatorClass: "custom-separator",
              iconClass: "custom-delete-icon",
              showTooltip: true,
              showDeleteIcon: true,
              isRightDisabled: false,
              isSearchable: true,
              multiDisplayLimit: 10,
              isMultiLeft: false, // branch
              isMultiMiddle: true, // locale
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
              {texts.localeSpecific.addMoreBtn}
            </Button>
          </div>
        }
      />
    </div>
  );
}

export default LocaleSpecificConfig;
