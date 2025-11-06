import { Badge, Group } from '@mantine/core';

import { LabeledField } from './LabeledField.js';

export interface ArrayFieldProps {
  label?: string;
  value?: string[] | null;
  color?: string;
}

/**
 * ArrayField - Displays an array of strings as badges/chips
 *
 * Usage:
 * ```tsx
 * // With label
 * <ArrayField label="Roles" value={user.roles} />
 * <ArrayField label="Tags" value={post.tags} color="blue" />
 *
 * // Without label
 * <ArrayField value={user.roles} />
 * ```
 */
export function ArrayField({ label, value, color }: ArrayFieldProps) {
  const content =
    value && value.length > 0 ? (
      <Group gap="xs">
        {value.map((item) => (
          <Badge key={item} color={color} variant="light">
            {item}
          </Badge>
        ))}
      </Group>
    ) : null;

  if (label) {
    return <LabeledField label={label}>{content}</LabeledField>;
  }

  return <>{content}</>;
}
