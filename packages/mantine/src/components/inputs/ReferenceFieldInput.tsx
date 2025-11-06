import { useMemo, useState } from 'react';

import { type BaseRecord, useInfiniteList, useOne } from '@refinedev/core';
import { useFormContext, useWatch } from 'react-hook-form';

import { AutocompleteFieldInput } from './AutocompleteFieldInput.js';

export interface ReferenceFieldInputProps {
  source: string;
  label?: string;
  resource: string;
  labelField?: string | ((item: BaseRecord) => string);
  valueField?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function ReferenceFieldInput({
  source,
  label,
  resource,
  labelField,
  valueField = 'id',
  placeholder,
  disabled,
}: ReferenceFieldInputProps) {
  const { control } = useFormContext();
  const [search, setSearch] = useState('');
  const limit = 25;

  // Generate a sensible default placeholder based on resource
  const defaultPlaceholder = placeholder || `Select ${resource.slice(0, -1)}`;

  // Watch current value from form
  const currentValue = useWatch({ control, name: source });

  // Fetch single item by ID (only if value exists)
  const { result: selectedItemResult } = useOne({
    resource,
    id: currentValue,
    queryOptions: {
      enabled: !!currentValue && typeof currentValue === 'string',
    },
  });

  const selectedItem = selectedItemResult?.data;

  // Fetch infinite list for browsing
  const infiniteListResult = useInfiniteList({
    resource,
    pagination: {
      pageSize: limit,
    },
    filters: search
      ? [
          {
            field: 'search',
            operator: 'eq',
            value: search,
          },
        ]
      : [],
  });

  const data = infiniteListResult.query?.data;
  const isLoading = infiniteListResult.query?.isLoading ?? false;
  const isFetchingNextPage = infiniteListResult.query?.isFetchingNextPage ?? false;
  const hasNextPage = infiniteListResult.query?.hasNextPage ?? false;
  const fetchNextPage = infiniteListResult.query?.fetchNextPage ?? (() => {});

  // Flatten all pages into a single items array
  const listItems = useMemo(() => {
    if (!data?.pages) return [];

    // Extract items from Refine's paginated response format
    return data.pages.flatMap((page: { data: BaseRecord[] }) => page.data || []);
  }, [data?.pages]);

  // Merge selected item with list items (avoid duplicates)
  const items = useMemo(() => {
    if (!selectedItem) return listItems;

    // Check if selected item is already in the list
    const selectedItemId = (selectedItem as BaseRecord)[valueField];
    const isInList = listItems.some((item: BaseRecord) => item[valueField] === selectedItemId);

    if (isInList) {
      return listItems;
    }

    // Add selected item to the beginning
    return [selectedItem as BaseRecord, ...listItems];
  }, [selectedItem, listItems, valueField]);

  return (
    <AutocompleteFieldInput
      source={source}
      label={label}
      items={items}
      isLoading={isLoading}
      hasMore={hasNextPage ?? false}
      isLoadingMore={isFetchingNextPage}
      onLoadMore={() => fetchNextPage()}
      onSearchChange={setSearch}
      labelField={labelField}
      valueField={valueField}
      placeholder={defaultPlaceholder}
      disabled={disabled}
    />
  );
}
