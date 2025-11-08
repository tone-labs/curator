import { useState } from 'react';

import { Button, Group, Select, Text } from '@mantine/core';
import type { BaseKey, CrudFilters, DataProvider } from '@refinedev/core';
import { useDataProvider } from '@refinedev/core';

/**
 * Fetch all record IDs across all pages using Refine's data provider
 * Respects current filters to only fetch IDs matching the filtered view
 */
async function fetchAllIds(dataProvider: DataProvider, resource: string, filters?: CrudFilters): Promise<BaseKey[]> {
  const allIds: BaseKey[] = [];
  let currentPage = 1;
  let hasMore = true;
  const batchSize = 100;

  while (hasMore) {
    const response = await dataProvider.getList({
      resource,
      pagination: { currentPage, pageSize: batchSize, mode: 'server' },
      filters: filters || [],
    });

    allIds.push(...response.data.map((item) => item.id).filter((id): id is BaseKey => id !== undefined));
    hasMore = response.data.length === batchSize;
    currentPage++;
  }

  return allIds;
}

export interface BulkAction {
  label: string;
  value: string;
  onExecute: (selectedIds: BaseKey[]) => void | Promise<void>;
}

export interface BulkActionsProps {
  /** Currently selected record IDs */
  selectedIds: BaseKey[];
  /** Available bulk actions */
  actions: BulkAction[];
  /** Number of items on current page */
  pageSize: number;
  /** Total number of items across all pages */
  totalItems: number;
  /** Whether "select all" mode is active (selecting all records across pages) */
  allSelected: boolean;
  /** Callback to activate "select all" mode */
  onSelectAll?: () => void;
  /** Callback to clear selection */
  onClearSelection?: () => void;
  /** Resource name for fetching all IDs */
  resource: string;
  /** Current filters to apply when fetching all IDs */
  filters?: CrudFilters;
}

/**
 * BulkActions - UI component for performing bulk operations on selected records
 *
 * Provides a dropdown to select an action and a "Go" button to execute it.
 * Supports "select all" functionality to operate on all records across pages.
 *
 * @example
 * ```tsx
 * const bulkActions: BulkAction[] = [
 *   {
 *     label: 'Activate users',
 *     value: 'activate',
 *     onExecute: (ids) => updateMany({ resource: 'users', ids, values: { is_active: true } }),
 *   },
 *   {
 *     label: 'Delete',
 *     value: 'delete',
 *     onExecute: (ids) => deleteMany({ resource: 'users', ids }),
 *   },
 * ];
 *
 * <BulkActions
 *   resource="users"
 *   selectedIds={selectedIds}
 *   actions={bulkActions}
 *   pageSize={users.length}
 *   totalItems={total}
 *   allSelected={allSelected}
 *   onSelectAll={selectAll}
 *   onClearSelection={clearSelection}
 *   filters={filters}
 * />
 * ```
 */
export function BulkActions({
  selectedIds,
  actions,
  pageSize,
  totalItems,
  allSelected,
  onSelectAll,
  onClearSelection,
  resource,
  filters,
}: BulkActionsProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const dataProvider = useDataProvider();

  const pageFullySelected = selectedIds.length === pageSize;
  const showSelectAll = pageFullySelected && !allSelected && totalItems > pageSize && onSelectAll;
  const showClearSelection = allSelected && onClearSelection;

  const handleExecuteAction = async () => {
    if (!selectedAction || selectedIds.length === 0) {
      return;
    }

    const action = actions.find((a) => a.value === selectedAction);
    if (action) {
      const targetIds = allSelected ? await fetchAllIds(dataProvider(), resource, filters) : selectedIds;
      await action.onExecute(targetIds);
      setSelectedAction(null);
    }
  };

  return (
    <Group mb="md" align="center">
      <Select
        placeholder="Select action"
        data={actions.map((action) => ({ value: action.value, label: action.label }))}
        value={selectedAction}
        onChange={setSelectedAction}
        style={{ flex: 1, maxWidth: 300 }}
        disabled={selectedIds.length === 0}
      />
      <Button onClick={handleExecuteAction} disabled={!selectedAction || selectedIds.length === 0}>
        Go
      </Button>
      <Text size="sm">
        {allSelected ? totalItems : selectedIds.length} of {allSelected ? totalItems : pageSize} selected
      </Text>
      {showSelectAll && (
        <Button variant="subtle" size="compact-sm" onClick={onSelectAll}>
          Select all {totalItems} items
        </Button>
      )}
      {showClearSelection && (
        <Button variant="subtle" size="compact-sm" onClick={onClearSelection}>
          Clear selection
        </Button>
      )}
    </Group>
  );
}
