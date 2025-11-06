import { Button, type ButtonProps } from '@mantine/core';
import { useGo } from '@refinedev/core';
import { IconList } from '@tabler/icons-react';

export interface ListButtonProps extends Omit<ButtonProps, 'onClick'> {
  resource: string;
  hideText?: boolean;
}

/**
 * ListButton - Navigate to the list page for a resource
 *
 * When clicked, navigates to the list page for the specified resource.
 *
 * @example
 * ```tsx
 * <ListButton resource="users" />
 * ```
 */
export function ListButton({ resource, hideText = false, children, ...props }: ListButtonProps) {
  const go = useGo();

  const handleClick = () => {
    go({
      to: {
        resource,
        action: 'list',
      },
    });
  };

  return (
    <Button leftSection={<IconList size={18} />} onClick={handleClick} variant="default" {...props}>
      {children ?? (!hideText && 'List')}
    </Button>
  );
}
