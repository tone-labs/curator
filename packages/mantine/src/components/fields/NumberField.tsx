import type { ReactNode } from 'react';

import { LabeledField } from './LabeledField.js';

export interface NumberFieldProps {
  label?: string;
  value?: number | string | null;
  format?: Intl.NumberFormatOptions;
  locale?: string;
}

/**
 * NumberField - Display a formatted number
 *
 * Formats and displays a numeric value using Intl.NumberFormat.
 *
 * @example
 * ```tsx
 * // With label
 * <NumberField label="Price" value={record.price} />
 *
 * // Without label
 * <NumberField value={record.price} />
 *
 * // As currency
 * <NumberField
 *   label="Price"
 *   value={record.price}
 *   format={{ style: 'currency', currency: 'USD' }}
 * />
 *
 * // As percentage
 * <NumberField
 *   label="Discount"
 *   value={0.15}
 *   format={{ style: 'percent' }}
 * />
 * ```
 */
export function NumberField({ label, value, format, locale }: NumberFieldProps): ReactNode {
  if (value == null) {
    if (label) {
      return <LabeledField label={label}>{null}</LabeledField>;
    }
    return null;
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (Number.isNaN(numValue)) {
    if (label) {
      return <LabeledField label={label}>{null}</LabeledField>;
    }
    return null;
  }

  const content = <>{new Intl.NumberFormat(locale, format).format(numValue)}</>;

  if (label) {
    return <LabeledField label={label}>{content}</LabeledField>;
  }

  return content;
}
