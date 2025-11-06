import type React from 'react';
import { useState } from 'react';

import {
  ActionIcon,
  Box,
  type BoxProps,
  Container,
  Group,
  type GroupProps,
  Stack,
  type StackProps,
  Title,
  Tooltip,
} from '@mantine/core';
import { useRefineContext, useResourceParams, useTranslate, useUserFriendlyName } from '@refinedev/core';
import { type RefineCrudListProps, RefinePageHeaderClassNames } from '@refinedev/ui-types';
import { IconArrowsDiagonal2, IconArrowsDiagonalMinimize2 } from '@tabler/icons-react';

import { CreateButton, type CreateButtonProps } from '../buttons/CreateButton.js';

export type ListProps = RefineCrudListProps<CreateButtonProps, GroupProps, StackProps, GroupProps, BoxProps> & {
  fullWidth?: boolean;
  showFullWidthToggle?: boolean;
};

/**
 * List - A list page layout component using Refine's hooks
 *
 * This component provides a consistent layout for list pages with:
 * - Breadcrumb navigation
 * - Dynamic title
 * - Create button (optional)
 * - Custom header buttons
 * - Optional full-width mode (default: false)
 */
export const List: React.FC<ListProps> = (props) => {
  const {
    canCreate,
    children,
    createButtonProps: createButtonPropsFromProps,
    resource: resourceFromProps,
    wrapperProps,
    contentProps,
    headerProps,
    headerButtonProps,
    headerButtons: headerButtonsFromProps,
    breadcrumb: breadcrumbFromProps,
    title,
    fullWidth: fullWidthProp = false,
    showFullWidthToggle = false,
  } = props;

  const [isFullWidth, setIsFullWidth] = useState(fullWidthProp);
  const fullWidth = showFullWidthToggle ? isFullWidth : fullWidthProp;

  const translate = useTranslate();
  const { options: { breadcrumb: globalBreadcrumb } = {} } = useRefineContext();

  const getUserFriendlyName = useUserFriendlyName();

  const { resource, identifier } = useResourceParams({
    ...(resourceFromProps && { resource: resourceFromProps }),
  });

  const isCreateButtonVisible = canCreate ?? (!!resource?.create || createButtonPropsFromProps);

  const breadcrumb = typeof breadcrumbFromProps === 'undefined' ? globalBreadcrumb : breadcrumbFromProps;

  const createButtonProps: CreateButtonProps | undefined = isCreateButtonVisible
    ? {
        size: 'sm',
        ...(identifier && { resource: identifier }),
        ...createButtonPropsFromProps,
      }
    : undefined;

  const defaultHeaderButtons = <>{isCreateButtonVisible ? <CreateButton {...createButtonProps} /> : null}</>;

  const breadcrumbComponent = typeof breadcrumb !== 'undefined' ? breadcrumb : null; // <Breadcrumb /> removed for now

  const headerButtons = headerButtonsFromProps
    ? typeof headerButtonsFromProps === 'function'
      ? headerButtonsFromProps({
          defaultButtons: defaultHeaderButtons,
          createButtonProps,
        })
      : headerButtonsFromProps
    : defaultHeaderButtons;

  const content = (
    <Stack p="none" {...wrapperProps}>
      <Group justify="space-between" align="center" {...headerProps}>
        <Group gap="sm">
          <Stack gap="xs">
            {breadcrumbComponent}
            {title ?? (
              <Title order={3} tt="capitalize" className={RefinePageHeaderClassNames.Title}>
                {translate(
                  `${identifier}.titles.list`,
                  getUserFriendlyName(resource?.meta?.label ?? identifier, 'plural'),
                )}
              </Title>
            )}
          </Stack>
          {showFullWidthToggle && (
            <Tooltip label={fullWidth ? 'Constrain width' : 'Full width'}>
              <ActionIcon
                variant="default"
                size="lg"
                onClick={() => setIsFullWidth(!isFullWidth)}
                aria-label="Toggle full width"
              >
                {fullWidth ? <IconArrowsDiagonalMinimize2 size={18} /> : <IconArrowsDiagonal2 size={18} />}
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
        <Group gap="xs" {...headerButtonProps}>
          {headerButtons}
        </Group>
      </Group>
      <Box {...contentProps}>{children}</Box>
    </Stack>
  );

  return fullWidth ? (
    <Box p="sm">{content}</Box>
  ) : (
    <Container size="xl" p="sm">
      {content}
    </Container>
  );
};
