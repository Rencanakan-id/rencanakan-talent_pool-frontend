import { mockCombobox } from './ui/combobox';
import { mockComboboxCheckBox } from './ui/comboboxCheckbox';
import { mockTypography } from './atoms/typography';
import { mockStepper } from './ui/stepper';
import { mockInput } from './ui/input';
import { mockFileInput } from './ui/fileInput';
import { mockTextarea } from './ui/textarea';

export function setupComponentMocks(components?: string[]) {
  const allComponents = {
    'combobox': () => jest.mock('@/components/ui/combobox', () => ({ Combobox: mockCombobox })),
    'comboboxCheckbox': () => jest.mock('@/components/ui/comboboxCheckbox', () => ({ ComboboxCheckBox: mockComboboxCheckBox })),
    'typography': () => jest.mock('@/components/atoms/typography', () => ({ Typography: mockTypography })),
    'stepper': () => jest.mock('@/components/ui/stepper', () => ({ Stepper: mockStepper })),
    'input': () => jest.mock('@/components/ui/input', () => ({ Input: mockInput })),
    'textarea': () => jest.mock('@/components/ui/textarea', () => ({ Textarea: mockTextarea })),
    'fileInput': () => jest.mock('@/components/ui/fileInput', () => ({ FileInput: mockFileInput })),
  };
  
  if (!components || components.length === 0) {
    Object.values(allComponents).forEach(mockFn => mockFn());
  } else {
    components.forEach(component => {
      if (component in allComponents) {
        allComponents[component as keyof typeof allComponents]();
      }
    });
  }
  }
