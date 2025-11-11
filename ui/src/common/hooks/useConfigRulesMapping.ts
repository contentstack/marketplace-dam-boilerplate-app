import { useState, useCallback, useEffect, useRef } from "react";
import { UnifiedConfigRule } from "../types";

/**
 * useConfigRulesMapping Hook
 * 
 * Manages state and handlers for config rules mappings (branch + locale + config).
 * Handles both branch-only mappings (locale empty = all locales) and locale-specific mappings.
 */
export default function useConfigRulesMapping(initial: UnifiedConfigRule[] = []) {
  const safeInitial = Array.isArray(initial) ? initial : [];
  const [mappings, setMappings] = useState<any>(safeInitial);
  const prevInitialRef = useRef<any>(null);
  const isMountedRef = useRef<boolean>(false);
  const hasUserChangesRef = useRef<boolean>(false);

  // Only sync initial on mount or when initial data truly changes AND user hasn't made changes
  useEffect(() => {
    const initialStr = JSON.stringify(safeInitial);
    const prevInitialStr = JSON.stringify(prevInitialRef.current);
    const hasChanged = initialStr !== prevInitialStr;

    // On first mount, always sync
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      prevInitialRef.current = safeInitial;
      setMappings(safeInitial);
      return;
    }

    // After mount, only sync if:
    // 1. Initial data actually changed (different content, not just reference)
    // 2. AND user hasn't made any changes (hasUserChangesRef is false)
    // 3. AND current mappings match previous initial (meaning no user edits)
    if (hasChanged && !hasUserChangesRef.current) {
      const currentMappingsStr = JSON.stringify(mappings);
      const prevMappingsMatchInitial = currentMappingsStr === prevInitialStr;

      // Only sync if current mappings still match previous initial (no user edits)
      if (prevMappingsMatchInitial) {
        prevInitialRef.current = safeInitial;
        setMappings(safeInitial);
      }
    }
  }, [safeInitial, mappings]);

  const addMapping = useCallback((ruleType: string = "branch") => {
    hasUserChangesRef.current = true;
    setMappings((prev: any) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return [...safePrev, {
        id: `mapping-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        branch_uid: "",
        locales_uid: [],
        config_label: "",
        ruleType
      }];
    });
  }, []);

  const onLeftSelect = useCallback((selected: any, index: number) => {
    if (!selected || selected?.value === undefined || typeof index !== 'number') return;

    hasUserChangesRef.current = true;
    setMappings((prev: any) => {
      if (!Array.isArray(prev) || index < 0 || index >= prev?.length) return prev;
      const newMappings = [...prev];
      newMappings[index] = { ...newMappings?.[index], branch_uid: selected?.value };
      return newMappings;
    });
  }, []);

  const onMiddleSelect = useCallback((selected: any[], index: number) => {
    if (typeof index !== 'number') return;

    hasUserChangesRef.current = true;
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

    hasUserChangesRef.current = true;
    setMappings((prev: any) => {
      if (!Array.isArray(prev) || index < 0 || index >= prev?.length) return prev;
      const newMappings = [...prev];
      newMappings[index] = { ...newMappings?.[index], config_label: option?.value };
      return newMappings;
    });
  }, []);

  const onDelete = useCallback((index: number) => {
    if (typeof index !== 'number') return;

    hasUserChangesRef.current = true;
    setMappings((prev: any) => {
      if (!Array.isArray(prev)) return prev;
      return prev.filter((_: any, i: number) => i !== index);
    });
  }, []);

  return { mappings, setMappings, addMapping, onLeftSelect, onMiddleSelect, onRightSelect, onDelete };
}
