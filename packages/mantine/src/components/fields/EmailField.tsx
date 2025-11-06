import { Anchor, type AnchorProps } from '@mantine/core';

import { LabeledField } from './LabeledField.js';

export interface EmailFieldProps extends Omit<AnchorProps, 'href' | 'children'> {
  label?: string;
  value?: string | null;
  children?: React.ReactNode;
}

/**
 * EmailField - Display a clickable email link
 *
 * Renders an email as a clickable mailto link.
 *
 * @example
 * ```tsx
 * // With label
 * <EmailField label="Email" value={record.email} />
 *
 * // Without label
 * <EmailField value={record.email} />
 *
 * // With custom text
 * <EmailField label="Contact" value={record.email}>Email Us</EmailField>
 * ```
 */
export function EmailField({ label, value, children, ...props }: EmailFieldProps) {
  if (!value) {
    if (label) {
      return <LabeledField label={label}>{null}</LabeledField>;
    }
    return null;
  }

  const content = (
    <Anchor href={`mailto:${value}`} {...props}>
      {children ?? value}
    </Anchor>
  );

  if (label) {
    return <LabeledField label={label}>{content}</LabeledField>;
  }

  return content;
}
