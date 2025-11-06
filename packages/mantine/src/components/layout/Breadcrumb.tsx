import type { ReactNode } from 'react';

import {
  Anchor,
  Group,
  Breadcrumbs as MantineBreadcrumbs,
  type BreadcrumbsProps as MantineBreadcrumbsProps,
  Text,
} from '@mantine/core';
import { useBreadcrumb, useLink } from '@refinedev/core';
import type { RefineBreadcrumbProps } from '@refinedev/ui-types';

export interface BreadcrumbProps extends RefineBreadcrumbProps<MantineBreadcrumbsProps> {
  showIndex?: boolean;
  indexLabel?: string;
  indexPath?: string;
  hideIcons?: boolean;
  minItems?: number;
}

/**
 * Breadcrumb - Router-agnostic breadcrumb navigation
 *
 * Uses Refine's routing abstractions to generate breadcrumbs automatically
 * based on the current resource and action.
 *
 * @example
 * ```tsx
 * <Breadcrumb indexPath="/admin" />
 * <Breadcrumb showIndex={false} />
 * <Breadcrumb indexPath="/dashboard" indexLabel="Dashboard" />
 * <Breadcrumb hideIcons minItems={1} />
 * ```
 */
export function Breadcrumb({
  breadcrumbProps,
  showIndex = true,
  indexLabel = 'Index',
  indexPath = '/admin',
  hideIcons = false,
  meta,
  minItems = 0,
}: BreadcrumbProps): ReactNode {
  const { breadcrumbs } = useBreadcrumb({ meta });
  const Link = useLink();

  // Always show breadcrumbs if showIndex is true (even on index page)
  const hasContent = breadcrumbs.length > 0 || showIndex;

  if (!hasContent || breadcrumbs.length < minItems) {
    return null;
  }

  return (
    <MantineBreadcrumbs aria-label="breadcrumb" {...breadcrumbProps}>
      {showIndex && (
        // biome-ignore lint/suspicious/noExplicitAny: Link is a valid component
        <Anchor component={Link as any} href={indexPath} size="sm">
          {indexLabel}
        </Anchor>
      )}
      {breadcrumbs.map(({ label, icon, href }, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <Group key={label} gap={4} align="center" wrap="nowrap">
            {!hideIcons && icon}
            {href && !isLast ? (
              // biome-ignore lint/suspicious/noExplicitAny: Link is a valid component
              <Anchor component={Link as any} href={href} size="sm">
                {label}
              </Anchor>
            ) : (
              <Text size="sm">{label}</Text>
            )}
          </Group>
        );
      })}
    </MantineBreadcrumbs>
  );
}
