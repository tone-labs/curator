import type { Meta, StoryObj } from '@storybook/react';

import { TextField } from '../../components/fields/TextField';

const meta = {
  title: 'Fields/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the field',
    },
    value: {
      control: 'text',
      description: 'Value to display',
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    label: 'Username',
    value: 'john_doe',
  },
};

export const LongText: Story = {
  args: {
    label: 'Description',
    value:
      'This is a very long text value that demonstrates how the TextField component handles longer content. It should display the entire text without truncation.',
  },
};

export const EmptyValue: Story = {
  args: {
    label: 'Empty Field',
    value: null,
  },
};
