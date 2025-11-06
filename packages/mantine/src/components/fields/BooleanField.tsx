import type { ReactNode } from 'react';

import { IconCheck, IconX } from '@tabler/icons-react';

import { LabeledField } from './LabeledField.js';

export interface BooleanFieldProps {
  label?: string;
  value?: boolean | null;
  trueIcon?: ReactNode;
  falseIcon?: ReactNode;
  valueLabelTrue?: string;
  valueLabelFalse?: string;
}

/**
 * BooleanField - Display a boolean value with icons
 *
 * Shows a checkmark for true values and an X for false values.
 * Can be customized with different icons or text labels.
 *
 * @example
 * ```tsx
 * // With label
 * <BooleanField label="Active" value={record.is_active} />
 *
 * // Without label
 * <BooleanField value={record.is_active} />
 *
 * // With custom labels
 * <BooleanField
 *   label="Status"
 *   value={record.is_active}
 *   valueLabelTrue="Active"
 *   valueLabelFalse="Inactive"
 * />
 * ```
 */
export function BooleanField({
  label,
  value,
  trueIcon,
  falseIcon,
  valueLabelTrue,
  valueLabelFalse,
}: BooleanFieldProps): ReactNode {
  if (value == null) {
    if (label) {
      return <LabeledField label={label}>{null}</LabeledField>;
    }
    return null;
  }

  const content = value ? (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--mantine-color-green-6)' }}>
      {trueIcon ?? <IconCheck size={18} />}
      {valueLabelTrue && <span>{valueLabelTrue}</span>}
    </span>
  ) : (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--mantine-color-red-6)' }}>
      {falseIcon ?? <IconX size={18} />}
      {valueLabelFalse && <span>{valueLabelFalse}</span>}
    </span>
  );

  if (label) {
    return <LabeledField label={label}>{content}</LabeledField>;
  }

  return content;
}
