import { LabeledField } from './LabeledField.js';

export interface TextFieldProps {
  label?: string;
  value?: unknown;
}

/**
 * TextField - Simple presentational component for displaying text
 *
 * Usage:
 * ```tsx
 * // With label
 * <TextField label="Email" value={user.email} />
 * <TextField label="Created" value={user.created_at} />
 *
 * // Without label
 * <TextField value={user.email} />
 * ```
 */
export function TextField({ label, value }: TextFieldProps) {
  const displayValue = value !== undefined && value !== null ? String(value) : undefined;

  if (label) {
    return <LabeledField label={label}>{displayValue}</LabeledField>;
  }

  return <>{displayValue ?? '—'}</>;
}
