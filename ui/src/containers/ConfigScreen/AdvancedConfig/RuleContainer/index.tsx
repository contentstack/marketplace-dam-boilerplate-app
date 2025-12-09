import React, { useMemo } from "react";
import { Icon, Select, Tooltip } from "@contentstack/venus-components";
import {
  RuleContainerMapping,
  RuleContainerProps,
} from "../../../../common/types/index";
import constants from "../../../../common/constants";
import localeTexts from "../../../../common/locale/en-us";
import "./styles.scss";

const customSelectStyles = {
  menuPortal: (base: any) => ({ ...base, zIndex: 99999 }),
  singleValue: (base: any) => ({
    ...base,
    maxWidth: "100%",
    ...constants.textOverflowStyles,
  }),
  multiValue: (base: any) => ({
    ...base,
    maxWidth: "100%",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    maxWidth: "100%",
    ...constants.textOverflowStyles,
  }),
  option: (base: any) => ({
    ...base,
    ...constants.textOverflowStyles,
  }),
};

// Small helpers to make intent clear without changing structure
function isBranchLevel(locales: string | string[] | null | undefined): boolean {
  return Array.isArray(locales) ? !locales?.length : !locales;
}

function sameBranch(
  current: string | string[] | null,
  other?: string
): boolean {
  if (!current || !other) return false;
  return Array.isArray(current) ? current.includes(other) : current === other;
}

function hasBranchLevelRule(
  mappings: RuleContainerMapping[],
  branch: string | string[] | null,
  skipIndex: number
): boolean {
  if (!branch) return false;
  return mappings?.some((m, i) => {
    if (i === skipIndex) return false;
    const otherBranch = m?.left ?? m?.branch_uid;
    const otherLocales = m?.locales_uid ?? m?.middle;
    return sameBranch(branch, otherBranch) && isBranchLevel(otherLocales);
  });
}

function isConfigUsedAtBranchLevel(
  mappings: RuleContainerMapping[],
  branch: string | string[] | null,
  configValue: string,
  skipIndex: number
): boolean {
  if (!branch || !configValue) return false;
  return mappings?.some((m, i) => {
    if (i === skipIndex) return false;
    const otherBranch = m?.left ?? m?.branch_uid;
    const otherLocales = m?.locales_uid ?? m?.middle;
    const otherConfig = m?.config_label ?? m?.right;
    return (
      sameBranch(branch, otherBranch) &&
      otherConfig === configValue &&
      isBranchLevel(otherLocales)
    );
  });
}

function RuleContainer({
  mappings,
  branchOptions,
  configOptions,
  getLocaleOptionsForBranch,
  validConfigs,
  onBranchSelect,
  onConfigSelect,
  onLocaleSelect,
  onDelete,
  config = {},
}: RuleContainerProps) {
  const {
    branchPlaceholder = constants.ruleContainerDefaults.branchPlaceholder,
    configPlaceholder = constants.ruleContainerDefaults.configPlaceholder,
    localePlaceholder = constants.ruleContainerDefaults.localePlaceholder,
    noOptionsMessage = constants.ruleContainerDefaults.noOptionsMessage,
    deleteTooltip = constants.ruleContainerDefaults.deleteTooltip,
    separator = constants.ruleContainerDefaults.separator,
    containerClass = constants.ruleContainerDefaults.containerClass,
    selectWidth = constants.ruleContainerDefaults.selectWidth,
    separatorClass = constants.ruleContainerDefaults.separatorClass,
    iconClass = constants.ruleContainerDefaults.iconClass,
    showTooltip = constants.ruleContainerDefaults.showTooltip,
    showDeleteIcon = constants.ruleContainerDefaults.showDeleteIcon,
    isLocaleDisabled = constants.ruleContainerDefaults.isLocaleDisabled,
    isSearchable = constants.ruleContainerDefaults.isSearchable,
    multiDisplayLimit = constants.ruleContainerDefaults.multiDisplayLimit,
    isMultiBranch = constants.ruleContainerDefaults.isMultiBranch,
    isMultiConfig = constants.ruleContainerDefaults.isMultiConfig,
    isMultiLocale = constants.ruleContainerDefaults.isMultiLocale,
    isBranchExhaustive = constants.ruleContainerDefaults.isBranchExhaustive,
    isConfigExhaustive = constants.ruleContainerDefaults.isConfigExhaustive,
    isLocaleExhaustive = constants.ruleContainerDefaults.isLocaleExhaustive,
  } = config;

  const selectedValues = useMemo(() => {
    const selectedBranchValues: string[] = [];
    const selectedConfigValues: string[] = [];
    const selectedLocaleValues: string[] = [];

    mappings?.forEach((mapping) => {
      const branchValue =
        mapping?.left ??
        mapping?.branch_uid ??
        mapping?.leftValue ??
        mapping?.branch_uid_multi;
      const localeValue = mapping?.middle ?? mapping?.locales_uid;
      const configValue =
        mapping?.right ?? mapping?.config_label ?? mapping?.rightValue;

      if (isMultiBranch) {
        if (Array.isArray(branchValue))
          selectedBranchValues?.push(...branchValue);
      } else if (branchValue) selectedBranchValues?.push(branchValue);

      if (isMultiConfig) {
        if (Array.isArray(configValue))
          selectedConfigValues?.push(...configValue);
      } else if (configValue) {
        selectedConfigValues?.push(configValue);
      }

      if (localeValue) {
        if (Array.isArray(localeValue))
          selectedLocaleValues?.push(...localeValue);
        else selectedLocaleValues?.push(localeValue);
      }
    });

    return {
      selectedBranchValues,
      selectedConfigValues,
      selectedLocaleValues,
    };
  }, [mappings, isMultiBranch, isMultiConfig]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { selectedBranchValues, selectedConfigValues, selectedLocaleValues } =
    selectedValues;

  const renderRow = (mapping: RuleContainerMapping, index: number) => {
    const branchValue = mapping?.left ?? mapping?.branch_uid ?? null;

    // Get branch-specific locale options
    const branchLocaleOptions = branchValue && getLocaleOptionsForBranch
      ? getLocaleOptionsForBranch(
        Array.isArray(branchValue) ? branchValue[0] : branchValue
      )
      : [];
    const configValue = mapping?.right ?? mapping?.config_label ?? null;
    const localeValues = mapping?.middle ?? mapping?.locales_uid ?? null;

    const branchSelectValue = isMultiBranch
      ? branchOptions.filter(
        (opt) =>
          Array.isArray(branchValue) && branchValue?.includes(opt?.value)
      )
      : branchOptions?.find((opt) => opt?.value === branchValue) ?? null;

    const configSelectValue = isMultiConfig
      ? configOptions?.filter(
        (opt) =>
          Array.isArray(configValue) && configValue?.includes(opt?.value)
      )
      : configOptions?.find((opt) => opt?.value === configValue) ?? null;

    const localeSelectValue = isMultiLocale
      ? branchLocaleOptions?.filter(
        (opt) =>
          Array.isArray(localeValues) && localeValues?.includes(opt?.value)
      )
      : branchLocaleOptions?.find((opt) => opt?.value === localeValues) ?? null;

    // Determine if this row's config is invalid (deleted or missing from available configs)
    let rowConfig: string | undefined;
    if (typeof configValue === "string") {
      rowConfig = configValue;
    } else if (Array.isArray(configValue)) {
      const [first] = configValue;
      rowConfig = first;
    }
    const isInvalidConfig =
      Boolean(rowConfig) &&
      validConfigs instanceof Set &&
      !validConfigs.has(rowConfig as string);

    let disabledLocales: any[] = [];
    if (branchValue) {
      // Normalize possible array of branches
      const branches = Array.isArray(branchValue) ? branchValue : [branchValue];
      branches?.forEach((branch) => {
        mappings?.forEach((otherMapping, otherIndex) => {
          if (otherIndex !== index) {
            const otherBranches =
              otherMapping?.left ?? otherMapping?.branch_uid;
            if (
              (typeof otherBranches === "string" && otherBranches === branch) ||
              (Array.isArray(otherBranches) && otherBranches?.includes(branch))
            ) {
              const otherLocales =
                otherMapping?.locales_uid ?? otherMapping?.middle;
              if (Array.isArray(otherLocales))
                disabledLocales?.push(...otherLocales);
              else if (otherLocales) disabledLocales?.push(otherLocales);
            }
          }
        });
      });
    }

    // Remove current row's selected values so they're not disabled
    if (isMultiLocale && Array.isArray(localeValues)) {
      disabledLocales = disabledLocales?.filter(
        (v) => !localeValues?.includes(v)
      );
    } else if (localeValues) {
      disabledLocales = disabledLocales?.filter((v) => v !== localeValues);
    }
    const disabledLocalesSet = new Set(disabledLocales);

    // Locale filtering - use branch-specific locales
    const filteredLocaleOptions = isLocaleExhaustive
      ? branchLocaleOptions?.filter((opt) => {
        // Always allow currently selected locales for this row
        if (Array.isArray(localeValues) && localeValues.includes(opt.value)) {
          return true;
        }

        // Check if this locale is already used for the same branch
        const isLocaleUsedForSameBranch = mappings?.some(
          (otherMapping, otherIndex) => {
            if (otherIndex === index) return false; // Skip current row

            const otherBranch =
              otherMapping?.left ?? otherMapping?.branch_uid;
            const otherLocales =
              otherMapping?.locales_uid ?? otherMapping?.middle;

            const isSameBranch = Array.isArray(branchValue)
              ? branchValue.includes(otherBranch)
              : branchValue === otherBranch;

            if (!isSameBranch) return false;

            // Check if this locale is in the other mapping's locales
            if (Array.isArray(otherLocales)) {
              return otherLocales.includes(opt.value);
            }
            return otherLocales === opt.value;
          }
        );

        return !isLocaleUsedForSameBranch;
      })
      : branchLocaleOptions?.filter((opt) => !disabledLocalesSet?.has(opt?.value));

    const filteredBranchOptions = isBranchExhaustive
      ? branchOptions.filter(
        (opt) =>
          !selectedBranchValues?.includes(opt?.value) ||
          (isMultiBranch &&
            Array.isArray(branchValue) &&
            branchValue?.includes(opt?.value)) ||
          (!isMultiBranch && opt?.value === branchValue)
      )
      : branchOptions;

    // Config filtering
    const filteredConfigOptions = isConfigExhaustive
      ? configOptions?.filter((opt) => {
        // Always allow the currently selected config for this row
        if (opt?.value === configValue) return true;

        // Check if user is trying to create a branch-level rule (no locales selected)
        const isCurrentBranchLevel = isBranchLevel(localeValues);

        // Prevent multiple branch-level rules for same branch
        if (
          isCurrentBranchLevel &&
          branchValue &&
          hasBranchLevelRule(mappings, branchValue, index)
        ) {
          return false;
        }

        // Check if this config is already used at branch level for the same branch
        const isConfigUsedAtBranchLevelFlag = isConfigUsedAtBranchLevel(
          mappings,
          branchValue,
          opt?.value,
          index
        );

        // If config is used at branch level, don't allow it for ANY other rules on same branch
        if (isConfigUsedAtBranchLevelFlag) {
          return false; // Block the config completely for this branch
        }

        // Check if this would create a duplicate branch-level config
        const isDuplicateBranchLevelConfig = mappings?.some(
          (otherMapping, otherIndex) => {
            if (otherIndex === index) return false; // Skip current row

            const otherBranch =
              otherMapping?.left ?? otherMapping?.branch_uid;
            const otherLocales =
              otherMapping?.locales_uid ?? otherMapping?.middle;
            const otherConfig =
              otherMapping?.config_label ?? otherMapping?.right;

            const isSameBranch = sameBranch(branchValue, otherBranch);
            const isSameConfig = otherConfig === opt?.value;
            const isOtherBranchLevel = isBranchLevel(otherLocales);

            // Block if same branch, same config, and both are branch-level
            return (
              isSameBranch &&
              isSameConfig &&
              isCurrentBranchLevel &&
              isOtherBranchLevel
            );
          }
        );

        if (isDuplicateBranchLevelConfig) {
          return false; // Block duplicate branch-level configs (same config)
        }

        // Only block config if it's already used for the same branch
        const isConfigUsedForSameBranch = mappings?.some(
          (otherMapping, otherIndex) => {
            if (otherIndex === index) return false; // Skip current row

            const otherBranch =
              otherMapping?.left ?? otherMapping?.branch_uid;
            const otherConfig =
              otherMapping?.config_label ?? otherMapping?.right;

            const isSame = sameBranch(branchValue, otherBranch);
            return isSame && otherConfig === opt?.value;
          }
        );

        return !isConfigUsedForSameBranch;
      })
      : configOptions;

    return (
      <div
        key={`pair-${index}`}
        className={containerClass}
        style={{ "--select-width": selectWidth } as React.CSSProperties}
      >
        <div className="select-wrapper">
          <Select
            value={branchSelectValue}
            onChange={(option: any) => onBranchSelect(option, index)}
            options={filteredBranchOptions}
            placeholder={branchPlaceholder}
            isSearchable={isSearchable}
            menuShouldScrollIntoView={false}
            multiDisplayLimit={multiDisplayLimit}
            width={selectWidth}
            version="v2"
            isMulti={isMultiBranch}
            noOptionsMessage={() => noOptionsMessage}
            menuPortalTarget={document.body}
            styles={customSelectStyles}
          />
        </div>

        <span className={separatorClass}>{separator}</span>

        <div className="select-wrapper">
          <Select
            value={configSelectValue}
            onChange={(option: any) => onConfigSelect!(option, index)}
            options={filteredConfigOptions}
            placeholder={configPlaceholder}
            width={selectWidth}
            version="v2"
            isSearchable={isSearchable}
            isDisabled={isLocaleDisabled}
            menuShouldScrollIntoView={false}
            multiDisplayLimit={multiDisplayLimit}
            noOptionsMessage={() => noOptionsMessage}
            menuPortalTarget={document.body}
            styles={customSelectStyles}
          />
        </div>

        {onLocaleSelect && (
          <>
            <span className={separatorClass}>{separator}</span>
            <div className="select-wrapper middle-select-wrapper">
              <Select
                value={localeSelectValue}
                onChange={(option: any) => onLocaleSelect!(option, index)}
                options={filteredLocaleOptions ?? []}
                placeholder={localePlaceholder}
                isSearchable={isSearchable}
                menuShouldScrollIntoView={false}
                multiDisplayLimit={multiDisplayLimit}
                width={selectWidth}
                isMulti={isMultiLocale}
                version="v2"
                isSelectAll={filteredLocaleOptions?.length > 0}
                noOptionsMessage={() => noOptionsMessage}
                menuPortalTarget={document.body}
                isDisabled={
                  !branchValue || !branchLocaleOptions || branchLocaleOptions?.length === 0
                }
              />
            </div>
          </>
        )}

        {showDeleteIcon && (
          <div className="action-icons">
            {showTooltip ? (
              <Tooltip content={deleteTooltip} position="top" showArrow={false}>
                <Icon
                  icon="Trash"
                  size="mini"
                  className={iconClass}
                  onClick={() => onDelete(index)}
                  hover
                  hoverType="secondary"
                  shadow="medium"
                />
              </Tooltip>
            ) : (
              <Icon
                icon="Trash"
                size="mini"
                className={iconClass}
                onClick={() => onDelete(index)}
                hover
                hoverType="secondary"
                shadow="medium"
              />
            )}
            {isInvalidConfig ? (
              <Tooltip
                content={localeTexts?.ConfigFields?.AdvancedConfig?.common?.invalidConfigTooltip}
                position="top"
                showArrow={false}
              >
                <Icon
                  icon="WarningBold"
                  size="small"
                  version="v2"
                  className="warning-icon"
                />
              </Tooltip>
            ) : (
              <div className="warning-icon-placeholder" />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rule-container">
      <div className="rule-header">
        <div className="header-cell">
          {localeTexts?.ConfigFields?.AdvancedConfig?.common?.branchHeader}
        </div>
        <div className="header-cell">
          {localeTexts?.ConfigFields?.AdvancedConfig?.common?.configHeader}
        </div>
        {onLocaleSelect && (
          <div className="header-cell">
            {localeTexts?.ConfigFields?.AdvancedConfig?.common?.localeHeader}
          </div>
        )}
        {showDeleteIcon && <div className="header-cell delete-header" />}
      </div>

      {mappings?.map(renderRow)}
    </div>
  );
}

RuleContainer.defaultProps = {
  getLocaleOptionsForBranch: undefined,
  validConfigs: undefined,
  onLocaleSelect: undefined,
  config: {},
};

export default React.memo(RuleContainer);
