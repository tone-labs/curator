import { useState } from 'react';

import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import type { CrudFilters } from '@refinedev/core';

export interface TextFilterProps {
  field: string;
  label: string;
  placeholder?: string;
  setFilters: (filters: CrudFilters) => void;
  filters: CrudFilters;
}

type TextOperator = 'contains' | 'startswith' | 'endswith' | 'eq';

const operatorLabels: Record<TextOperator, string> = {
  contains: 'Contains',
  startswith: 'Starts with',
  endswith: 'Ends with',
  eq: 'Equals',
};

/**
 * TextFilter provides filtering for text fields with multiple operators
 * Supports: contains, startswith, endswith, eq
 */
export function TextFilter({ field, label, placeholder, setFilters, filters }: TextFilterProps) {
  // Find existing filter for this field
  const existingFilter = filters.find((f) => 'field' in f && f.field === field);
  const initialValue = existingFilter && 'value' in existingFilter ? String(existingFilter.value) : '';
  const initialOperator =
    existingFilter && 'operator' in existingFilter && typeof existingFilter.operator === 'string'
      ? (existingFilter.operator as TextOperator)
      : 'contains';

  const [value, setValue] = useState<string>(initialValue);
  const [operator, setOperator] = useState<TextOperator>(initialOperator);

  const handleApply = () => {
    if (!value.trim()) {
      // Clear filter if value is empty
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
        value: value.trim(),
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
      <Group gap="xs" wrap="nowrap">
        <Select
          data={Object.entries(operatorLabels).map(([value, label]) => ({ value, label }))}
          value={operator}
          onChange={(val) => setOperator((val as TextOperator) || 'contains')}
          style={{ width: '140px' }}
          size="sm"
          aria-label={`${label} operator`}
        />
      </Group>
      <TextInput
        placeholder={placeholder || `Filter by ${label.toLowerCase()}...`}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleApply();
          }
        }}
        size="sm"
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
