import { mockCombobox } from './ui/combobox';
import { mockComboboxCheckBox } from './ui/comboboxCheckbox';
import { mockTypography } from './atoms/typography';
import { mockStepper } from './ui/stepper';
import { mockInput } from './ui/input';
import { mockFileInput } from './ui/fileInput';
import { mockTextarea } from './ui/textarea';

export function setupComponentMocks() {
  jest.mock('@/components/ui/combobox', () => ({ Combobox: mockCombobox }));
  jest.mock('@/components/ui/comboboxCheckbox', () => ({ ComboboxCheckBox: mockComboboxCheckBox }));
  jest.mock('@/components/atoms/typography', () => ({ Typography: mockTypography }));
  jest.mock('@/components/ui/stepper', () => ({ Stepper: mockStepper }));
  jest.mock('@/components/ui/input', () => ({ Input: mockInput }));
  jest.mock('@/components/ui/textarea', () => ({ Textarea: mockTextarea }));
  jest.mock('@/components/ui/fileInput', () => ({ FileInput: mockFileInput }));
}
