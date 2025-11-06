import type { ReactNode } from 'react';

import { Anchor, Skeleton, Text } from '@mantine/core';
import type { BaseRecord } from '@refinedev/core';
import { useGo, useOne } from '@refinedev/core';

import { LabeledField } from './LabeledField.js';

export interface ReferenceFieldProps<TReference extends BaseRecord = BaseRecord> {
  /**
   * Optional label to wrap the field
   */
  label?: string;

  /**
   * The resource name to fetch from (e.g., "organizations", "users")
   */
  reference: string;

  /**
   * The ID of the referenced record
   */
  id?: string | null;

  /**
   * Field to display from the referenced record (e.g., "name")
   * Ignored if children render function is provided
   */
  field?: keyof TReference;

  /**
   * Render function that receives the fetched record (overrides field)
   */
  children?: (record: TReference) => ReactNode;

  /**
   * Content to show when the reference is null/empty
   */
  empty?: ReactNode;

  /**
   * Whether to render as a link to the referenced record
   * - 'show': Link to show page
   * - 'edit': Link to edit page
   */
  link?: 'show' | 'edit';
}

/**
 * ReferenceField - Fetches and displays a referenced record
 *
 * Automatically fetches the referenced resource using Refine's useOne hook.
 * Multiple ReferenceFields on the same page will be batched by React Query.
 *
 * Simple usage
 * ```tsx
 * <ReferenceField reference="organizations" id={team.organization_id} field="name" />
 * ```
 *
 * With label
 * ```tsx
 * <ReferenceField label="Organization" reference="organizations" id={team.organization_id} field="name" />
 * ```
 *
 * Custom rendering
 * ```tsx
 * <ReferenceField reference="organizations" id={team.organization_id}>
 *   {(org) => <Text size="sm">{org.name}</Text>}
 * </ReferenceField>
 * ```
 *
 * With link to show page:
 * ```tsx
 * <ReferenceField label="Organization" reference="organizations" id={team.organization_id} field="name" link="show" />
 * ```
 */
export function ReferenceField<TReference extends BaseRecord = BaseRecord>({
  label,
  reference,
  id,
  field,
  children,
  empty = '—',
  link,
}: ReferenceFieldProps<TReference>) {
  // Use Refine's routing system
  const go = useGo();

  // Fetch the referenced record
  const { result, query } = useOne<TReference>({
    resource: reference,
    id: id || '',
    queryOptions: {
      enabled: !!id, // Only fetch if ID is provided
    },
  });

  const isLoading = query.isLoading;
  const isError = query.isError;

  // Render loading state
  if (isLoading) {
    const loadingSkeleton = <Skeleton height={20} width="60%" />;
    if (label) {
      return <LabeledField label={label}>{loadingSkeleton}</LabeledField>;
    }
    return loadingSkeleton;
  }

  // Render error state
  if (isError) {
    const errorContent = (
      <Text size="sm" c="red">
        Error loading {reference}
      </Text>
    );
    if (label) {
      return <LabeledField label={label}>{errorContent}</LabeledField>;
    }
    return errorContent;
  }

  // Render empty state (no ID or no record found)
  if (!id || !result) {
    const emptyContent = (
      <Text size="sm" c="dimmed">
        {empty}
      </Text>
    );
    if (label) {
      return <LabeledField label={label}>{emptyContent}</LabeledField>;
    }
    return emptyContent;
  }

  // Determine the content to render
  let content: ReactNode;

  if (children) {
    content = children(result);
  } else if (field) {
    const value = result[field];
    content = value !== undefined && value !== null ? String(value) : empty;
  } else {
    // If neither children nor field is provided, show the empty state
    content = (
      <Text size="sm" c="dimmed">
        {empty}
      </Text>
    );
  }

  // Wrap in link if requested
  if (link && id) {
    content = (
      <Anchor component="button" size="sm" onClick={() => go({ to: { resource: reference, action: link, id } })}>
        {content}
      </Anchor>
    );
  }

  // Wrap with label if provided
  if (label) {
    return <LabeledField label={label}>{content}</LabeledField>;
  }

  return <>{content}</>;
}
