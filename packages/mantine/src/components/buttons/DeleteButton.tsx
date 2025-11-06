import { Button, type ButtonProps } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useDelete } from '@refinedev/core';
import { IconTrash } from '@tabler/icons-react';

export interface DeleteButtonProps extends Omit<ButtonProps, 'onClick'> {
  resource: string;
  id: string | number;
  hideText?: boolean;
  onSuccess?: () => void;
  confirmTitle?: string;
  confirmMessage?: string;
}

/**
 * DeleteButton - Delete a resource record
 *
 * When clicked, deletes the specified resource record.
 * Shows a confirmation dialog before deleting.
 *
 * @example
 * ```tsx
 * <DeleteButton
 *   resource="users"
 *   id={record.id}
 *   onSuccess={() => navigate('/users')}
 * />
 * ```
 */
export function DeleteButton({
  resource,
  id,
  hideText = false,
  onSuccess,
  confirmTitle = 'Are you sure?',
  confirmMessage = 'This action cannot be undone.',
  children,
  ...props
}: DeleteButtonProps) {
  const { mutate, mutation } = useDelete();

  const handleClick = () => {
    modals.openConfirmModal({
      title: confirmTitle,
      children: confirmMessage,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        mutate(
          { resource, id },
          {
            onSuccess: () => {
              onSuccess?.();
            },
          },
        );
      },
    });
  };

  return (
    <Button
      leftSection={<IconTrash size={18} />}
      onClick={handleClick}
      color="red"
      variant="light"
      loading={mutation.isPending}
      {...props}
    >
      {children ?? (!hideText && 'Delete')}
    </Button>
  );
}
