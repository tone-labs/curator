import type React from 'react';

import { Stack, Text, UnstyledButton } from '@mantine/core';
import type { CrudFilters } from '@refinedev/core';
import { IconCheck } from '@tabler/icons-react';

import { getFilterValue } from './utils.js';

export interface BooleanFilterProps {
  field: string;
  label: string;
  trueLabel?: string;
  falseLabel?: string;
  allLabel?: string;
  setFilters: (filters: CrudFilters, behavior?: 'merge' | 'replace') => void;
  filters: CrudFilters;
}

/**
 * BooleanFilter - A filter for boolean fields (like Django admin's BooleanFieldListFilter)
 *
 * Provides three options:
 * - All (no filter)
 * - True value
 * - False value
 *
 * Example:
 * ```tsx
 * <BooleanFilter
 *   field="is_superuser"
 *   label="Superuser Status"
 *   trueLabel="Superusers only"
 *   falseLabel="Non-superusers only"
 * />
 * ```
 */
export const BooleanFilter: React.FC<BooleanFilterProps> = ({
  field,
  label,
  trueLabel = 'Yes',
  falseLabel = 'No',
  allLabel = 'All',
  setFilters,
  filters,
}) => {
  // Get current filter value using our helper
  const currentValue = getFilterValue(field, filters, 'eq');

  const handleClick = (value: boolean | null) => {
    if (value === null) {
      // Remove the filter - pass empty array to clear this specific filter
      const otherFilters = filters.filter((f) => 'field' in f && f.field !== field);
      setFilters(otherFilters);
    } else {
      // Set the filter - merge with existing filters for other fields
      const otherFilters = filters.filter((f) => 'field' in f && f.field !== field);
      const newFilters = [...otherFilters, { field, operator: 'eq' as const, value }];
      setFilters(newFilters);
    }
  };

  const isActive = (value: boolean | null) => {
    if (value === null) {
      return currentValue === undefined || currentValue === null;
    }
    return currentValue === value;
  };

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500}>
        {label}
      </Text>
      <Stack gap={4}>
        <UnstyledButton
          onClick={() => handleClick(null)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            backgroundColor: isActive(null) ? 'var(--mantine-color-blue-light)' : 'transparent',
            color: isActive(null) ? 'var(--mantine-color-blue-filled)' : 'var(--mantine-color-gray-7)',
            fontWeight: isActive(null) ? 600 : 400,
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          {isActive(null) && <IconCheck size={16} />}
          <Text size="sm">{allLabel}</Text>
        </UnstyledButton>
        <UnstyledButton
          onClick={() => handleClick(true)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            backgroundColor: isActive(true) ? 'var(--mantine-color-blue-light)' : 'transparent',
            color: isActive(true) ? 'var(--mantine-color-blue-filled)' : 'var(--mantine-color-gray-7)',
            fontWeight: isActive(true) ? 600 : 400,
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          {isActive(true) && <IconCheck size={16} />}
          <Text size="sm">{trueLabel}</Text>
        </UnstyledButton>
        <UnstyledButton
          onClick={() => handleClick(false)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            backgroundColor: isActive(false) ? 'var(--mantine-color-blue-light)' : 'transparent',
            color: isActive(false) ? 'var(--mantine-color-blue-filled)' : 'var(--mantine-color-gray-7)',
            fontWeight: isActive(false) ? 600 : 400,
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          {isActive(false) && <IconCheck size={16} />}
          <Text size="sm">{falseLabel}</Text>
        </UnstyledButton>
      </Stack>
    </Stack>
  );
};
