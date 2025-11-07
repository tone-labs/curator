import type { Meta, StoryObj } from '@storybook/react';
import { TagField } from '../../components/fields/TagField';

const meta = {
  title: 'Fields/TagField',
  component: TagField,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the field',
    },
    value: {
      description: 'Single tag or array of tags',
    },
    color: {
      control: 'select',
      options: ['blue', 'red', 'green', 'yellow', 'gray', 'pink', 'violet'],
      description: 'Badge color',
    },
    variant: {
      control: 'select',
      options: ['filled', 'light', 'outline', 'dot'],
      description: 'Badge variant',
    },
  },
} satisfies Meta<typeof TagField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleTag: Story = {
  args: {
    label: 'Status',
    value: 'active',
  },
};

export const MultipleTags: Story = {
  args: {
    label: 'Roles',
    value: ['admin', 'user', 'moderator'],
  },
};

export const WithColor: Story = {
  args: {
    label: 'Priority',
    value: 'high',
    color: 'red',
  },
};

export const OutlineVariant: Story = {
  args: {
    label: 'Categories',
    value: ['Frontend', 'Backend', 'DevOps'],
    variant: 'outline',
  },
};

export const LightVariant: Story = {
  args: {
    label: 'Tags',
    value: ['Important', 'Urgent', 'Review'],
    variant: 'light',
    color: 'violet',
  },
};
