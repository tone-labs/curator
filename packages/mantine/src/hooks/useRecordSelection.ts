import { useCallback, useMemo, useState } from 'react';

import type { BaseKey, BaseRecord } from '@refinedev/core';

/**
 * Hook to manage record selection state
 *
 * Provides state management for:
 * - Record selection (which records are selected)
 * - "Select all" functionality (selecting all records across pages)
 * - Integration with selection UIs (tables, lists, grids, etc.)
 *
 * @example
 * ```tsx
 * const { selectedIds, selectedRecords, onSelectedRecordsChange, clearSelection, allSelected, selectAll } =
 *   useRecordSelection<User>(users);
 *
 * // Use with Mantine DataTable
 * <DataTable
 *   selectedRecords={selectedRecords}
 *   onSelectedRecordsChange={onSelectedRecordsChange}
 *   records={users}
 * />
 *
 * // Use with BulkActions
 * <BulkActions
 *   selectedIds={selectedIds}
 *   allSelected={allSelected}
 *   onSelectAll={selectAll}
 *   onClearSelection={clearSelection}
 * />
 * ```
 */
export function useRecordSelection<T extends BaseRecord>(records: T[]) {
  const [recordSelection, setRecordSelection] = useState<Record<BaseKey, boolean>>({});
  const [allSelected, setAllSelected] = useState(false);

  const selectedIds = useMemo(() => Object.keys(recordSelection), [recordSelection]);

  const selectedRecords = useMemo(() => {
    const idSet: Set<BaseKey> = new Set(selectedIds);
    return records.filter((record) => record.id && idSet.has(record.id));
  }, [records, selectedIds]);

  const onSelectedRecordsChange = useCallback((selected: T[]) => {
    const newSelection: Record<BaseKey, boolean> = {};
    selected.forEach((record) => {
      if (record.id) {
        newSelection[record.id] = true;
      }
    });
    setRecordSelection(newSelection);
  }, []);

  const clearSelection = useCallback(() => {
    setRecordSelection({});
    setAllSelected(false);
  }, []);

  const selectAll = useCallback(() => {
    setAllSelected(true);
  }, []);

  return {
    recordSelection,
    setRecordSelection,
    selectedIds,
    selectedRecords,
    onSelectedRecordsChange,
    clearSelection,
    allSelected,
    selectAll,
  };
}
