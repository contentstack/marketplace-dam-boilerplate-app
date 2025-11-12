import {
  Field,
  Button,
} from "@contentstack/venus-components";
import React from "react";
import RuleContainer from "../RuleContainer";
import localeTexts from "../../../../common/locale/en-us";


function ConfigRules({
  mappings,
  branchOptions,
  configOptions,
  localeOptions,
  validConfigs,
  onAddMapping,
  onBranchSelect,
  onConfigSelect,
  onLocaleSelect,
  onDelete = () => {
    console.warn("handleDelete function not implemented");
  },
}: any) {
  const texts = localeTexts?.ConfigFields?.AdvancedConfig;

  if (!texts || !texts?.unified || !texts?.common) {
    return null;
  }

  const safeBranchOptions = Array.isArray(branchOptions) ? branchOptions : [];
  const safeConfigOptions = Array.isArray(configOptions) ? configOptions : [];
  const safeLocaleOptions = Array.isArray(localeOptions) ? localeOptions : [];
  const safeMappings = Array.isArray(mappings) ? mappings : [];

  return (
    <div>
      <Field
        className="config-rules-field"
        labelText="Config Rules"
        helpText="• Branch-Level Rules: Select at least one branch and one config. This applies to all locales for that branch.\n• Locale-Level Rules: Select at least one branch, one locale, and one config for specific locale targeting.\n• Important: Branch selection is always required. You cannot select locales without selecting a branch first."
      />

      <div className="config-mapping-section">
        <RuleContainer
          mappings={safeMappings}
          branchOptions={safeBranchOptions}
          configOptions={safeConfigOptions}
          localeOptions={safeLocaleOptions}
          validConfigs={validConfigs}
          onBranchSelect={onBranchSelect}
          onConfigSelect={onConfigSelect}
          onLocaleSelect={onLocaleSelect}
          onDelete={onDelete}
          config={{
            branchPlaceholder: texts?.unified?.leftPlaceholder ?? "Select Branch",
            configPlaceholder: texts?.unified?.rightPlaceholder ?? "Select Config",
            localePlaceholder: texts?.unified?.middlePlaceholder ?? "Select Locale (Optional)",
            noOptionsMessage: texts?.common?.noOptionsMessage ?? "No options",
            deleteTooltip: texts?.common?.deleteTooltip ?? "Remove mapping",
            separator: texts?.common?.separator ?? "-",
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
            {texts?.unified?.addMoreBtn ?? "add more"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfigRules;
