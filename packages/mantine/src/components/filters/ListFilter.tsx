import type React from 'react';

import { Card, Stack, Title } from '@mantine/core';

export interface ListFilterProps {
  title?: string;
  children: React.ReactNode;
}

/**
 * ListFilter - Container for sidebar filters (similar to Django admin's list_filter)
 *
 * This component provides a sidebar container for filter options.
 * Use with specific filter components like BooleanFilter, DateRangeFilter, etc.
 *
 * Example:
 * ```tsx
 * <ListFilter title="Filter">
 *   <BooleanFilter field="is_active" label="Active Status" />
 *   <DateRangeFilter field="created_at" label="Date Joined" />
 * </ListFilter>
 * ```
 */
export const ListFilter: React.FC<ListFilterProps> = ({ title = 'Filter', children }) => {
  return (
    <Card withBorder padding="md" radius="md">
      <Stack gap="md">
        {title && (
          <Title order={5} fw={600}>
            {title}
          </Title>
        )}
        {children}
      </Stack>
    </Card>
  );
};
