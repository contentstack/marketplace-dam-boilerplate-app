import { useState, useCallback } from "react";
import { UnifiedConfigRule } from "../types";

/**
 * useUnifiedConfigMappings Hook
 * 
 * Manages state and handlers for unified config mappings (branch + locale + config).
 * Handles both branch-only mappings (locale empty = all locales) and locale-specific mappings.
 */
export default function useUnifiedConfigMappings(initial: UnifiedConfigRule[] = []) {
  const safeInitial = Array.isArray(initial) ? initial : [];
  const [mappings, setMappings] = useState<any>(safeInitial);

  const addMapping = useCallback(() => {
    setMappings((prev: any) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return [...safePrev, { branch_uid: "", locales_uid: [], config_label: "" }];
    });
  }, []);

  const onLeftSelect = useCallback((selected: any, index: number) => {
    if (!selected || selected?.value === undefined || typeof index !== 'number') return;
    
    setMappings((prev: any) => {
      if (!Array.isArray(prev) || index < 0 || index >= prev?.length) return prev;
      const newMappings = [...prev];
      newMappings[index] = { ...newMappings?.[index], branch_uid: selected?.value };
      return newMappings;
    });
  }, []);

  const onMiddleSelect = useCallback((selected: any[], index: number) => {
    if (typeof index !== 'number') return;
    
    setMappings((prev: any) => {
      if (!Array.isArray(prev) || index < 0 || index >= prev?.length) return prev;
      const newMappings = [...prev];
      const values = Array.isArray(selected) 
        ? selected.map((o: any) => o?.value).filter(Boolean) 
        : [];
      newMappings[index] = { ...newMappings?.[index], locales_uid: values };
      return newMappings;
    });
  }, []);

  const onRightSelect = useCallback((option: any, index: number) => {
    if (!option || option?.value === undefined || typeof index !== 'number') return;
    
    setMappings((prev: any) => {
      if (!Array.isArray(prev) || index < 0 || index >= prev?.length) return prev;
      const newMappings = [...prev];
      newMappings[index] = { ...newMappings?.[index], config_label: option?.value };
      return newMappings;
    });
  }, []);

  const onDelete = useCallback((index: number) => {
    if (typeof index !== 'number') return;
    
    setMappings((prev: any) => {
      if (!Array.isArray(prev)) return prev;
      return prev.filter((_: any, i: number) => i !== index);
    });
  }, []);

  return { mappings, setMappings, addMapping, onLeftSelect, onMiddleSelect, onRightSelect, onDelete };
}
