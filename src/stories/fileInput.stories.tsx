import { Meta, StoryObj } from '@storybook/react';
import { FileInput } from '../components/ui/fileInput';
import { action } from '@storybook/addon-actions';
import React from 'react';

const meta: Meta<typeof FileInput> = {
  title: 'Components/FileInput',
  component: FileInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['empty', 'filled', 'error'],
      description: 'The state of the file input',
    },
    textLabel: {
      control: 'text',
      description: 'Label text for the file input',
    },
    buttonText: {
      control: 'text',
      description: 'Text for the select file button',
    },
    onClear: { action: 'cleared' },
    onFileSelect: { action: 'file selected' },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    accept: {
      control: 'text',
      description: 'Accepted file types (e.g., ".pdf,.doc,.docx")',
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in bytes',
    },
    compTestId: {
      control: 'text',
      description: 'Test ID for component testing',
    },
  },
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof FileInput>;

export const Default: Story = {
  args: {
    textLabel: 'Upload a file',
    compTestId: 'file-input-default',
    buttonText: 'Select File',
  },
};

export const WithValue: Story = {
  args: {
    textLabel: 'Upload a file',
    state: 'filled',
    value: 'example.pdf',
    compTestId: 'file-input-with-value',
    buttonText: 'Select File',
  },
};

export const WithError: Story = {
  args: {
    textLabel: 'Upload a file',
    state: 'error',
    value: 'example.pdf',
    error: 'Invalid file type',
    compTestId: 'file-input-with-error',
    buttonText: 'Select File',
  },
};

export const Interactive: Story = {
  render: (args) => {
    const InteractiveComponent = () => {
      const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
      const [fileState, setFileState] = React.useState<'empty' | 'filled' | 'error'>('empty');
      const [errorMessage, setErrorMessage] = React.useState('');
      
      const handleFileSelect = (file: File | null) => {
        setSelectedFile(file);
        action('onFileSelect')(file);

        if (!file) {
          setFileState('empty');
          setErrorMessage('');
          return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          setFileState('error');
          setErrorMessage(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
        } else {
          setFileState('filled');
          setErrorMessage('');
        }
      };

      const handleClear = () => {
        setSelectedFile(null);
        setFileState('empty');
        setErrorMessage('');
        action('onClear')();
      };

      return (
        <FileInput
          {...args}
          state={fileState}
          error={errorMessage}
          onFileSelect={handleFileSelect}
          onClear={handleClear}
          value={selectedFile?.name}
          accept=".pdf,.doc,.docx"
          maxSize={5 * 1024 * 1024}
        />
      );
    };

    return <InteractiveComponent />;
  },
  args: {
    textLabel: 'Upload a document (PDF, DOC, DOCX)',
    compTestId: 'file-input-interactive',
    buttonText: 'Select File',
  },
};

export const PDFOnly: Story = {
  args: {
    textLabel: 'Upload a PDF file',
    accept: '.pdf',
    compTestId: 'file-input-pdf-only',
    buttonText: 'Select PDF',
  },
};

export const ImageOnly: Story = {
  args: {
    textLabel: 'Upload an image',
    accept: 'image/*',
    compTestId: 'file-input-image-only',
    buttonText: 'Select Image',
  },
};
