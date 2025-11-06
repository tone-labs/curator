import type { CrudFilter, CrudFilters } from '@refinedev/core';

/**
 * Helper to get filter value from filters array
 * This is a replacement for Refine's getDefaultFilter() which doesn't work
 * correctly with local filter state (it returns empty arrays for false values)
 */
export const getFilterValue = (field: string, filters: CrudFilters, operator: string): unknown => {
  const filter = filters.find(
    (f): f is CrudFilter & { field: string } => 'field' in f && f.field === field && f.operator === operator,
  );
  return filter?.value;
};
