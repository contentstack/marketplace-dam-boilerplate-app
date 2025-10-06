import React, { useCallback, useEffect } from "react";
import UnifiedConfigMapping from "./UnifiedConfigMapping";
import useUnifiedConfigMappings from "../../../common/hooks/useUnifiedConfigMappings";
import { MarketplaceAppContext } from "../../../common/contexts/MarketplaceAppContext";
import AppConfigContext from "../../../common/contexts/AppConfigContext";

function AdvancedConfig({ branches, configList, setConfigRulesMapper }: any) {
  const { installationData, appConfig } = React.useContext(AppConfigContext);

  const { locales } = React.useContext(MarketplaceAppContext);

  const defaultKey =
    installationData?.configuration?.default_multi_config_key || "config-1";

  /**
   * Extract unified mappings from config_rules
   * Handles both branch-only and branch+locale mappings
   * Groups locales with same branch+config into single row
   */
  const extractUnifiedMappings = useCallback(() => {
    const unifiedRules: any[] = [];
    const localeGroupMap: Map<string, Set<string>> = new Map(); // key: "branch|config", value: Set of locales

    const configRules = installationData?.configuration?.config_rules;
    if (!configRules || typeof configRules !== 'object') {
      return [];
    }

    Object.entries(configRules)?.forEach(([branchUid, branchObj]: any) => {
      if (!branchUid || !branchObj) return;

      const configLabel =
        Array.isArray(branchObj?.config_label) && branchObj?.config_label?.length
          ? branchObj.config_label[0]
          : defaultKey;

      // Branch-specific mappings (applies to ALL locales)
      if (branchUid && configLabel) {
        unifiedRules.push({
          branch_uid: branchUid,
          locales_uid: [],
          config_label: configLabel,
        });
      }

      // Locale-specific mappings - GROUP by branch+config
      if (branchObj?.locales && typeof branchObj.locales === 'object') {
        Object.entries(branchObj.locales)?.forEach(
          ([locale, localeObj]: any) => {
            if (!locale || !localeObj) return;

            const localeConfigLabel =
              Array.isArray(localeObj?.config_label) &&
                localeObj?.config_label?.length
                ? localeObj.config_label[0]
                : defaultKey;

            if (branchUid && locale && localeConfigLabel) {
              // Create unique key for branch+config combination
              const groupKey = `${branchUid}|${localeConfigLabel}`;

              if (!localeGroupMap.has(groupKey)) {
                localeGroupMap.set(groupKey, new Set());
              }
              localeGroupMap.get(groupKey)?.add(locale);
            }
          }
        );
      }
    });

    // Convert grouped locales into unified rules
    localeGroupMap.forEach((localeSet, groupKey) => {
      const [branchUid, configLabel] = groupKey.split('|');
      if (branchUid && configLabel && localeSet.size > 0) {
        unifiedRules.push({
          branch_uid: branchUid,
          locales_uid: Array.from(localeSet),
          config_label: configLabel,
        });
      }
    });

    return unifiedRules || [];
  }, [installationData?.configuration, defaultKey]);

  const extractedUnifiedRules = extractUnifiedMappings();

  const {
    mappings: unifiedMappings,
    addMapping: addUnifiedMapping,
    onLeftSelect: onBranchSelect,
    onMiddleSelect: onLocalesSelect,
    onRightSelect: onConfigSelect,
    onDelete: onMappingDelete,
  } = useUnifiedConfigMappings(extractedUnifiedRules);


  const rightBranchSpecificOptions = React.useMemo(() => {
    if (!Array.isArray(configList)) return [];
    return configList.map((configKey: string) => ({
      label: configKey,
      value: configKey,
    }));
  }, [configList]);

  const leftBranchSpecificOptions = React.useMemo(() => {
    if (!Array.isArray(branches) || !branches?.length) return [];
    return branches
      .filter((b: any) => b?.uid)
      .map((b: any) => ({
        label: b.uid,
        value: b.uid,
      }));
  }, [branches]);

  const middleLocaleOptions = React.useMemo(() => {
    if (!Array.isArray(locales) || !locales?.length) return [];
    return locales
      .filter((l: any) => l?.name && l?.code)
      .map((l: any) => ({
        label: l.name,
        value: l.code,
      }));
  }, [locales]);

  interface UnifiedRule {
    branch_uid: string | string[];
    locales_uid: string[];
    config_label: string | string[];
  }

  interface ConfigRule {
    config_label: string[];
    locales?: {
      [localeCode: string]: {
        config_label: string[];
      };
    };
  }

  interface ConfigRules {
    [branchId: string]: ConfigRule;
  }

  /**
   * Build config mapper from unified rules
   * Rules with empty locales_uid apply to ALL locales (branch-level)
   * Rules with specific locales_uid apply only to those locales
   */
  function buildUnifiedMapper(unifiedRulesParam: UnifiedRule[]): ConfigRules {
    const result: ConfigRules = {};

    if (!Array.isArray(unifiedRulesParam) || !unifiedRulesParam?.length) {
      return result;
    }

    unifiedRulesParam?.forEach((rule: UnifiedRule) => {
      if (!rule) return;

      const branchUids = Array.isArray(rule?.branch_uid)
        ? rule.branch_uid
        : [rule?.branch_uid];

      if (!branchUids || !branchUids?.length) return;

      branchUids?.forEach((branch: string) => {
        if (!branch) return;

        if (!result[branch]) {
          result[branch] = { config_label: [] };
        }

        const configLabels = Array.isArray(rule?.config_label)
          ? rule.config_label
          : [rule?.config_label];

        if (!configLabels || !configLabels?.length) return;

        // If locales_uid is empty or not specified, it's a branch-level rule
        if (!rule?.locales_uid || rule.locales_uid?.length === 0) {
          const cfgArr = result[branch]?.config_label;
          if (cfgArr) {
            configLabels?.forEach((cl: string) => {
              if (cl && !cfgArr.includes(cl)) {
                cfgArr.push(cl);
              }
            });
          }
        } else {
          // Locale-specific rule
          if (!result[branch].locales) {
            result[branch].locales = {};
          }

          rule.locales_uid?.forEach((locale: string) => {
            if (!locale) return;

            if (!result[branch]?.locales![locale]) {
              result[branch].locales![locale] = { config_label: [] };
            }
            const localeCfgArr = result[branch]?.locales![locale]?.config_label;
            if (localeCfgArr) {
              configLabels?.forEach((cl: string) => {
                if (cl && !localeCfgArr.includes(cl)) {
                  localeCfgArr.push(cl);
                }
              });
            }
          });
        }
      });
    });

    return result;
  }

  useEffect(() => {
    console.info("$$$ AdvancedConfig : appConfig:", appConfig);
  }, [appConfig]);

  useEffect(() => {
    if (!unifiedMappings || !Array.isArray(unifiedMappings)) {
      setConfigRulesMapper?.({});
      return;
    }
    const newConfigRules = buildUnifiedMapper(unifiedMappings);
    setConfigRulesMapper?.(newConfigRules);
  }, [unifiedMappings, setConfigRulesMapper]);

  return (
    <UnifiedConfigMapping
      mappings={unifiedMappings}
      leftOptions={leftBranchSpecificOptions}
      middleOptions={middleLocaleOptions}
      rightOptions={rightBranchSpecificOptions}
      onLeftSelect={onBranchSelect}
      onMiddleSelect={onLocalesSelect}
      onRightSelect={onConfigSelect}
      onDelete={onMappingDelete}
      onAddMapping={addUnifiedMapping}
    />
  );
}

export default AdvancedConfig;
