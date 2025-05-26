import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'small'],
      description: 'Input size variant',
    },
    label: {
      control: 'text',
      description: 'Input label text',
    },
    prefixText: {
      control: 'text',
      description: 'Text displayed at the start of the input',
    },
    error: {
      control: 'text',
      description: 'Error message text',
    },
    width: {
      control: 'text',
      description: 'Custom width for the input (e.g. "300px", "50%")',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text here',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
  },
};

export const Small: Story = {
  args: {
    variant: 'small',
    placeholder: 'Small input',
    width: '200px',
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    error: 'Password must be at least 8 characters',
    type: 'password',
  },
};

export const WithPrefixText: Story = {
  args: {
    label: 'Price',
    placeholder: '0',
    prefixText: 'Rp',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    disabled: true,
  },
};

export const CustomWidth: Story = {
  args: {
    label: 'Custom Width',
    placeholder: 'This input has custom width',
    width: '400px',
  },
};

