import type { ReactNode } from 'react';

import { Button, Group, Loader, Paper, Stack, Text } from '@mantine/core';
import type { BaseRecord } from '@refinedev/core';
import { useGo, useOne } from '@refinedev/core';
import { IconArrowLeft } from '@tabler/icons-react';

import { EditButton } from '../buttons/EditButton.js';

interface ShowProps<TData> {
  resource: string;
  id: string;
  children: (data: TData) => ReactNode;
  /**
   * Whether to show the edit button
   * @default true
   */
  canEdit?: boolean;
  /**
   * Custom back path (defaults to list page)
   */
  backPath?: string;
  /**
   * Whether to show the back button
   * Set to false when used in modals
   * @default true
   */
  showBackButton?: boolean;
  /**
   * Padding for the Paper wrapper
   * Set to 0 when used in modals (which have their own padding)
   * @default "md"
   */
  p?: string | number;
}

/**
 * Show - Read-only view component using Refine's useOne hook
 *
 * This component provides a read-only display for a single resource record with:
 * - Data fetching via Refine's useOne hook
 * - Loading and error states
 * - Back button navigation
 * - Consistent layout with Edit pages
 * - Render prop pattern to pass data to children
 *
 * Usage:
 * ```tsx
 * <Show<User> resource="users" id={id}>
 *   {(user) => (
 *     <FieldSet legend="Basic Information">
 *       <TextField label="Email" value={user.email} />
 *       <TextField label="Name" value={user.name} />
 *     </FieldSet>
 *   )}
 * </Show>
 * ```
 *
 * With action buttons:
 * ```tsx
 * <Show<User> resource="users" id={id} canEdit>
 *   {(user) => <TextField label="Email" value={user.email} />}
 * </Show>
 * ```
 */
export function Show<TData extends BaseRecord>({
  resource,
  id,
  children,
  canEdit = false,
  backPath,
  showBackButton = true,
  p = 'md',
}: ShowProps<TData>) {
  const go = useGo();
  const { result, query } = useOne({
    resource,
    id,
  });

  if (query.isLoading) {
    return (
      <Stack align="center" justify="center" h={400}>
        <Loader size="lg" />
        <Text c="dimmed">Loading...</Text>
      </Stack>
    );
  }

  if (query.isError || !result) {
    return <Text c="red">Error loading {resource}</Text>;
  }

  const data = result as TData;

  const handleBack = () => {
    if (backPath) {
      go({ to: backPath, type: 'push' });
    } else {
      go({ to: { resource, action: 'list' }, type: 'push' });
    }
  };

  const showHeader = showBackButton || (canEdit && data.id !== undefined);

  return (
    <Paper p={p} maw={800} mx="auto" withBorder={false}>
      {showHeader && (
        <Group mb="md" justify="space-between">
          {showBackButton && (
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={handleBack}>
              Back to {resource}
            </Button>
          )}
          {canEdit && data.id !== undefined && <EditButton resource={resource} id={data.id} />}
        </Group>
      )}
      {children(data)}
    </Paper>
  );
}
