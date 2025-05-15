import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button } from './Button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
  // Mendefinisikan argTypes untuk menyesuaikan dengan props Button
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'primary-outline', 'secondary-outline', 'link'],
      description: 'Appearance variant of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'link'],
      description: 'Size of the button',
    },
    icon: {
      control: 'boolean',
      description: 'Whether to show an icon',
    },
    iconPosition: {
      control: 'radio',
      options: ['start', 'end'],
      description: 'Position of the icon',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary variant
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

// Secondary variant
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

// Primary Outline variant
export const PrimaryOutline: Story = {
  args: {
    variant: 'primary-outline',
    children: 'Primary Outline',
  },
};

// Secondary Outline variant
export const SecondaryOutline: Story = {
  args: {
    variant: 'secondary-outline',
    children: 'Secondary Outline',
  },
};

// Link variant
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

// Size variants
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Default: Story = {
  args: {
    size: 'default',
    children: 'Default Size',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};



// Disabled
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};