import { Button, type ButtonProps } from '@mantine/core';
import { useInvalidate } from '@refinedev/core';
import { IconRefresh } from '@tabler/icons-react';

export interface RefreshButtonProps extends Omit<ButtonProps, 'onClick'> {
  resource: string;
  hideText?: boolean;
}

/**
 * RefreshButton - Invalidate and refetch resource data
 *
 * When clicked, invalidates the cache for the specified resource,
 * causing all queries for that resource to refetch.
 *
 * @example
 * ```tsx
 * <RefreshButton resource="users" />
 * ```
 */
export function RefreshButton({ resource, hideText = false, children, ...props }: RefreshButtonProps) {
  const invalidate = useInvalidate();

  const handleClick = () => {
    invalidate({
      resource,
      invalidates: ['list', 'detail'],
    });
  };

  return (
    <Button leftSection={<IconRefresh size={18} />} onClick={handleClick} variant="default" {...props}>
      {children ?? (!hideText && 'Refresh')}
    </Button>
  );
}
