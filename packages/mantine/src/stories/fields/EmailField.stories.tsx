import type { Meta, StoryObj } from '@storybook/react';

import { EmailField } from '../../components/fields/EmailField';

const meta = {
  title: 'Fields/EmailField',
  component: EmailField,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the field',
    },
    value: {
      control: 'text',
      description: 'Email address',
    },
  },
} satisfies Meta<typeof EmailField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    label: 'Email',
    value: 'john.doe@example.com',
  },
};

export const WithCustomText: Story = {
  args: {
    label: 'Contact',
    value: 'support@example.com',
    children: 'Email Support',
  },
};

export const LongEmail: Story = {
  args: {
    label: 'Email',
    value: 'very.long.email.address.for.testing@subdomain.example.com',
  },
};
