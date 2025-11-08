import { Refine } from '@refinedev/core';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { ExportButton } from '../../components/buttons/ExportButton';
import { createMockDataProvider } from '../__mocks__/dataProvider';

const mockDataProvider = createMockDataProvider(100);

const meta = {
  title: 'Buttons/ExportButton',
  component: ExportButton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Refine dataProvider={mockDataProvider} resources={[{ name: 'users' }]} options={{ disableTelemetry: true }}>
        <Story />
      </Refine>
    ),
  ],
} satisfies Meta<typeof ExportButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic export button - exports all 100 mock users with all fields as CSV
 */
export const Default: Story = {
  args: {
    resource: 'users',
  },
};

/**
 * Export specific fields with custom labels for CSV headers
 */
export const CustomFieldsAndLabels: Story = {
  args: {
    resource: 'users',
    fields: ['id', 'name', 'email', 'is_active', 'created_at'],
    fieldLabels: {
      name: 'Full Name',
      is_active: 'Active Status',
      created_at: 'Registration Date',
    },
  },
};

/**
 * Custom exporter function - export as JSON instead of CSV
 */
export const JsonExporter: Story = {
  args: {
    resource: 'users',
    fileName: 'users.json',
    exporter: (records) => {
      action('exporter')(`Converting ${records.length} records to JSON`);
      return JSON.stringify(records, null, 2);
    },
  },
};

/**
 * Export with confirmation and callbacks
 */
export const WithConfirmation: Story = {
  args: {
    resource: 'users',
    onBeforeExport: () => {
      return window.confirm('Are you sure you want to export all 100 users?');
    },
    onExportComplete: (count) => {
      action('onExportComplete')(`Successfully exported ${count} records`);
    },
  },
};
