import { useState, useCallback, useEffect, useRef } from "react";
import { isEqual } from "lodash";
import { UnifiedConfigRule } from "../types";

/**
 * useConfigRulesMapping Hook
 *
 * Manages state and handlers for config rules mappings (branch + locale + config).
 * Handles both branch-only mappings (locale empty = all locales) and locale-specific mappings.
 */
export default function useConfigRulesMapping(
  initial: UnifiedConfigRule[] = []
) {
  const safeInitial = Array.isArray(initial) ? initial : [];
  const [mappings, setMappings] = useState<any>(safeInitial);

  // Initialize prevInitialRef to track the previous initial value
  // Using null as sentinel to detect first mount (handles React Strict Mode)
  const prevInitialRef = useRef<any>(null);
  const mappingsRef = useRef<any>(safeInitial);
  const hasUserChangesRef = useRef<boolean>(false);

  // Keep mappingsRef in sync with mappings state
  useEffect(() => {
    mappingsRef.current = mappings;
  }, [mappings]);

  // Only sync initial on mount or when initial data truly changes AND user hasn't made changes
  useEffect(() => {
    // On first mount, initialize refs
    // State is already initialized via useState(safeInitial), so no need to set it
    if (prevInitialRef.current === null) {
      prevInitialRef.current = safeInitial;
      // mappingsRef is already initialized to safeInitial, and will be kept in sync
      // by the separate effect that watches mappings state
      return;
    }

    // Use deep equality to check if safeInitial actually changed
    const hasChanged = !isEqual(prevInitialRef.current, safeInitial);

    // After mount, only sync if:
    // 1. Initial data actually changed
    // 2. AND user hasn't made any changes (hasUserChangesRef is false)
    // 3. AND current mappings match previous initial (meaning no user edits)
    if (hasChanged && !hasUserChangesRef.current) {
      // Validate that current mappings haven't been edited by user
      const mappingsMatchPreviousInitial = isEqual(
        mappingsRef.current,
        prevInitialRef.current
      );

      // Only sync if current mappings still match previous initial (no user edits)
      // This makes the effect idempotent - won't overwrite if values are already the same
      if (mappingsMatchPreviousInitial) {
        // Update refs and state only if actually different (idempotent)
        if (!isEqual(mappingsRef.current, safeInitial)) {
          prevInitialRef.current = safeInitial;
          setMappings(safeInitial);
        } else {
          // Even if we don't update state, update the ref to track the new initial
          prevInitialRef.current = safeInitial;
        }
      }
    }
  }, [safeInitial]);

  const addMapping = useCallback((ruleType: string = "branch") => {
    hasUserChangesRef.current = true;
    setMappings((prev: any) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return [
        ...safePrev,
        {
          id: `mapping-${crypto.randomUUID()}`,
          branch_uid: "",
          locales_uid: [],
          config_label: "",
          ruleType,
        },
      ];
    });
  }, []);

  const onLeftSelect = useCallback((selected: any, index: number) => {
    if (!selected || selected?.value == null || typeof index !== "number")
      return;

    hasUserChangesRef.current = true;
    setMappings((prev: any) => {
      if (!Array.isArray(prev) || index < 0 || index >= prev?.length)
        return prev;
      const newMappings = [...prev];
      newMappings[index] = {
        ...newMappings?.[index],
        branch_uid: selected?.value,
      };
      return newMappings;
    });
  }, []);

  const onMiddleSelect = useCallback((selected: any[], index: number) => {
    if (typeof index !== "number") return;

    hasUserChangesRef.current = true;
    setMappings((prev: any) => {
      if (!Array.isArray(prev) || index < 0 || index >= prev?.length)
        return prev;
      const newMappings = [...prev];
      const values = Array.isArray(selected)
        ? selected.map((o: any) => o?.value).filter(Boolean)
        : [];
      newMappings[index] = { ...newMappings?.[index], locales_uid: values };
      return newMappings;
    });
  }, []);

  const onRightSelect = useCallback((option: any, index: number) => {
    if (!option || option?.value == null || typeof index !== "number") return;

    hasUserChangesRef.current = true;
    setMappings((prev: any) => {
      if (!Array.isArray(prev) || index < 0 || index >= prev?.length)
        return prev;
      const newMappings = [...prev];
      newMappings[index] = {
        ...newMappings?.[index],
        config_label: option?.value,
      };
      return newMappings;
    });
  }, []);

  const onDelete = useCallback((index: number) => {
    if (typeof index !== "number") return;

    hasUserChangesRef.current = true;
    setMappings((prev: any) => {
      if (!Array.isArray(prev)) return prev;
      return prev.filter((_: any, i: number) => i !== index);
    });
  }, []);

  return {
    mappings,
    setMappings,
    addMapping,
    onLeftSelect,
    onMiddleSelect,
    onRightSelect,
    onDelete,
  };
}
