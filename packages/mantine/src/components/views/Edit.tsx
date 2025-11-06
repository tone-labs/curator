import type { ReactNode } from 'react';

import { Button, Group, Loader, Paper, Stack, Text } from '@mantine/core';
import type { BaseRecord } from '@refinedev/core';
import { useGo, useOne } from '@refinedev/core';
import { IconArrowLeft } from '@tabler/icons-react';

import { ShowButton } from '../buttons/ShowButton.js';

interface EditContextData {
  resource: string;
  id: string;
}

interface EditProps<TData> {
  resource: string;
  id: string;
  children: (data: TData, context: EditContextData) => ReactNode;
  backPath?: string;
  /**
   * Whether to show the show button
   * @default false
   */
  canShow?: boolean;
}

/**
 * Edit - Edit page layout using Refine's useOne hook
 *
 * This component provides a consistent layout for edit pages with:
 * - Data fetching via Refine's useOne hook
 * - Loading and error states
 * - Back button navigation
 * - Render prop pattern to pass data to children
 *
 * Usage:
 * ```tsx
 * <Edit<User> resource="users" id={id}>
 *   {(user, { resource, id }) => (
 *     <RefineEditForm data={user} resource={resource} id={id}>
 *       <TextInput source="email" />
 *       <TextInput source="first_name" />
 *     </RefineEditForm>
 *   )}
 * </Edit>
 * ```
 *
 * With action buttons:
 * ```tsx
 * <Edit<User> resource="users" id={id} canShow>
 *   {(user, { resource, id }) => <RefineEditForm data={user} resource={resource} id={id}>...</RefineEditForm>}
 * </Edit>
 * ```
 */
export function Edit<TData extends BaseRecord>({
  resource,
  id,
  children,
  backPath,
  canShow = false,
}: EditProps<TData>) {
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

  return (
    <Paper p="md" maw={800} mx="auto" withBorder={false}>
      <Group mb="md" justify="space-between">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={handleBack}>
          Back to {resource}
        </Button>
        {canShow && data.id !== undefined && <ShowButton resource={resource} id={data.id} />}
      </Group>
      {children(data, { resource, id })}
    </Paper>
  );
}
