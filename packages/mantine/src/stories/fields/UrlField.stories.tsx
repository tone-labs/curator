import type { Meta, StoryObj } from '@storybook/react';
import { UrlField } from '../../components/fields/UrlField';

const meta = {
  title: 'Fields/UrlField',
  component: UrlField,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the field',
    },
    value: {
      control: 'text',
      description: 'URL to display and link to',
    },
    showIcon: {
      control: 'boolean',
      description: 'Show external link icon',
    },
  },
} satisfies Meta<typeof UrlField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    label: 'Website',
    value: 'https://example.com',
  },
};

export const WithoutIcon: Story = {
  args: {
    label: 'Website',
    value: 'https://example.com',
    showIcon: false,
  },
};

export const WithCustomText: Story = {
  args: {
    label: 'Documentation',
    value: 'https://docs.example.com',
    children: 'View Docs',
  },
};

export const LongUrl: Story = {
  args: {
    label: 'API Endpoint',
    value: 'https://api.example.com/v2/users/12345/profile/settings?tab=notifications',
  },
};
