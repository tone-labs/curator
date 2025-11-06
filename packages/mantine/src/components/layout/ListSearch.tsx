import { useState } from 'react';

import { Button, Group, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export interface ListSearchProps {
  /** Current search value (committed) */
  search: string;
  /** Total number of items */
  total: number;
  /** Resource name (singular) for placeholder text */
  resourceName: string;
  /** Callback when search is submitted with the search term */
  onSearch: (searchTerm: string) => void;
  /** Callback when clear search button is clicked */
  onClearSearch: () => void;
}

/**
 * ListSearch - A standardized search component for list views
 *
 * Handles the common pattern of:
 * - Search input with icon
 * - Search button
 * - Results count display
 * - Clear search functionality
 *
 * The component manages its own input state internally and only notifies
 * the parent when search is submitted (via button or Enter key).
 *
 * @example
 * ```tsx
 * <ListSearch
 *   search={search}
 *   total={total}
 *   resourceName="user"
 *   onSearch={handleSearch}
 *   onClearSearch={handleClearSearch}
 * />
 * ```
 */
export function ListSearch({ search, total, resourceName, onSearch, onClearSearch }: ListSearchProps) {
  const [searchInput, setSearchInput] = useState('');

  // Pluralize resource name for placeholder (simple -s suffix)
  const pluralResourceName = resourceName.endsWith('s') ? resourceName : `${resourceName}s`;

  const handleSearch = () => {
    onSearch(searchInput);
  };

  const handleClear = () => {
    setSearchInput('');
    onClearSearch();
  };

  return (
    <Group mb="md">
      <TextInput
        placeholder={`Search ${total} ${total === 1 ? resourceName : pluralResourceName}...`}
        value={searchInput}
        onChange={(e) => setSearchInput(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
        leftSection={<IconSearch size={16} />}
        style={{ flex: 1 }}
      />
      <Button onClick={handleSearch}>Search</Button>
      {search && (
        <>
          <Text size="sm">
            {total} {total === 1 ? 'result' : 'results'}
          </Text>
          <Button variant="subtle" size="compact-sm" onClick={handleClear}>
            show all
          </Button>
        </>
      )}
    </Group>
  );
}
