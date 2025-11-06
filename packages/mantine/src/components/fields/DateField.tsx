import type { ReactNode } from 'react';

import dayjs from 'dayjs';

import { LabeledField } from './LabeledField.js';

export interface DateFieldProps {
  label?: string;
  value?: string | number | Date | null;
  format?: string;
}

/**
 * DateField - Display a formatted date
 *
 * Formats and displays a date value using dayjs.
 *
 * @example
 * ```tsx
 * // With label
 * <DateField label="Created" value={record.created_at} />
 *
 * // Without label
 * <DateField value={record.created_at} />
 *
 * // With custom format
 * <DateField
 *   label="Event Date"
 *   value={record.created_at}
 *   format="MMMM D, YYYY h:mm A"
 * />
 * ```
 */
export function DateField({ label, value, format = 'MMM D, YYYY' }: DateFieldProps): ReactNode {
  if (value == null) {
    if (label) {
      return <LabeledField label={label}>{null}</LabeledField>;
    }
    return null;
  }

  const date = dayjs(value);

  if (!date.isValid()) {
    if (label) {
      return <LabeledField label={label}>{null}</LabeledField>;
    }
    return null;
  }

  const content = <>{date.format(format)}</>;

  if (label) {
    return <LabeledField label={label}>{content}</LabeledField>;
  }

  return content;
}
