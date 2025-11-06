import { useState } from 'react';

import { Button, Group, NumberInput, Select, Stack } from '@mantine/core';
import type { CrudFilters } from '@refinedev/core';

export interface NumericFilterProps {
  field: string;
  label: string;
  placeholder?: string;
  setFilters: (filters: CrudFilters) => void;
  filters: CrudFilters;
  decimalScale?: number;
  prefix?: string;
  suffix?: string;
}

type NumericOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte';

const operatorLabels: Record<NumericOperator, string> = {
  eq: 'Equals',
  ne: 'Not equals',
  gt: 'Greater than',
  gte: 'Greater or equal',
  lt: 'Less than',
  lte: 'Less or equal',
};

/**
 * NumericFilter provides filtering for numeric fields with comparison operators
 * Supports: eq, ne, gt, gte, lt, lte
 */
export function NumericFilter({
  field,
  label,
  placeholder,
  setFilters,
  filters,
  decimalScale = 0,
  prefix,
  suffix,
}: NumericFilterProps) {
  // Find existing filter for this field
  const existingFilter = filters.find((f) => 'field' in f && f.field === field);
  const initialValue =
    existingFilter && 'value' in existingFilter && typeof existingFilter.value === 'number'
      ? existingFilter.value
      : undefined;
  const initialOperator =
    existingFilter && 'operator' in existingFilter && typeof existingFilter.operator === 'string'
      ? (existingFilter.operator as NumericOperator)
      : 'eq';

  const [value, setValue] = useState<number | string>(initialValue ?? '');
  const [operator, setOperator] = useState<NumericOperator>(initialOperator);

  const handleApply = () => {
    if (value === '' || value === undefined) {
      // Clear filter if value is empty
      handleClear();
      return;
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
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
        value: numValue,
      },
    ]);
  };

  const handleClear = () => {
    setValue('');
    // Remove filter for this field
    const otherFilters = filters.filter((f) => !('field' in f && f.field === field));
    setFilters(otherFilters);
  };

  const isActive = filters.some((f) => 'field' in f && f.field === field);

  return (
    <Stack gap="xs">
      <Select
        data={Object.entries(operatorLabels).map(([value, label]) => ({ value, label }))}
        value={operator}
        onChange={(val) => setOperator((val as NumericOperator) || 'eq')}
        size="sm"
        aria-label={`${label} operator`}
      />
      <NumberInput
        placeholder={placeholder || `Filter by ${label.toLowerCase()}...`}
        value={value}
        onChange={setValue}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleApply();
          }
        }}
        size="sm"
        decimalScale={decimalScale}
        prefix={prefix}
        suffix={suffix}
      />
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
