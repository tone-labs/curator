import { Select } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';

export interface SelectFieldInputProps {
  source: string;
  label?: string;
  data: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  description?: string;
}

/**
 * SelectFieldInput - Simple select dropdown for static options (enums, statuses, etc.)
 *
 * For dynamic/searchable data with infinite loading, use AutocompleteFieldInput instead.
 * For foreign key relationships, use ReferenceFieldInput.
 *
 * Example:
 * ```tsx
 * <SelectFieldInput
 *   source="role"
 *   label="Role"
 *   data={[
 *     { value: 'admin', label: 'Admin' },
 *     { value: 'user', label: 'User' }
 *   ]}
 *   required
 * />
 * ```
 */
export function SelectFieldInput({
  source,
  label,
  data,
  placeholder,
  disabled,
  required,
  description,
}: SelectFieldInputProps) {
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
        <Select
          {...field}
          label={label || source}
          data={data}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          description={description}
          error={error}
        />
      )}
    />
  );
}
