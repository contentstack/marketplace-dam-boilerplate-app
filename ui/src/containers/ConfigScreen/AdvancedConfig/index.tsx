import React, { useCallback, useEffect } from "react";
import ConfigRules from "./ConfigRules";
import useConfigRulesMapping from "../../../common/hooks/useConfigRulesMapping";
import { MarketplaceAppContext } from "../../../common/contexts/MarketplaceAppContext";
import AppConfigContext from "../../../common/contexts/AppConfigContext";
import {
  UnifiedRule,
  ConfigRules as ConfigRulesType,
} from "../../../common/types";

function AdvancedConfig({
  branches,
  configList,
  setConfigRulesMapper,
  setHasIncomplete,
}: any) {
  const { installationData } = React.useContext(AppConfigContext);

  const {
    fetchLocalesForBranch,
    getLocalesForBranch,
    appSdk,
    isBranchLoading,
  } = React.useContext(MarketplaceAppContext);

  const defaultKey =
    installationData?.configuration?.default_multi_config_key;

  const extractUnifiedMappings = useCallback(() => {
    const unifiedRules: any[] = [];
    const localeGroupMap: Map<string, Set<string>> = new Map(); // key: "branch|config", value: Set of locales

    const configRules = installationData?.configuration?.config_rules;
    if (!configRules || typeof configRules !== "object") {
      return [];
    }

    Object.entries(configRules)?.forEach(([branchUid, branchObj]: any) => {
      if (!branchUid || !branchObj || typeof branchObj !== "object") return;

      const branchConfigLabel =
        Array.isArray(branchObj?.config_label) &&
          branchObj?.config_label?.length
          ? branchObj.config_label[0]
          : null;

      // Skip if branch has no valid config_label and no locales
      const hasLocales =
        branchObj?.locales &&
        typeof branchObj?.locales === "object" &&
        Object.keys(branchObj?.locales)?.length > 0;
      if (!branchConfigLabel && !hasLocales) {
        return;
      }

      // Collect all config labels from locale-specific mappings
      const localeConfigLabels = new Set<string>();

      // Locale-specific mappings - GROUP by branch+config
      if (branchObj?.locales && typeof branchObj?.locales === "object") {
        Object.entries(branchObj?.locales)?.forEach(
          ([locale, localeObj]: any) => {
            if (!locale || !localeObj) return;

            const localeConfigLabel =
              Array.isArray(localeObj?.config_label) &&
                localeObj?.config_label?.length
                ? localeObj?.config_label?.[0]
                : null;

            // Only process if we have a valid locale config label
            if (branchUid && locale && localeConfigLabel) {
              // Track which configs are used in locale-specific mappings
              localeConfigLabels.add(localeConfigLabel);

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

      // Branch-specific mappings (applies to ALL locales)
      // Only add branch-level rule if:
      // 1. There's actually a valid config_label at branch level
      // 2. This config is NOT used in any locale-specific mapping
      if (
        branchUid &&
        branchConfigLabel &&
        !localeConfigLabels.has(branchConfigLabel)
      ) {
        unifiedRules.push({
          branch_uid: branchUid,
          locales_uid: [],
          config_label: branchConfigLabel,
        });
      }
    });

    // Convert grouped locales into unified rules
    localeGroupMap.forEach((localeSet, groupKey) => {
      const [branchUid, configLabel] = groupKey?.split("|");
      if (branchUid && configLabel && localeSet?.size > 0) {
        unifiedRules.push({
          branch_uid: branchUid,
          locales_uid: Array.from(localeSet),
          config_label: configLabel,
        });
      }
    });

    return unifiedRules ?? [];
  }, [installationData?.configuration, defaultKey]);

  const extractedUnifiedRules = React.useMemo(
    () => extractUnifiedMappings(),
    [installationData?.configuration, defaultKey]
  );

  const {
    mappings: unifiedMappings,
    addMapping: addUnifiedMapping,
    onLeftSelect: onBranchSelectOriginal,
    onMiddleSelect: onLocalesSelect,
    onRightSelect: onConfigSelect,
    onDelete: onMappingDelete,
  } = useConfigRulesMapping(extractedUnifiedRules);

  // Wrap onBranchSelect to fetch locales when branch is selected
  const onBranchSelect = useCallback(
    async (selected: any, index: number) => {
      // Update the mapping state first
      onBranchSelectOriginal(selected, index);

      // Fetch locales for the selected branch
      if (selected?.value) {
        await fetchLocalesForBranch(selected.value);
      }
    },
    [onBranchSelectOriginal, fetchLocalesForBranch]
  );
  // Build a memoized set of valid configs to flag deleted/invalid configs in rows
  const validConfigsSet = React.useMemo(() => {
    const set = new Set<string>();
    if (Array.isArray(configList)) {
      configList?.forEach((c) => c && set.add(c));
    }
    return set;
  }, [configList]);

  const rightBranchSpecificOptions = React.useMemo(() => {
    if (!Array.isArray(configList)) return [];
    return configList?.map((configKey: string) => ({
      label: configKey,
      value: configKey,
    }));
  }, [configList]);

  const leftBranchSpecificOptions = React.useMemo(() => {
    if (!Array.isArray(branches) || !branches?.length) return [];
    return branches
      ?.filter((b: any) => b?.uid)
      ?.map((b: any) => ({
        label: b?.uid,
        value: b?.uid,
      }));
  }, [branches]);

  // Get locale options for a specific branch
  const getLocaleOptionsForBranch = React.useCallback(
    (branch: string) => {
      const branchLocales = getLocalesForBranch(branch);
      if (!Array.isArray(branchLocales) || !branchLocales?.length) return [];
      return branchLocales
        ?.filter((l: any) => l?.name && l?.code)
        ?.map((l: any) => ({
          label: l?.name,
          value: l?.code,
        }));
    },
    [getLocalesForBranch]
  );


  /**
   * Build config mapper from unified rules
   * Rules with empty locales_uid apply to ALL locales (branch-level)
   * Rules with specific locales_uid apply only to those locales
   */
  function buildUnifiedMapper(
    unifiedRulesParam: UnifiedRule[]
  ): ConfigRulesType {
    const result: ConfigRulesType = {};

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
        if (!rule?.locales_uid || !rule?.locales_uid?.length) {
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
          if (!result?.[branch]?.locales) {
            result[branch].locales = {};
          }

          rule?.locales_uid?.forEach((locale: string) => {
            if (!locale) return;

            if (!result?.[branch]?.locales?.[locale]) {
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

  const prevConfigRulesRef = React.useRef<any>(null);
  const fetchedBranchesRef = React.useRef<Set<string>>(new Set());

  // Fetch locales for all existing branches on initial load
  useEffect(() => {
    if (!appSdk || !extractedUnifiedRules?.length) return;

    // Extract unique branches from existing rules
    const uniqueBranches = new Set<string>();
    extractedUnifiedRules.forEach((rule) => {
      if (rule?.branch_uid) {
        if (Array.isArray(rule.branch_uid)) {
          rule.branch_uid.forEach((branch: string) => {
            if (branch) uniqueBranches.add(branch);
          });
        } else {
          uniqueBranches.add(rule.branch_uid);
        }
      }
    });

    // Filter out branches we've already fetched
    const branchesToFetch = Array.from(uniqueBranches).filter(
      (branch) => !fetchedBranchesRef.current.has(branch)
    );

    // Fetch locales for all unique branches in parallel (only new ones)
    if (branchesToFetch.length > 0) {
      // Mark branches as fetched
      branchesToFetch.forEach((branch) => fetchedBranchesRef.current.add(branch));

      console.info(
        `!!!🚀 Fetching locales for ${branchesToFetch.length} branches on initial load:`,
        branchesToFetch
      );
      Promise.all(
        branchesToFetch.map((branch: string) => fetchLocalesForBranch(branch))
      ).catch((error) => {
        console.error("Error fetching locales on initial load:", error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractedUnifiedRules, appSdk]);

  useEffect(() => {
    const hasIncomplete =
      Array.isArray(unifiedMappings) &&
      unifiedMappings.some((m: any) => {
        const branch = m?.branch_uid;
        const cfgRaw = m?.config_label;
        const cfg = Array.isArray(cfgRaw) ? cfgRaw[0] : cfgRaw;
        const selectedLocales = m?.locales_uid;
        const hasBranch = !!branch;
        const hasConfig = !!cfg;
        const hasValidConfig = !!cfg && validConfigsSet.has(cfg);
        const hasLocales = Array.isArray(selectedLocales)
          ? selectedLocales.length > 0
          : !!selectedLocales;

        // Valid only when branch + valid config are present.
        // If locales are selected, branch must also be present
        const isValid =
          hasBranch && hasValidConfig && (!hasLocales || hasBranch);

        // Empty new row OR any partial selection
        return (
          !isValid &&
          (hasBranch ||
            hasConfig ||
            hasLocales ||
            (!hasBranch && !hasConfig && !hasLocales))
        );
      });
    setHasIncomplete?.(Boolean(hasIncomplete));

    if (!unifiedMappings || !Array.isArray(unifiedMappings)) {
      const emptyConfig = {};
      if (
        JSON.stringify(prevConfigRulesRef.current) !==
        JSON.stringify(emptyConfig)
      ) {
        prevConfigRulesRef.current = emptyConfig;
        setConfigRulesMapper?.(emptyConfig);
      }
      return;
    }

    const newConfigRules = buildUnifiedMapper(unifiedMappings);
    // Only update if the config rules actually changed
    if (
      JSON.stringify(prevConfigRulesRef.current) !==
      JSON.stringify(newConfigRules)
    ) {
      prevConfigRulesRef.current = newConfigRules;
      setConfigRulesMapper?.(newConfigRules);
    }
  }, [unifiedMappings, validConfigsSet]);

  return (
    <ConfigRules
      mappings={unifiedMappings}
      branchOptions={leftBranchSpecificOptions}
      configOptions={rightBranchSpecificOptions}
      getLocaleOptionsForBranch={getLocaleOptionsForBranch}
      validConfigs={validConfigsSet}
      isBranchLoading={isBranchLoading}
      onBranchSelect={onBranchSelect}
      onConfigSelect={onConfigSelect}
      onLocaleSelect={onLocalesSelect}
      onDelete={onMappingDelete}
      onAddMapping={addUnifiedMapping}
    />
  );
}

export default AdvancedConfig;
