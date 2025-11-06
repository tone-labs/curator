import { Anchor } from '@mantine/core';
import { IconFile } from '@tabler/icons-react';

import { LabeledField } from './LabeledField.js';

export interface FileFieldProps {
  label?: string;
  value?: string | null;
  fileName?: string;
}

/**
 * FileField - Displays a file download link
 *
 * Usage:
 * ```tsx
 * // With label
 * <FileField label="Resume" value={user.resume_url} fileName="resume.pdf" />
 * <FileField label="Contract" value={doc.contract_url} />
 *
 * // Without label
 * <FileField value={user.resume_url} />
 * ```
 */
export function FileField({ label, value, fileName }: FileFieldProps) {
  // Extract filename from URL if not provided
  const displayName = fileName || (value ? value.split('/').pop() : null);

  const content = value ? (
    <Anchor href={value} target="_blank" rel="noopener noreferrer" size="sm">
      <IconFile size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
      {displayName || 'Download file'}
    </Anchor>
  ) : null;

  if (label) {
    return <LabeledField label={label}>{content}</LabeledField>;
  }

  return <>{content}</>;
}
