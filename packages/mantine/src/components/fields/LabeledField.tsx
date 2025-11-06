import type { ReactNode } from 'react';

import { Stack, Text } from '@mantine/core';

export interface LabeledFieldProps {
  label: string;
  children?: ReactNode;
}

/**
 * LabeledField - Base component for displaying labeled content
 *
 * Usage:
 * ```tsx
 * <LabeledField label="Email">
 *   <UrlField value={user.email} />
 * </LabeledField>
 * <LabeledField label="Created">
 *   <DateField value={user.created_at} />
 * </LabeledField>
 * ```
 */
export function LabeledField({ label, children }: LabeledFieldProps) {
  return (
    <Stack gap={4}>
      <Text size="sm" fw={500}>
        {label}
      </Text>
      <Text size="sm" c="dimmed">
        {children ?? '—'}
      </Text>
    </Stack>
  );
}
