import { MultiSelect } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';

export interface MultiSelectFieldInputProps {
  source: string;
  label?: string;
  data: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  description?: string;
  searchable?: boolean;
  clearable?: boolean;
  maxValues?: number;
}

/**
 * MultiSelectFieldInput - Multi-select dropdown for static options (tags, categories, permissions, etc.)
 *
 * For single selection, use SelectFieldInput instead.
 * For dynamic/searchable data with infinite loading, use AutocompleteFieldInput.
 * For foreign key relationships, use ReferenceFieldInput.
 *
 * Example:
 * ```tsx
 * <MultiSelectFieldInput
 *   source="permissions"
 *   label="Permissions"
 *   data={[
 *     { value: 'read', label: 'Read' },
 *     { value: 'write', label: 'Write' },
 *     { value: 'delete', label: 'Delete' }
 *   ]}
 *   searchable
 *   clearable
 * />
 * ```
 */
export function MultiSelectFieldInput({
  source,
  label,
  data,
  placeholder,
  disabled,
  required,
  description,
  searchable = true,
  clearable = true,
  maxValues,
}: MultiSelectFieldInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[source]?.message as string | undefined;

  return (
    <Controller
      name={source}
      control={control}
      render={({ field }) => (
        <MultiSelect
          {...field}
          label={label || source}
          data={data}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          description={description}
          error={error}
          searchable={searchable}
          clearable={clearable}
          maxValues={maxValues}
        />
      )}
    />
  );
}
