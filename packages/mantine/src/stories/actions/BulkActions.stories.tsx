import { useState } from 'react';

import { Stack, Text } from '@mantine/core';
import type { BaseKey } from '@refinedev/core';
import { Refine } from '@refinedev/core';
import type { Meta } from '@storybook/react';
import { action } from 'storybook/actions';

import { type BulkAction, BulkActions } from '../../components/actions/BulkActions';
import { useRecordSelection } from '../../hooks/useRecordSelection';
import { createMockDataProvider, createMockRecords } from '../__mocks__/dataProvider';

const mockDataProvider = createMockDataProvider(100);

const meta = {
  title: 'Actions/BulkActions',
  component: BulkActions,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Refine dataProvider={mockDataProvider} resources={[{ name: 'users' }]} options={{ disableTelemetry: true }}>
        <Story />
      </Refine>
    ),
  ],
} satisfies Meta<typeof BulkActions>;

export default meta;

// Interactive example with state
function BulkActionsExample() {
  const pageSize = 10;
  const totalItems = 100;
  const mockRecords = createMockRecords(pageSize);

  const { selectedIds, selectedRecords, onSelectedRecordsChange, clearSelection, allSelected, selectAll } =
    useRecordSelection(mockRecords);

  const bulkActions: BulkAction[] = [
    {
      label: 'Activate selected',
      value: 'activate',
      onExecute: async (ids) => {
        action('activate')(ids);
        clearSelection();
      },
    },
    {
      label: 'Deactivate selected',
      value: 'deactivate',
      onExecute: async (ids) => {
        action('deactivate')(ids);
        clearSelection();
      },
    },
    {
      label: 'Delete selected',
      value: 'delete',
      onExecute: async (ids) => {
        action('delete')(ids);
        clearSelection();
      },
    },
  ];

  // Simulate checkbox selection
  const handleSelectItem = (id: string) => {
    const record = mockRecords.find((r) => r.id === id);
    if (!record) return;

    const isSelected = selectedIds.includes(id);
    if (isSelected) {
      onSelectedRecordsChange(selectedRecords.filter((r) => r.id !== id));
    } else {
      onSelectedRecordsChange([...selectedRecords, record]);
    }
  };

  // Handle select all on page
  const handleSelectPage = (checked: boolean) => {
    if (checked) {
      onSelectedRecordsChange(mockRecords);
    } else {
      onSelectedRecordsChange([]);
    }
  };

  const allPageSelected = selectedIds.length === pageSize;

  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        Showing {pageSize} of {totalItems} total items
      </Text>

      <BulkActions
        resource="users"
        selectedIds={selectedIds}
        actions={bulkActions}
        pageSize={pageSize}
        totalItems={totalItems}
        allSelected={allSelected}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
      />

      <Stack gap="xs">
        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={allPageSelected}
            onChange={(e) => handleSelectPage(e.target.checked)}
            style={{ fontWeight: 500 }}
          />
          <Text size="sm" fw={500}>
            Select all on page
          </Text>
        </label>

        <Text size="sm" fw={500} mt="xs">
          Items on this page:
        </Text>
        {mockRecords.map((record) => (
          <label
            key={record.id}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginLeft: 16,
            }}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(record.id)}
              onChange={() => handleSelectItem(record.id)}
            />
            <Text size="sm">{record.name}</Text>
          </label>
        ))}
      </Stack>
    </Stack>
  );
}

export const Interactive = {
  render: () => <BulkActionsExample />,
};

export const WithSelection = {
  render: () => {
    const mockRecords = createMockRecords(25);

    const { selectedIds, clearSelection, allSelected, selectAll } = useRecordSelection(mockRecords);

    // Pre-select first 5 items
    const [initialized, setInitialized] = useState(false);
    if (!initialized && selectedIds.length === 0) {
      setInitialized(true);
    }

    const bulkActions: BulkAction[] = [
      {
        label: 'Activate',
        value: 'activate',
        onExecute: async (ids: BaseKey[]) => {
          action('activate')(ids);
        },
      },
      {
        label: 'Delete',
        value: 'delete',
        onExecute: async (ids: BaseKey[]) => {
          action('delete')(ids);
        },
      },
    ];

    return (
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          This story shows the component with 3 pre-selected items out of 25 on the current page.
        </Text>
        <BulkActions
          resource="users"
          selectedIds={['1', '2', '3']}
          actions={bulkActions}
          pageSize={25}
          totalItems={100}
          allSelected={allSelected}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
        />
      </Stack>
    );
  },
};

export const AllSelected = {
  render: () => {
    const mockRecords = createMockRecords(25);

    const { selectedIds, clearSelection, selectAll } = useRecordSelection(mockRecords);

    const bulkActions: BulkAction[] = [
      {
        label: 'Activate',
        value: 'activate',
        onExecute: async (ids: BaseKey[]) => {
          action('activate')(ids);
        },
      },
    ];

    return (
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          This story shows "all selected" mode where all 100 items across all pages are selected.
        </Text>
        <BulkActions
          resource="users"
          selectedIds={selectedIds}
          actions={bulkActions}
          pageSize={25}
          totalItems={100}
          allSelected={true}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
        />
      </Stack>
    );
  },
};

export const NoSelection = {
  args: {
    resource: 'users',
    selectedIds: [],
    actions: [
      {
        label: 'Activate',
        value: 'activate',
        onExecute: action('activate'),
      },
      {
        label: 'Delete',
        value: 'delete',
        onExecute: action('delete'),
      },
    ],
    pageSize: 25,
    totalItems: 100,
    allSelected: false,
  },
};
