import React from "react";
import { Field, Button } from "@contentstack/venus-components";
import RuleContainer from "../RuleContainer";
import localeTexts from "../../../../common/locale/en-us";
import InfoMessage from "../../../../components/InfoMessage";

function ConfigRules({
  mappings,
  branchOptions,
  configOptions,
  getLocaleOptionsForBranch,
  validConfigs,
  onAddMapping,
  onBranchSelect,
  onConfigSelect,
  onLocaleSelect,
  onDelete,
}: any) {
  const texts = localeTexts?.ConfigFields?.AdvancedConfig;

  if (!texts || !texts?.unified || !texts?.common) {
    return null;
  }

  const safeBranchOptions = Array.isArray(branchOptions) ? branchOptions : [];
  const safeConfigOptions = Array.isArray(configOptions) ? configOptions : [];
  const safeMappings = Array.isArray(mappings) ? mappings : [];

  return (
    <div>
      <Field
        className="config-rules-field"
        labelText="Config Rules"
      />
      <div className="config-rules-info">
        <InfoMessage
          content={texts?.unified?.infoMessage ?? ""}
        />
      </div>
      <div className="config-mapping-section">
        <RuleContainer
          mappings={safeMappings}
          branchOptions={safeBranchOptions}
          configOptions={safeConfigOptions}
          getLocaleOptionsForBranch={getLocaleOptionsForBranch}
          validConfigs={validConfigs}
          onBranchSelect={onBranchSelect}
          onConfigSelect={onConfigSelect}
          onLocaleSelect={onLocaleSelect}
          onDelete={onDelete}
          config={{
            branchPlaceholder:
              texts?.unified?.leftPlaceholder,
            configPlaceholder:
              texts?.unified?.rightPlaceholder,
            localePlaceholder:
              texts?.unified?.middlePlaceholder,
            noOptionsMessage: texts?.common?.noOptionsMessage,
            deleteTooltip: texts?.common?.deleteTooltip,
            separator: texts?.common?.separator,
            containerClass: "custom-rule-container-row",
            selectWidth: "180px",
            separatorClass: "custom-separator",
            iconClass: "custom-delete-icon",
            showTooltip: true,
            showDeleteIcon: true,
            isLocaleDisabled: false,
            isSearchable: true,
            multiDisplayLimit: 1,
            isMultiBranch: false,
            isMultiConfig: false,
            isMultiLocale: true,
            isBranchExhaustive: false,
            isConfigExhaustive: true,
            isLocaleExhaustive: true,
            maxCharacters: 15,
          }}
        />

        <div className="add-more-btn">
          <Button
            buttonType="tertiary-outline"
            version="v2"
            onClick={onAddMapping}
            icon="Plus"
            iconAlignment="left"
          >
            {texts?.unified?.addMoreBtn}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfigRules;
