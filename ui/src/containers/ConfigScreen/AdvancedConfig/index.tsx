import React, { useCallback, useEffect } from "react";
import BranchSpecificConfig from "./BranchSpecificConfig";
import LocaleSpecificConfig from "./LocaleSpecificConfig";
import useBranchRulesMappings from "../../../common/hooks/useBranchRulesMappings";
import useLocaleRulesMappings from "../../../common/hooks/useLocaleRulesMappings";
import { MarketplaceAppContext } from "../../../common/contexts/MarketplaceAppContext";
import AppConfigContext from "../../../common/contexts/AppConfigContext";

function AdvancedConfig({ branches, configList, setConfigRulesMapper }: any) {
  const { installationData, appConfig } = React.useContext(AppConfigContext);

  const { locales } = React.useContext(MarketplaceAppContext);

  const defaultKey =
    installationData?.configuration?.default_multi_config_key || "config-1";

  function clubLocaleMappings(localeRules: any[]) {
    const clubbed: any = {};

    localeRules.forEach((rule) => {
      const branch = rule.branch_uid;
      const config = Array.isArray(rule.config_label)
        ? rule.config_label[0]
        : rule.config_label;
      const locale = rule.locales_uid[0];

      if (!clubbed[branch]) clubbed[branch] = {};
      if (!clubbed[branch][config]) clubbed[branch][config] = new Set();

      clubbed[branch][config].add(locale);
    });

    const result: any = [];
    Object.entries(clubbed).forEach(([branch, configsObj]: any) => {
      Object.entries(configsObj).forEach(([config, localesSet]: any) => {
        result.push({
          branch_uid: branch,
          locales_uid: Array.from(localesSet),
          config_label: config,
        });
      });
    });

    return result;
  }

  const extractPresets = useCallback(() => {
    const innerBranchRules: any[] = [];
    const innerLocaleRules: any[] = [];

    const configRules = installationData?.configuration?.config_rules;
    if (!configRules) {
      return { branchRules: [], localeRules: [] };
    }

    Object.entries(configRules).forEach(([branchUid, branchObj]: any) => {
      const configLabel =
        Array.isArray(branchObj.config_label) && branchObj.config_label.length
          ? branchObj.config_label[0]
          : [defaultKey];

      innerBranchRules.push({
        branch_uid: [branchUid],
        config_label: configLabel,
      });

      Object.entries(branchObj.locales || {}).forEach(
        ([locale, localeObj]: any) => {
          const localeConfigLabel =
            Array.isArray(localeObj.config_label) &&
              localeObj.config_label.length
              ? localeObj.config_label[0]
              : [defaultKey];
          innerLocaleRules.push({
            branch_uid: branchUid,
            locales_uid: [locale],
            config_label: localeConfigLabel,
          });
        }
      );
    });

    return { branchRules: innerBranchRules, localeRules: innerLocaleRules };
  }, [installationData?.configuration, defaultKey]);

  const {
    branchRules: extractedBranchRules,
    localeRules: extractedLocaleRules,
  } = extractPresets();
  const clubbedLocaleRules = clubLocaleMappings(extractedLocaleRules);

  const {
    mappings: branchRules,
    addMapping: addBranchRule,
    onLeftSelect: onBranchLeftSelect,
    onRightSelect: onBranchConfigSelect,
    onDelete: onBranchDelete,
  } = useBranchRulesMappings(extractedBranchRules);

  const {
    mappings: localeRules,
    addMapping: addLocaleRule,
    onLeftSelect: onLocaleBranchSelect,
    onMiddleSelect: onLocalesSelect,
    onRightSelect: onLocaleConfigSelect,
    onDelete: onLocaleDelete,
  } = useLocaleRulesMappings(clubbedLocaleRules);


  const rightBranchSpecificOptions = React.useMemo(() => {
    if (!Array.isArray(configList)) return [];
    return configList.map((configKey: string) => ({
      label: configKey,
      value: configKey,
    }));
  }, [configList]);

  const leftBranchSpecificOptions = React.useMemo(() => {
    if (!Array.isArray(branches)) return [];
    return branches.map((b: any) => ({
      label: b.uid,
      value: b.uid,
    }));
  }, [branches]);

  const middleLocaleOptions = React.useMemo(() => {
    if (!Array.isArray(locales)) return [];
    return locales?.map((l: any) => ({
      label: l.name,
      value: l.code,
    }));
  }, [locales]);

  interface BranchRule {
    branch_uid: string[];
    config_label: string | string[];
  }

  interface LocaleRule {
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

  function buildCombinedMapper(
    branchRulesParam: BranchRule[],
    localeRulesParam: LocaleRule[]
  ): ConfigRules {
    const result: ConfigRules = {};

    branchRulesParam.forEach((rule: BranchRule) => {
      (rule.branch_uid || []).forEach((branch: string) => {
        if (!result[branch]) {
          result[branch] = { config_label: [] };
        }
        const cfgArr = result[branch].config_label;
        if (Array.isArray(rule.config_label)) {
          rule.config_label.forEach((cl: string) => {
            if (!cfgArr.includes(cl)) cfgArr.push(cl);
          });
        } else if (rule.config_label && !cfgArr.includes(rule.config_label)) {
          cfgArr.push(rule.config_label);
        }
      });
    });

    localeRulesParam.forEach((rule: LocaleRule) => {
      const branchUids = Array.isArray(rule.branch_uid)
        ? rule.branch_uid
        : [rule.branch_uid];

      branchUids.forEach((branch: string) => {
        if (!result[branch]) {
          result[branch] = { config_label: [] };
        }
        if (!result[branch].locales) {
          result[branch].locales = {};
        }

        (rule.locales_uid || []).forEach((locale: string) => {
          if (!result[branch].locales![locale]) {
            result[branch].locales![locale] = { config_label: [] };
          }
          const localeCfgArr = result[branch].locales![locale].config_label;
          if (Array.isArray(rule.config_label)) {
            rule.config_label.forEach((cl: string) => {
              if (!localeCfgArr.includes(cl)) localeCfgArr.push(cl);
            });
          } else if (
            rule.config_label &&
            !localeCfgArr.includes(rule.config_label)
          ) {
            localeCfgArr.push(rule.config_label);
          }
        });
      });
    });

    return result;
  }

  useEffect(() => {
    console.info("$$$ AdvancedConfig : appConfig:", appConfig);
  }, [appConfig]);

  useEffect(() => {
    const newConfigRules = buildCombinedMapper(branchRules, localeRules);
    setConfigRulesMapper(newConfigRules);
  }, [branchRules, localeRules]);

  return (
    <>
      <BranchSpecificConfig
        mappings={branchRules}
        leftOptions={leftBranchSpecificOptions}
        rightOptions={rightBranchSpecificOptions}
        onLeftSelect={onBranchLeftSelect}
        onRightSelect={onBranchConfigSelect}
        onDelete={onBranchDelete}
        onAddMapping={addBranchRule}
        isMulti
      />
      <LocaleSpecificConfig
        mappings={localeRules}
        leftOptions={leftBranchSpecificOptions}
        middleOptions={middleLocaleOptions}
        rightOptions={rightBranchSpecificOptions}
        onLeftSelect={onLocaleBranchSelect}
        onMiddleSelect={onLocalesSelect}
        onRightSelect={onLocaleConfigSelect}
        onDelete={onLocaleDelete}
        onAddMapping={addLocaleRule}
      />
    </>
  );
}

export default AdvancedConfig;
