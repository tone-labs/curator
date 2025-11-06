import type React from 'react';

import { Stack, Text, UnstyledButton } from '@mantine/core';
import type { CrudFilters } from '@refinedev/core';
import { IconCheck } from '@tabler/icons-react';

import { getFilterValue } from './utils.js';

export interface DateRangeOption {
  label: string;
  value: string;
  getStartDate: () => string | undefined;
  getEndDate?: () => string | undefined;
}

export interface DateRangeFilterProps {
  field: string;
  label: string;
  options?: DateRangeOption[];
  setFilters: (filters: CrudFilters, behavior?: 'merge' | 'replace') => void;
  filters: CrudFilters;
}

// Helper to format date as YYYY-MM-DD
const toDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const defaultOptions: DateRangeOption[] = [
  {
    label: 'Any date',
    value: 'any',
    getStartDate: () => undefined,
  },
  {
    label: 'Today',
    value: 'today',
    getStartDate: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return toDateString(today);
    },
    getEndDate: () => {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return toDateString(today);
    },
  },
  {
    label: 'Past 7 days',
    value: 'past-7-days',
    getStartDate: () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      return toDateString(sevenDaysAgo);
    },
    getEndDate: () => {
      const now = new Date();
      now.setHours(23, 59, 59, 999);
      return toDateString(now);
    },
  },
  {
    label: 'This month',
    value: 'this-month',
    getStartDate: () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return toDateString(startOfMonth);
    },
    getEndDate: () => {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return toDateString(endOfMonth);
    },
  },
  {
    label: 'This year',
    value: 'this-year',
    getStartDate: () => {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return toDateString(startOfYear);
    },
    getEndDate: () => {
      const now = new Date();
      const endOfYear = new Date(now.getFullYear(), 11, 31);
      return toDateString(endOfYear);
    },
  },
];

/**
 * DateRangeFilter - A filter for date fields with preset ranges (like Django admin's DateFieldListFilter)
 *
 * Provides preset date range options like "Today", "Past 7 days", "This month", etc.
 *
 * Example:
 * ```tsx
 * <DateRangeFilter
 *   field="created_at"
 *   label="Date Joined"
 * />
 * ```
 */
export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  field,
  label,
  options = defaultOptions,
  setFilters,
  filters,
}) => {
  // Get current filter values for both gte and lte operators
  const currentStartValue = getFilterValue(field, filters, 'gte') as string | undefined;
  const currentEndValue = getFilterValue(field, filters, 'lte') as string | undefined;

  // Determine which option is currently active
  const getActiveOption = (): string => {
    if (!currentStartValue && !currentEndValue) {
      return 'any';
    }

    // Try to match current filters to an option
    for (const option of options) {
      const startDate = option.getStartDate();
      const endDate = option.getEndDate ? option.getEndDate() : undefined;

      // Match if both start and end match (or both are undefined)
      if (startDate === currentStartValue && endDate === currentEndValue) {
        return option.value;
      }
    }

    return 'custom';
  };

  const activeOption = getActiveOption();

  const handleClick = (option: DateRangeOption) => {
    // Remove existing date filters for this field
    const otherFilters = filters.filter((f) => !('field' in f) || f.field !== field);

    if (option.value === 'any') {
      // Clear date filters
      setFilters(otherFilters);
      return;
    }

    const startDate = option.getStartDate();
    const endDate = option.getEndDate ? option.getEndDate() : undefined;

    if (!startDate) {
      setFilters(otherFilters);
      return;
    }

    // Add gte filter for start date
    const newFilters: CrudFilters = [...otherFilters, { field, operator: 'gte', value: startDate }];

    // Add lte filter for end date if provided
    if (endDate) {
      newFilters.push({ field, operator: 'lte', value: endDate });
    }

    setFilters(newFilters);
  };

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500}>
        {label}
      </Text>
      <Stack gap={4}>
        {options.map((option) => {
          const isActive = activeOption === option.value;
          return (
            <UnstyledButton
              key={option.value}
              onClick={() => handleClick(option)}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: isActive ? 'var(--mantine-color-blue-light)' : 'transparent',
                color: isActive ? 'var(--mantine-color-blue-filled)' : 'var(--mantine-color-gray-7)',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              {isActive && <IconCheck size={16} />}
              <Text size="sm">{option.label}</Text>
            </UnstyledButton>
          );
        })}
      </Stack>
    </Stack>
  );
};
