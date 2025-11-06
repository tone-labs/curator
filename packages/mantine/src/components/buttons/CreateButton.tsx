import type React from 'react';

import { ActionIcon, type ActionIconProps, Button, type ButtonProps } from '@mantine/core';
import { useCreateButton } from '@refinedev/core';
import { RefineButtonClassNames, RefineButtonTestIds } from '@refinedev/ui-types';
import { IconPlus } from '@tabler/icons-react';

export interface CreateButtonProps {
  resource?: string;
  hideText?: boolean;
  accessControl?: {
    enabled?: boolean;
    hideIfUnauthorized?: boolean;
  };
  meta?: Record<string, unknown>;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  // Mantine props
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  color?: ButtonProps['color'];
  disabled?: boolean;
}

/**
 * CreateButton - A modal-based create button that uses Refine's useCreateButton hook
 *
 * Unlike the standard Refine CreateButton which navigates to a create route,
 * this version triggers a modal dialog for inline creation.
 */
export const CreateButton: React.FC<CreateButtonProps> = ({
  resource,
  hideText = false,
  accessControl,
  meta,
  onClick,
  variant = 'filled',
  size = 'sm',
  color = 'blue',
  disabled: disabledFromProps,
  ...rest
}) => {
  const { label, title, disabled, hidden } = useCreateButton({
    ...(resource && { resource }),
    ...(accessControl && { accessControl }),
    ...(meta && { meta }),
  });

  const isDisabled = disabled || disabledFromProps;

  if (hidden) return null;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const icon = <IconPlus size={18} />;

  return hideText ? (
    <ActionIcon
      variant={variant}
      size={size}
      color={color}
      disabled={isDisabled}
      aria-label={label}
      onClick={handleClick}
      data-testid={RefineButtonTestIds.CreateButton}
      className={RefineButtonClassNames.CreateButton}
      {...(rest as Omit<ActionIconProps, 'children'>)}
      title={title}
    >
      {icon}
    </ActionIcon>
  ) : (
    <Button
      variant={variant}
      size={size}
      color={color}
      disabled={isDisabled}
      leftSection={icon}
      onClick={handleClick}
      data-testid={RefineButtonTestIds.CreateButton}
      className={RefineButtonClassNames.CreateButton}
      {...(rest as Omit<ButtonProps, 'children'>)}
      title={title}
    >
      {label}
    </Button>
  );
};
