import { useState } from 'react';

import { Stack, Text } from '@mantine/core';
import type { BaseKey } from '@refinedev/core';
import { type DataProvider, type GetListParams, Refine } from '@refinedev/core';
import type { Meta } from '@storybook/react';

import { type BulkAction, BulkActions } from '../../components/actions/BulkActions';
import { useTableSelection } from '../../hooks/useTableSelection';

// Mock data provider
const mockDataProvider = {
  getList: async ({ pagination }: GetListParams) => {
    const { currentPage = 1, pageSize = 10 } = pagination || {};
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    const allData = Array.from({ length: 100 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Item ${i + 1}`,
    }));

    return {
      data: allData.slice(start, end),
      total: allData.length,
    };
  },
  getOne: async () => ({ data: {} }),
  create: async () => ({ data: {} }),
  update: async () => ({ data: {} }),
  deleteOne: async () => ({ data: {} }),
  getApiUrl: () => 'https://api.example.com',
};

const meta = {
  title: 'Bulk/BulkActions',
  component: BulkActions,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Refine
        dataProvider={mockDataProvider as unknown as DataProvider}
        resources={[{ name: 'users' }]}
        options={{ disableTelemetry: true }}
      >
        <Story />
      </Refine>
    ),
  ],
} satisfies Meta<typeof BulkActions>;

export default meta;

// Interactive example with state
function BulkActionsExample() {
  const [actionLog, setActionLog] = useState<string[]>([]);

  // Mock current page data
  const mockRecords = Array.from({ length: 25 }, (_, i) => ({
    id: `${i + 1}`,
    name: `User ${i + 1}`,
  }));

  const { selectedIds, selectedRecords, onSelectedRecordsChange, clearSelection, allSelected, selectAll } =
    useTableSelection(mockRecords);

  const bulkActions: BulkAction[] = [
    {
      label: 'Activate selected',
      value: 'activate',
      onExecute: async (ids) => {
        setActionLog((prev) => [...prev, `Activated ${ids.length} items: ${ids.join(', ')}`]);
        clearSelection();
      },
    },
    {
      label: 'Deactivate selected',
      value: 'deactivate',
      onExecute: async (ids) => {
        setActionLog((prev) => [...prev, `Deactivated ${ids.length} items: ${ids.join(', ')}`]);
        clearSelection();
      },
    },
    {
      label: 'Delete selected',
      value: 'delete',
      onExecute: async (ids) => {
        setActionLog((prev) => [...prev, `Deleted ${ids.length} items: ${ids.join(', ')}`]);
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

  return (
    <Stack gap="md">
      <BulkActions
        resource="users"
        selectedIds={selectedIds}
        actions={bulkActions}
        pageSize={mockRecords.length}
        totalItems={100}
        allSelected={allSelected}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
      />

      <Stack gap="xs">
        <Text size="sm" fw={500}>
          Simulate selection (click to toggle):
        </Text>
        {mockRecords.slice(0, 10).map((record) => (
          <label key={record.id} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={selectedIds.includes(record.id)}
              onChange={() => handleSelectItem(record.id)}
            />
            <Text size="sm">{record.name}</Text>
          </label>
        ))}
        <Text size="xs" c="dimmed">
          ... and 15 more items on this page
        </Text>
      </Stack>

      {actionLog.length > 0 && (
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Action Log:
          </Text>
          {actionLog.map((log) => (
            <Text key={log} size="xs" c="dimmed">
              {log}
            </Text>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export const Interactive = {
  render: () => <BulkActionsExample />,
};

export const WithSelection = {
  render: () => {
    const mockRecords = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      name: `User ${i + 1}`,
    }));

    const { selectedIds, clearSelection, allSelected, selectAll } = useTableSelection(mockRecords);

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
          console.log('Activate:', ids);
        },
      },
      {
        label: 'Delete',
        value: 'delete',
        onExecute: async (ids: BaseKey[]) => {
          console.log('Delete:', ids);
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
    const mockRecords = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      name: `User ${i + 1}`,
    }));

    const { selectedIds, clearSelection, selectAll } = useTableSelection(mockRecords);

    const bulkActions: BulkAction[] = [
      {
        label: 'Activate',
        value: 'activate',
        onExecute: async (ids: BaseKey[]) => {
          console.log('Activate:', ids);
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
        onExecute: async (ids: BaseKey[]) => {
          console.log('Activate:', ids);
        },
      },
      {
        label: 'Delete',
        value: 'delete',
        onExecute: async (ids: BaseKey[]) => {
          console.log('Delete:', ids);
        },
      },
    ],
    pageSize: 25,
    totalItems: 100,
    allSelected: false,
  },
};
