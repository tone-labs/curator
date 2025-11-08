import type { Meta, StoryObj } from '@storybook/react';

import { DateField } from '../../components/fields/DateField';

const meta = {
  title: 'Fields/DateField',
  component: DateField,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the field',
    },
    value: {
      control: 'date',
      description: 'Date value to display',
    },
    format: {
      control: 'text',
      description: 'Date format string (dayjs format)',
    },
  },
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Created',
    value: new Date('2025-01-15T10:30:00'),
  },
};

export const CustomFormat: Story = {
  args: {
    label: 'Event Date',
    value: new Date('2025-01-15T10:30:00'),
    format: 'MMMM D, YYYY',
  },
};

export const WithTime: Story = {
  args: {
    label: 'Last Updated',
    value: new Date('2025-01-15T10:30:00'),
    format: 'MMM D, YYYY h:mm A',
  },
};

export const ISOString: Story = {
  args: {
    label: 'ISO Date',
    value: '2025-01-15T10:30:00Z',
  },
};
