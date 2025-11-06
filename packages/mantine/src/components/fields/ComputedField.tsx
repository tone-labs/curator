import type { ReactNode } from 'react';

import { LabeledField } from './LabeledField.js';

export interface ComputedFieldProps<T> {
  label?: string;
  record?: T;
  children: (record: T) => ReactNode;
}

/**
 * ComputedField - Displays computed/derived values using a children render prop
 *
 * Usage:
 * ```tsx
 * // With label
 * <ComputedField label="Full Name" record={user}>
 *   {(user) => `${user.first_name} ${user.last_name}`}
 * </ComputedField>
 *
 * <ComputedField label="Status" record={order}>
 *   {(order) => (
 *     <Badge color={order.is_paid ? 'green' : 'red'}>
 *       {order.is_paid ? 'Paid' : 'Unpaid'}
 *     </Badge>
 *   )}
 * </ComputedField>
 *
 * // Without label
 * <ComputedField record={user}>
 *   {(user) => `${user.first_name} ${user.last_name}`}
 * </ComputedField>
 * ```
 */
export function ComputedField<T>({ label, record, children }: ComputedFieldProps<T>) {
  const content = record ? children(record) : null;

  if (label) {
    return <LabeledField label={label}>{content}</LabeledField>;
  }

  return <>{content}</>;
}
