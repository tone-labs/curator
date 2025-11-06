import type { ReactNode } from 'react';

import { Button, Group, Modal, Stack } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

import { Create } from '../views/Create.js';

interface CreateModalProps<TData extends { id?: string | number }> {
  resource: string;
  opened: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  onSuccess?: (data: TData) => void;
}

/**
 * CreateModal - A modal wrapper for creating resources with Refine
 *
 * This component wraps Create in a modal for resource creation.
 * It provides a consistent modal interface with form state, submission,
 * and success/error handling.
 *
 * Usage:
 * ```tsx
 * <CreateModal
 *   resource="users"
 *   opened={opened}
 *   onClose={onClose}
 * >
 *   <TextInput source="email" />
 *   <TextInput source="first_name" />
 * </CreateModal>
 * ```
 */
export function CreateModal<TData extends { id?: string | number }>({
  resource,
  opened,
  onClose,
  title,
  children,
  onSuccess,
}: CreateModalProps<TData>) {
  const displayTitle = title || `Create ${resource.charAt(0).toUpperCase() + resource.slice(1, -1)}`;

  const handleSuccess = (data: TData) => {
    onClose();
    onSuccess?.(data);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={displayTitle} size="lg">
      <Create resource={resource} onSuccess={handleSuccess}>
        {({ isSubmitting, submit }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <Stack gap="md">
              {children}
              <Group justify="flex-end" gap="sm" mt="md">
                <Button variant="subtle" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" leftSection={<IconCheck size={16} />} loading={isSubmitting}>
                  Create
                </Button>
              </Group>
            </Stack>
          </form>
        )}
      </Create>
    </Modal>
  );
}
