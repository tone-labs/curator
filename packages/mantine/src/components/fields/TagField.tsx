import type { ReactNode } from 'react';

import { Badge, type BadgeProps, Group } from '@mantine/core';

import { LabeledField } from './LabeledField.js';

export interface TagFieldProps extends Omit<BadgeProps, 'children'> {
  label?: string;
  value?: string | string[] | null;
}

/**
 * TagField - Display tags/labels as badges
 *
 * Renders a single tag or multiple tags as Mantine Badge components.
 *
 * @example
 * ```tsx
 * // With label
 * <TagField label="Status" value="active" />
 * <TagField label="Roles" value={["admin", "user"]} />
 *
 * // Without label
 * <TagField value="active" />
 * <TagField value={["admin", "user"]} color="blue" />
 * ```
 */
export function TagField({ label, value, ...props }: TagFieldProps): ReactNode {
  if (!value) {
    if (label) {
      return <LabeledField label={label}>{null}</LabeledField>;
    }
    return null;
  }

  const tags = Array.isArray(value) ? value : [value];

  if (tags.length === 0) {
    if (label) {
      return <LabeledField label={label}>{null}</LabeledField>;
    }
    return null;
  }

  const content =
    tags.length === 1 ? (
      <Badge {...props}>{tags[0]}</Badge>
    ) : (
      <Group gap="xs">
        {tags.map((tag) => (
          <Badge key={tag} {...props}>
            {tag}
          </Badge>
        ))}
      </Group>
    );

  if (label) {
    return <LabeledField label={label}>{content}</LabeledField>;
  }

  return content;
}
