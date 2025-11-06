import type { ReactNode } from 'react';

import { Fieldset as MantineFieldset, Stack } from '@mantine/core';

export interface SimpleFieldSetProps {
  legend?: string;
  children: ReactNode;
}

/**
 * SimpleFieldSet - Component for grouping related form fields
 *
 * Wraps Mantine's Fieldset component with consistent spacing between fields.
 *
 * @example
 * ```tsx
 * <SimpleFieldSet legend="Basic Information">
 *   <TextInput source="email" label="Email" />
 *   <TextInput source="first_name" label="First Name" />
 * </SimpleFieldSet>
 * <SimpleFieldSet legend="Permissions">
 *   <SwitchInput source="is_active" label="Active" />
 *   <SwitchInput source="is_superuser" label="Superuser" />
 * </SimpleFieldSet>
 * ```
 */
export function SimpleFieldSet({ legend, children }: SimpleFieldSetProps) {
  return (
    <MantineFieldset legend={legend}>
      <Stack gap="md">{children}</Stack>
    </MantineFieldset>
  );
}
