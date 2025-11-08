import type { Meta, StoryObj } from '@storybook/react';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';

import { BooleanField } from '../../components/fields/BooleanField';

const meta = {
  title: 'Fields/BooleanField',
  component: BooleanField,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the field',
    },
    value: {
      control: 'boolean',
      description: 'Boolean value to display',
    },
    valueLabelTrue: {
      control: 'text',
      description: 'Text label to show for true values',
    },
    valueLabelFalse: {
      control: 'text',
      description: 'Text label to show for false values',
    },
  },
} satisfies Meta<typeof BooleanField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const True: Story = {
  args: {
    label: 'Active',
    value: true,
  },
};

export const False: Story = {
  args: {
    label: 'Active',
    value: false,
  },
};

export const WithTextLabels: Story = {
  args: {
    label: 'Status',
    value: true,
    valueLabelTrue: 'Enabled',
    valueLabelFalse: 'Disabled',
  },
};

export const WithCustomIcons: Story = {
  args: {
    label: 'Verified',
    value: true,
    trueIcon: <IconCircleCheck size={18} />,
    falseIcon: <IconCircleX size={18} />,
  },
};
