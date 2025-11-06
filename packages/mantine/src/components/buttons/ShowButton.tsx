import { Button, type ButtonProps } from '@mantine/core';
import { useGo } from '@refinedev/core';
import { IconEye } from '@tabler/icons-react';

export interface ShowButtonProps extends Omit<ButtonProps, 'onClick'> {
  resource: string;
  id: string | number;
  hideText?: boolean;
}

/**
 * ShowButton - Navigate to the show/detail page for a resource
 *
 * When clicked, navigates to the show page for the specified resource and id.
 *
 * @example
 * ```tsx
 * <ShowButton resource="users" id={record.id} />
 * ```
 */
export function ShowButton({ resource, id, hideText = false, children, ...props }: ShowButtonProps) {
  const go = useGo();

  const handleClick = () => {
    go({
      to: {
        resource,
        action: 'show',
        id,
      },
    });
  };

  return (
    <Button leftSection={<IconEye size={18} />} onClick={handleClick} variant="default" {...props}>
      {children ?? (!hideText && 'Show')}
    </Button>
  );
}
