import { useState } from 'react';

import { Button, Group, MultiSelect, Select, Stack } from '@mantine/core';
import type { CrudFilters } from '@refinedev/core';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFilterProps {
  field: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  setFilters: (filters: CrudFilters) => void;
  filters: CrudFilters;
  mode?: 'single' | 'multiple';
}

type SelectOperator = 'eq' | 'ne' | 'in' | 'nin';

const singleOperatorLabels: Record<Extract<SelectOperator, 'eq' | 'ne'>, string> = {
  eq: 'Equals',
  ne: 'Not equals',
};

const multipleOperatorLabels: Record<Extract<SelectOperator, 'in' | 'nin'>, string> = {
  in: 'In',
  nin: 'Not in',
};

/**
 * SelectFilter provides filtering for enum/select fields
 * Single mode: Supports eq, ne operators
 * Multiple mode: Supports in, nin operators for selecting multiple values
 */
export function SelectFilter({
  field,
  label,
  options,
  placeholder,
  setFilters,
  filters,
  mode = 'single',
}: SelectFilterProps) {
  // Find existing filter for this field
  const existingFilter = filters.find((f) => 'field' in f && f.field === field);

  const initialValue =
    existingFilter && 'value' in existingFilter
      ? mode === 'multiple' && Array.isArray(existingFilter.value)
        ? existingFilter.value
        : mode === 'single' && typeof existingFilter.value === 'string'
          ? existingFilter.value
          : mode === 'multiple'
            ? []
            : null
      : mode === 'multiple'
        ? []
        : null;

  const initialOperator =
    existingFilter && 'operator' in existingFilter && typeof existingFilter.operator === 'string'
      ? (existingFilter.operator as SelectOperator)
      : mode === 'multiple'
        ? 'in'
        : 'eq';

  const [value, setValue] = useState<string | string[] | null>(initialValue);
  const [operator, setOperator] = useState<SelectOperator>(initialOperator);

  const handleApply = () => {
    // Check if value is empty
    const isEmpty = value === null || value === '' || (Array.isArray(value) && value.length === 0);

    if (isEmpty) {
      handleClear();
      return;
    }

    // Remove existing filter for this field
    const otherFilters = filters.filter((f) => !('field' in f && f.field === field));

    // Add new filter with operator
    setFilters([
      ...otherFilters,
      {
        field,
        operator,
        value,
      },
    ]);
  };

  const handleClear = () => {
    setValue(mode === 'multiple' ? [] : null);
    // Remove filter for this field
    const otherFilters = filters.filter((f) => !('field' in f && f.field === field));
    setFilters(otherFilters);
  };

  const isActive = filters.some((f) => 'field' in f && f.field === field);

  return (
    <Stack gap="xs">
      <Select
        data={Object.entries(mode === 'multiple' ? multipleOperatorLabels : singleOperatorLabels).map(
          ([value, label]) => ({ value, label }),
        )}
        value={operator}
        onChange={(val) => setOperator((val as SelectOperator) || (mode === 'multiple' ? 'in' : 'eq'))}
        size="sm"
        aria-label={`${label} operator`}
      />
      {mode === 'single' ? (
        <Select
          data={options}
          placeholder={placeholder || `Select ${label.toLowerCase()}...`}
          value={typeof value === 'string' ? value : null}
          onChange={setValue}
          clearable
          searchable
          size="sm"
        />
      ) : (
        <MultiSelect
          data={options}
          placeholder={placeholder || `Select ${label.toLowerCase()}...`}
          value={Array.isArray(value) ? value : []}
          onChange={setValue}
          clearable
          searchable
          size="sm"
        />
      )}
      <Group gap="xs">
        <Button onClick={handleApply} size="xs" variant="light">
          Apply
        </Button>
        {isActive && (
          <Button onClick={handleClear} size="xs" variant="subtle" color="gray">
            Clear
          </Button>
        )}
      </Group>
    </Stack>
  );
}
