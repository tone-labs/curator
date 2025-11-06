import { Button, type ButtonProps } from '@mantine/core';
import { useGo } from '@refinedev/core';
import { IconEdit } from '@tabler/icons-react';

export interface EditButtonProps extends Omit<ButtonProps, 'onClick'> {
  resource: string;
  id: string | number;
  hideText?: boolean;
}

/**
 * EditButton - Navigate to the edit page for a resource
 *
 * When clicked, navigates to the edit page for the specified resource and id.
 *
 * @example
 * ```tsx
 * <EditButton resource="users" id={record.id} />
 * ```
 */
export function EditButton({ resource, id, hideText = false, children, ...props }: EditButtonProps) {
  const go = useGo();

  const handleClick = () => {
    go({
      to: {
        resource,
        action: 'edit',
        id,
      },
    });
  };

  return (
    <Button leftSection={<IconEdit size={18} />} onClick={handleClick} variant="default" {...props}>
      {children ?? (!hideText && 'Edit')}
    </Button>
  );
}
