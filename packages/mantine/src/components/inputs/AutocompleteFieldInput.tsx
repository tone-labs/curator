import type { BaseRecord } from '@refinedev/core';
import { Controller, useFormContext } from 'react-hook-form';

import { AsyncSelect } from '../../lib/AsyncSelect.js';

export interface AutocompleteFieldInputProps<T extends BaseRecord> {
  source: string;
  label?: string;
  items: T[];
  isLoading?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  onSearchChange?: (search: string) => void;
  labelField?: string | ((item: T) => string);
  valueField?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function AutocompleteFieldInput<T extends BaseRecord>({
  source,
  label,
  items,
  isLoading = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore = () => {},
  onSearchChange = () => {},
  labelField,
  valueField = 'id',
  placeholder,
  disabled,
}: AutocompleteFieldInputProps<T>) {
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
        <AsyncSelect
          value={field.value}
          onChange={field.onChange}
          items={items}
          isLoading={isLoading}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={onLoadMore}
          onSearchChange={onSearchChange}
          labelField={labelField}
          valueField={valueField}
          placeholder={placeholder}
          label={label || source}
          error={error}
          disabled={disabled}
        />
      )}
    />
  );
}
