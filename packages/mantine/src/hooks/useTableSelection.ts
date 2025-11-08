import { useCallback, useMemo, useState } from 'react';

import type { BaseKey, BaseRecord } from '@refinedev/core';

/**
 * Hook to manage table row selection state
 *
 * Provides state management for:
 * - Row selection (which rows are selected)
 * - "Select all" functionality (selecting all records across pages)
 * - Integration with Mantine DataTable's selection API
 *
 * @example
 * ```tsx
 * const { selectedIds, selectedRecords, onSelectedRecordsChange, clearSelection, allSelected, selectAll } =
 *   useTableSelection<User>(users);
 *
 * <DataTable
 *   selectedRecords={selectedRecords}
 *   onSelectedRecordsChange={onSelectedRecordsChange}
 *   records={users}
 *   // ... other props
 * />
 *
 * <BulkActions
 *   selectedIds={selectedIds}
 *   allSelected={allSelected}
 *   onSelectAll={selectAll}
 *   onClearSelection={clearSelection}
 * />
 * ```
 */
export function useTableSelection<T extends BaseRecord>(records: T[]) {
  const [rowSelection, setRowSelection] = useState<Record<BaseKey, boolean>>({});
  const [allSelected, setAllSelected] = useState(false);

  const selectedIds = useMemo(() => Object.keys(rowSelection), [rowSelection]);

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
    setRowSelection(newSelection);
  }, []);

  const clearSelection = useCallback(() => {
    setRowSelection({});
    setAllSelected(false);
  }, []);

  const selectAll = useCallback(() => {
    setAllSelected(true);
  }, []);

  return {
    rowSelection,
    setRowSelection,
    selectedIds,
    selectedRecords,
    onSelectedRecordsChange,
    clearSelection,
    allSelected,
    selectAll,
  };
}
