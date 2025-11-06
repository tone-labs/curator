import { Button, type ButtonProps } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';

export interface SaveButtonProps extends Omit<ButtonProps, 'type'> {
  hideText?: boolean;
}

/**
 * SaveButton - A submit button for forms
 *
 * Renders a button with a save icon that submits the form when clicked.
 * Used primarily in Edit and Create views.
 *
 * @example
 * ```tsx
 * <form onSubmit={handleSubmit}>
 *   <TextInput name="title" />
 *   <SaveButton />
 * </form>
 * ```
 */
export function SaveButton({ hideText = false, children, ...props }: SaveButtonProps) {
  return (
    <Button type="submit" leftSection={<IconDeviceFloppy size={18} />} {...props}>
      {children ?? (!hideText && 'Save')}
    </Button>
  );
}
