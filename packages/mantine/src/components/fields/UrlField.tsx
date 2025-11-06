import { Anchor, type AnchorProps } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';

import { LabeledField } from './LabeledField.js';

export interface UrlFieldProps extends Omit<AnchorProps, 'href' | 'children'> {
  label?: string;
  value?: string | null;
  showIcon?: boolean;
  children?: React.ReactNode;
}

/**
 * UrlField - Display a clickable URL link
 *
 * Renders a URL as a clickable anchor tag that opens in a new tab.
 *
 * @example
 * ```tsx
 * // With label
 * <UrlField label="Website" value={record.website} />
 *
 * // Without label
 * <UrlField value={record.website} />
 *
 * // Without external link icon
 * <UrlField label="Website" value={record.website} showIcon={false} />
 * ```
 */
export function UrlField({ label, value, showIcon = true, children, ...props }: UrlFieldProps) {
  if (!value) {
    if (label) {
      return <LabeledField label={label}>{null}</LabeledField>;
    }
    return null;
  }

  const content = (
    <Anchor href={value} target="_blank" rel="noopener noreferrer" {...props}>
      {children ?? value}
      {showIcon && <IconExternalLink size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />}
    </Anchor>
  );

  if (label) {
    return <LabeledField label={label}>{content}</LabeledField>;
  }

  return content;
}
