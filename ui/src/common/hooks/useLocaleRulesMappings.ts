import { useState, useCallback } from "react";
import { LocaleRule } from "../types";

export default function useLocaleRulesMappings(initial: LocaleRule[] = []) {
  const [mappings, setMappings] = useState<any>(initial);

  const addMapping = useCallback(() => {
    setMappings((prev: any) => [...prev, { branch_uid: "", locales_uid: [], config_label: "" }]);
  }, []);

  const onLeftSelect = useCallback((selected: any, index: number) => {
    setMappings((prev: any) => {
      const newMappings = [...prev];
      newMappings[index] = { ...newMappings[index], branch_uid: selected.value };
      return newMappings;
    });
  }, []);

  const onMiddleSelect = useCallback((selected: any[], index: number) => {
    setMappings((prev: any) => {
      const newMappings = [...prev];
      const values = selected.map((o: any) => o.value);
      newMappings[index] = { ...newMappings[index], locales_uid: values };
      return newMappings;
    });
  }, []);

  const onRightSelect = useCallback((option: any, index: number) => {
    setMappings((prev: any) => {
      const newMappings = [...prev];
      newMappings[index] = { ...newMappings[index], config_label: option.value };
      return newMappings;
    });
  }, []);

  const onDelete = useCallback((index: number) => {
    setMappings((prev: any) => prev.filter((_: any, i: number) => i !== index));
  }, []);

  return { mappings, setMappings, addMapping, onLeftSelect, onMiddleSelect, onRightSelect, onDelete };
}
