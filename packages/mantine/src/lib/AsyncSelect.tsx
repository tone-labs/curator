import { useCallback, useEffect, useRef, useState } from 'react';

import { Combobox, Input, InputBase, Loader, ScrollArea, useCombobox } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';

interface AsyncSelectProps<T extends Record<string, unknown>> {
  value?: string | null;
  onChange?: (value: string | null) => void;
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onSearchChange: (search: string) => void;
  labelField?: string | ((item: T) => string);
  valueField?: string;
  placeholder?: string;
  error?: string;
  label?: string;
  disabled?: boolean;
  clearable?: boolean;
  maxDropdownHeight?: number;
}

// Default field name priority for label
const DEFAULT_LABEL_FIELDS = ['name', 'title', 'email'] as const;

function getLabel<T extends Record<string, unknown>>(item: T, labelField?: string | ((item: T) => string)): string {
  // If function provided, use it
  if (typeof labelField === 'function') {
    return labelField(item);
  }

  // If specific field provided, use it
  if (labelField && labelField in item && item[labelField] !== undefined) {
    return String(item[labelField]);
  }

  // Try default fields in order
  for (const field of DEFAULT_LABEL_FIELDS) {
    if (field in item && item[field] !== undefined) {
      return String(item[field]);
    }
  }

  // Fallback to ID or string representation
  if ('id' in item && item.id !== undefined) {
    return String(item.id);
  }
  return String(item);
}

export function AsyncSelect<T extends Record<string, unknown>>({
  value,
  onChange,
  items,
  isLoading,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onSearchChange,
  labelField,
  valueField = 'id',
  placeholder = 'Select...',
  error,
  label,
  disabled,
  clearable = true,
  maxDropdownHeight = 300,
}: AsyncSelectProps<T>) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const observerRef = useRef<IntersectionObserver | null>(null);

  // Find the currently selected item to display its label
  const selectedItem = items.find((item) => String(item[valueField]) === value);
  const displayValue = selectedItem ? getLabel(selectedItem, labelField) : '';

  // Open dropdown and focus search
  const handleDropdownOpen = useCallback(() => {
    combobox.openDropdown();
    combobox.focusSearchInput();
  }, [combobox]);

  // Search change handler
  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch);
  }, []);

  // Effect to trigger parent's onSearchChange when debounced search changes
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  // Infinite scroll observer
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [hasMore, isLoadingMore, onLoadMore],
  );

  const handleSelect = (selectedValue: string) => {
    onChange?.(selectedValue);
    setSearch('');
    combobox.closeDropdown();
  };

  const handleClear = () => {
    onChange?.(null);
    setSearch('');
  };

  const options = items.map((item, index) => {
    const itemValue = String(item[valueField]);
    const itemLabel = getLabel(item, labelField);
    const isLast = index === items.length - 1;

    return (
      <Combobox.Option value={itemValue} key={itemValue} ref={isLast ? lastItemRef : undefined}>
        {itemLabel}
      </Combobox.Option>
    );
  });

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleSelect}
      disabled={disabled}
      position="bottom-start"
      middlewares={{ flip: false, shift: false }}
    >
      <Combobox.Target>
        <InputBase
          label={label}
          component="button"
          type="button"
          pointer
          rightSection={
            isLoading ? (
              <Loader size={18} />
            ) : clearable && value ? (
              <Combobox.ClearButton onClear={handleClear} />
            ) : (
              <Combobox.Chevron />
            )
          }
          onClick={handleDropdownOpen}
          rightSectionPointerEvents={value && clearable ? 'all' : 'none'}
          error={error}
          disabled={disabled}
        >
          {value ? displayValue : <Input.Placeholder>{placeholder}</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(event) => handleSearchChange(event.currentTarget.value)}
          placeholder="Search..."
        />
        <Combobox.Options>
          <ScrollArea.Autosize mah={maxDropdownHeight} type="scroll">
            {isLoading && items.length === 0 ? (
              <Combobox.Empty>Loading...</Combobox.Empty>
            ) : items.length === 0 ? (
              <Combobox.Empty>No options found</Combobox.Empty>
            ) : (
              <>
                {options}
                {isLoadingMore && (
                  <div style={{ padding: '8px', textAlign: 'center' }}>
                    <Loader size={18} />
                  </div>
                )}
              </>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
