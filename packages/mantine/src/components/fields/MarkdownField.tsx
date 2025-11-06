import type { ReactNode } from 'react';

import { Box, type BoxProps } from '@mantine/core';
import Markdown from 'react-markdown';

import { LabeledField } from './LabeledField.js';

export interface MarkdownFieldProps extends Omit<BoxProps, 'children'> {
  label?: string;
  value?: string | null;
}

/**
 * MarkdownField - Display markdown content
 *
 * Renders markdown text as formatted HTML.
 *
 * @example
 * ```tsx
 * // With label
 * <MarkdownField label="Description" value={record.description} />
 *
 * // Without label
 * <MarkdownField value={record.description} />
 * ```
 */
export function MarkdownField({ label, value, ...props }: MarkdownFieldProps): ReactNode {
  if (!value) {
    if (label) {
      return <LabeledField label={label}>{null}</LabeledField>;
    }
    return null;
  }

  const content = (
    <Box {...props}>
      <Markdown>{value}</Markdown>
    </Box>
  );

  if (label) {
    return <LabeledField label={label}>{content}</LabeledField>;
  }

  return content;
}
