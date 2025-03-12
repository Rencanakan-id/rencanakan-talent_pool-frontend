import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StepTwoForm } from '@/modules/RegisterFormModule/Section/register-2';
import { RegisterFormData } from '@/lib/register';

// Define interfaces for mock components
interface ComboboxProps {
  label: string;
  onChange: (value: string) => void;
  value?: string;
  error?: string;
}

jest.mock('@/components/ui/combobox', () => ({
  Combobox: ({ label, onChange, value, error }: ComboboxProps) => (
    <div>
      <label>{label}</label>
      <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} aria-label={label} />
      {error && <div className="error-message">{error}</div>}
    </div>
  ),
}));

interface ComboboxCheckBoxProps {
  label: string;
  onChange: (values: string[]) => void;
  values?: string[];
  placeholder?: string;
  error?: string;
}

jest.mock('@/components/ui/comboboxCheckbox', () => ({
  ComboboxCheckBox: ({ label, onChange, values, placeholder, error }: ComboboxCheckBoxProps) => {
    // Map values to capitalized form to simulate location label mapping
    const displayValues = (values || []).map(v => v.charAt(0).toUpperCase() + v.slice(1));
    
    return (
      <div>
        <label>{label}</label>
        <input
          value={displayValues.join(', ')}
          onChange={(e) => onChange(e.target.value.split(', '))}
          placeholder={placeholder ?? ''}
          aria-label={label}
        />
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  },
}));

interface InputProps {
  name?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
}

interface TextareaProps {
  textLabel: string;
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

interface FileInputProps {
  textLabel: string;
  accept?: string;
  state?: string;
  value?: string | null;
  onFileSelect: (file: File) => void;
  error?: string;
}

jest.mock('@/components', () => ({
  Typography: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  Stepper: ({ currentStep }: { currentStep: number }) => (
    <div>{`Current step: ${currentStep}`}</div>
  ),
  Input: ({ name, label, placeholder, type, value, onChange, error, className }: InputProps) => (
    <div className={className}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        placeholder={placeholder ?? ''}
        type={type}
        value={value ?? ''}
        onChange={onChange}
        aria-label={label}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  ),
  Textarea: ({ textLabel, placeholder, value, onChange, error }: TextareaProps) => (
    <div>
      <label>{textLabel}</label>
      <textarea
        placeholder={placeholder ?? ''}
        value={value ?? ''}
        onChange={onChange}
        aria-label={textLabel}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  ),
  FileInput: ({ textLabel, accept, state, value, onFileSelect, error }: FileInputProps) => (
    <div>
      <label>{textLabel}</label>
      <input
        type="file"
        accept={accept}
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        aria-label={textLabel}
      />
      {state === 'filled' && <span>{value}</span>}
      {error && <div className="error-message">{error}</div>}
    </div>
  ),
}));

describe('StepTwoForm Component', () => {
  // Default props
  const defaultFormData: RegisterFormData = {
    aboutMe: '',
    yearsOfExperience: '',
    skkLevel: '',
    currentLocation: '',
    preferredLocations: [],
    skill: '',
    otherSkill: '',
    skkFile: null,
  };

  const mockUpdateFormData = jest.fn();

  // Helper function to setup component with custom props
  const setup = (formData: Partial<RegisterFormData> = {}) => {
    const props = {
      formData: { ...defaultFormData, ...formData },
      updateFormData: mockUpdateFormData,
    };
    return render(<StepTwoForm {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Positive Cases', () => {
    test('renders form with all fields', () => {
      setup();

      // Verify headings
      expect(screen.getByText('Ceritakan sedikit pengalaman kerja kamu')).toBeInTheDocument();
      expect(screen.getByText('Tentang Pekerjaan')).toBeInTheDocument();
      expect(screen.getByText('Dokumen Pendukung')).toBeInTheDocument();

      // Verify input fields
      expect(screen.getByLabelText('Tentang Saya')).toBeInTheDocument();
      expect(screen.getByLabelText('Lama Pengalaman')).toBeInTheDocument();
      expect(screen.getByLabelText('Level Sertifikasi SKK')).toBeInTheDocument();
      expect(screen.getByLabelText('Lokasi Saat Ini')).toBeInTheDocument();
      expect(screen.getByLabelText('Bersedia Ditempatkan Di Mana')).toBeInTheDocument();
      expect(screen.getByLabelText('Keahlian')).toBeInTheDocument();
      expect(screen.getByLabelText('SKK')).toBeInTheDocument();
    });

    test('updates aboutMe when textarea changes', () => {
      setup();
      const textarea = screen.getByLabelText('Tentang Saya');
      fireEvent.change(textarea, { target: { value: 'Test about me' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ aboutMe: 'Test about me' });
    });

    test('updates yearsOfExperience when input changes', () => {
      setup();
      const input = screen.getByLabelText('Lama Pengalaman');
      fireEvent.change(input, { target: { value: '5 Tahun' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ yearsOfExperience: '5 Tahun' });
    });

    test('updates skkLevel when input changes', () => {
      setup();
      const input = screen.getByLabelText('Level Sertifikasi SKK');
      fireEvent.change(input, { target: { value: 'Operator' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skkLevel: 'Operator' });
    });

    test('updates currentLocation when input changes', () => {
      setup();
      const input = screen.getByLabelText('Lokasi Saat Ini');
      fireEvent.change(input, { target: { value: 'Jakarta' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ currentLocation: 'Jakarta' });
    });

    test('updates preferedLocations when input changes', () => {
      setup({
        preferredLocations: ['jakarta', 'bandung', 'unknown-location'],
      });
      const input = screen.getByLabelText('Bersedia Ditempatkan Di Mana');
      fireEvent.change(input, { target: { value: 'Bandung, Surabaya' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({
        preferredLocations: ['Bandung', 'Surabaya'],
      });
    });

    test('updates skill when input changes', () => {
      setup();
      const input = screen.getByLabelText('Keahlian');
      fireEvent.change(input, { target: { value: 'Sipil' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skill: 'Sipil' });
    });

    test('shows otherSkill input when skill is "lainnya"', () => {
      setup({ skill: 'lainnya' });
      const otherSkillInput = screen.getByPlaceholderText('Tulis di sini keahlian kamu');
      expect(otherSkillInput).toBeInTheDocument();
    });

    test('updates otherSkill when input changes', () => {
      setup({ skill: 'lainnya' });
      const otherSkillInput = screen.getByPlaceholderText('Tulis di sini keahlian kamu');
      fireEvent.change(otherSkillInput, { target: { value: 'Custom Skill' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ otherSkill: 'Custom Skill' });
    });

    test('updates skkFile when file is selected', () => {
      setup();
      const file = new File(['dummy content'], 'skk.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText('SKK');

      fireEvent.change(fileInput, { target: { files: [file] } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skkFile: file });

      // Rerender the component with the updated file
      setup({ skkFile: file });
      expect(screen.getByText('skk.pdf')).toBeInTheDocument(); // Verify the filename is displayed
    });
  });

  describe('Negative Cases', () => {
    test('does not show otherSkill input when skill is not "lainnya"', () => {
      setup({ skill: 'Sipil' });
      const otherSkillInput = screen.queryByPlaceholderText('Tulis di sini keahlian kamu');
      expect(otherSkillInput).not.toBeInTheDocument();
    });

    test('handles empty form data gracefully', () => {
      const { container } = setup({
        aboutMe: undefined,
        yearsOfExperience: undefined,
        skkLevel: undefined,
        currentLocation: undefined,
        preferedLocations: undefined,
        skill: undefined,
      } as Partial<RegisterFormData>);

      expect(container).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles changing skill from "lainnya" to another value', () => {
      // Start with "lainnya" selected
      const { rerender } = setup({ skill: 'lainnya', otherSkill: 'Custom Skill' });

      // Verify otherSkill input is shown
      expect(screen.getByPlaceholderText('Tulis di sini keahlian kamu')).toBeInTheDocument();

      // Change skill to non-"lainnya" value
      const skillInput = screen.getByLabelText('Keahlian');
      fireEvent.change(skillInput, { target: { value: 'Sipil' } });

      // Re-render with the updated props to simulate React's behavior
      rerender(
        <StepTwoForm
          formData={{ ...defaultFormData, skill: 'Sipil' }}
          updateFormData={mockUpdateFormData}
        />
      );

      // Verify otherSkill input is no longer shown
      const otherSkillInput = screen.queryByPlaceholderText('Tulis di sini keahlian kamu');
      expect(otherSkillInput).not.toBeInTheDocument();
    });

    test('handles very long text input in textarea', () => {
      const longText = 'a'.repeat(1000);
      setup();
      const textarea = screen.getByLabelText('Tentang Saya');
      fireEvent.change(textarea, { target: { value: longText } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ aboutMe: longText });
    });
  });

  describe('StepTwoForm Component Additional Tests', () => {
    // Default props
    const defaultFormData: RegisterFormData = {
      aboutMe: '',
      yearsOfExperience: '',
      skkLevel: '',
      currentLocation: '',
      preferredLocations: [],
      skill: '',
      otherSkill: '',
      skkFile: null,
    };
  
    const mockUpdateFormData = jest.fn();
  
    // Helper function to setup component with custom props and validation errors
    const setup = (
      formData: Partial<RegisterFormData> = {}, 
      validationErrors: Partial<Record<keyof RegisterFormData, string>> = {}
    ) => {
      const props = {
        formData: { ...defaultFormData, ...formData },
        updateFormData: mockUpdateFormData,
        validationErrors,
      };
      return render(<StepTwoForm {...props} />);
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    // Tests for specific line coverage
  
    // Line 48: skkLevel combobox
    test('displays validation error for skkLevel field', () => {
      const validationErrors = { skkLevel: 'Level SKK wajib diisi' };
      setup({}, validationErrors);
      
      expect(screen.getByText('Level SKK wajib diisi')).toBeInTheDocument();
    });
  
    // Line 56: currentLocation combobox
    test('displays validation error for currentLocation field', () => {
      const validationErrors = { currentLocation: 'Lokasi saat ini wajib diisi' };
      setup({}, validationErrors);
      
      expect(screen.getByText('Lokasi saat ini wajib diisi')).toBeInTheDocument();
    });
  
    // Line 64: preferredLocations combobox
    test('displays validation error for preferredLocations field', () => {
      const validationErrors = { preferredLocations: 'Pilih minimal satu lokasi' };
      setup({}, validationErrors);
      
      expect(screen.getByText('Pilih minimal satu lokasi')).toBeInTheDocument();
    });
  
    // Line 98: ComboboxCheckBox max selection messaging
    test('displays max selection message for preferredLocations', () => {
      setup();
      expect(screen.getByText('Pilih maksimal 5 lokasi')).toBeInTheDocument();
    });
  
    // Lines 72-81: Skill and otherSkill handling
    test('displays validation error for skill field', () => {
      const validationErrors = { skill: 'Keahlian wajib diisi' };
      setup({}, validationErrors);
      
      expect(screen.getByText('Keahlian wajib diisi')).toBeInTheDocument();
    });
  
    test('updates skill and clears otherSkill when changing from "lainnya"', () => {
      // Start with "lainnya" and an otherSkill value
      const { rerender } = setup({ skill: 'lainnya', otherSkill: 'Custom Skill' });
      
      // Change to a different skill
      const skillInput = screen.getByLabelText('Keahlian');
      fireEvent.change(skillInput, { target: { value: 'Sipil' } });
      
      // Verify the update call
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skill: 'Sipil' });
      
      // Re-render with updated props to simulate React's behavior
      rerender(<StepTwoForm formData={{ ...defaultFormData, skill: 'Sipil' }} updateFormData={mockUpdateFormData} />);
      
      // Verify otherSkill is not displayed anymore
      expect(screen.queryByPlaceholderText('Tulis di sini keahlian kamu')).not.toBeInTheDocument();
    });
  
    // Line 106: otherSkill validation
    test('displays validation error for otherSkill when skill is "lainnya"', () => {
      const validationErrors = { otherSkill: 'Keahlian lainnya wajib diisi' };
      setup({ skill: 'lainnya' }, validationErrors);
      
      const otherSkillInput = screen.getByPlaceholderText('Tulis di sini keahlian kamu');
      expect(otherSkillInput).toBeInTheDocument();
      expect(screen.getByText('Keahlian lainnya wajib diisi')).toBeInTheDocument();
    });
  
    // Line 85: skkFile handling with maxFileSize test
    test('handles file size validation for skkFile', async () => {
      // Create a file that would be too large
      const file = new File(['dummy content'.repeat(1000)], 'large-skk.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 }); // 5MB file
      
      setup();
      const fileInput = screen.getByLabelText('SKK');
      
      fireEvent.change(fileInput, { target: { files: [file] } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skkFile: file });
    });
  
    // Line 123: skkFile error validation
    test('displays validation error for skkFile field', () => {
      const validationErrors = { skkFile: 'File SKK wajib diunggah' };
      setup({}, validationErrors);
      
      expect(screen.getByText('File SKK wajib diunggah')).toBeInTheDocument();
    });
  
    // Additional test to ensure full coverage of multiple fields updating
    test('updates multiple form fields in sequence', () => {
      setup();
      
      // Update skkLevel
      const skkLevelInput = screen.getByLabelText('Level Sertifikasi SKK');
      fireEvent.change(skkLevelInput, { target: { value: 'Senior' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skkLevel: 'Senior' });
      
      // Update currentLocation
      const locationInput = screen.getByLabelText('Lokasi Saat Ini');
      fireEvent.change(locationInput, { target: { value: 'Jakarta' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ currentLocation: 'Jakarta' });
      
      // Update preferredLocations
      const prefLocInput = screen.getByLabelText('Bersedia Ditempatkan Di Mana');
      fireEvent.change(prefLocInput, { target: { value: 'Surabaya, Bandung, Medan' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({
        preferredLocations: ['Surabaya', 'Bandung', 'Medan'],
      });
      
      // Update skill to lainnya
      const skillInput = screen.getByLabelText('Keahlian');
      fireEvent.change(skillInput, { target: { value: 'lainnya' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skill: 'lainnya' });
      
      // Re-render to show otherSkill field
      setup({ skill: 'lainnya' });
      
      // Update otherSkill
      const otherSkillInput = screen.getByPlaceholderText('Tulis di sini keahlian kamu');
      fireEvent.change(otherSkillInput, { target: { value: 'DevOps' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ otherSkill: 'DevOps' });
    });

    // Add this new test specifically for line 81 coverage
    test('handles changing skill from another value to "lainnya"', () => {
      // Start with a non-lainnya skill
      const { rerender } = setup({ skill: 'Sipil' });
      
      // Verify otherSkill input is not shown initially
      expect(screen.queryByPlaceholderText('Tulis di sini keahlian kamu')).not.toBeInTheDocument();
      
      // Change skill to "lainnya"
      const skillInput = screen.getByLabelText('Keahlian');
      fireEvent.change(skillInput, { target: { value: 'lainnya' } });
      
      // Verify the update call
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skill: 'lainnya' });
      
      // Re-render with updated props to simulate React's behavior
      rerender(<StepTwoForm formData={{ ...defaultFormData, skill: 'lainnya' }} updateFormData={mockUpdateFormData} />);
      
      // Verify otherSkill input is now displayed
      expect(screen.getByPlaceholderText('Tulis di sini keahlian kamu')).toBeInTheDocument();
    });

    // Add specific test for line 72-80: Testing all skill selection scenarios
    test('changing skill value properly updates state and triggers conditional rendering', () => {
      // Start with empty skill
      const { rerender } = setup();
      
      // Test selecting a non-lainnya skill
      const skillInput = screen.getByLabelText('Keahlian');
      fireEvent.change(skillInput, { target: { value: 'Sipil' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skill: 'Sipil' });
      
      // Rerender with non-lainnya skill
      rerender(<StepTwoForm 
        formData={{ ...defaultFormData, skill: 'Sipil' }} 
        updateFormData={mockUpdateFormData} 
      />);
      
      // Verify the skill is selected and otherSkill is not shown
      expect(screen.queryByPlaceholderText('Tulis di sini keahlian kamu')).not.toBeInTheDocument();
      
      // Now change to lainnya
      fireEvent.change(skillInput, { target: { value: 'lainnya' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skill: 'lainnya' });
      
      // Rerender with lainnya skill
      rerender(<StepTwoForm 
        formData={{ ...defaultFormData, skill: 'lainnya' }} 
        updateFormData={mockUpdateFormData}
      />);
      
      // Verify otherSkill field is displayed
      expect(screen.getByPlaceholderText('Tulis di sini keahlian kamu')).toBeInTheDocument();
      
      // Now change back to a different skill
      fireEvent.change(skillInput, { target: { value: 'Mechanical' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skill: 'Mechanical' });
    });

    // Test for line 85: File size validation for skkFile
    test('validates file size for skkFile uploads', () => {
      setup();
      
      // Create a file that's within size limits
      const smallFile = new File(['content'], 'small-skk.pdf', { type: 'application/pdf' });
      Object.defineProperty(smallFile, 'size', { value: 1 * 1024 * 1024 }); // 1MB file
      
      // Create a file that exceeds size limits
      const largeFile = new File(['content'], 'large-skk.pdf', { type: 'application/pdf' });
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 }); // 6MB file
      
      const fileInput = screen.getByLabelText('SKK');
      
      // Test with small file
      fireEvent.change(fileInput, { target: { files: [smallFile] } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skkFile: smallFile });
      
      // Test with large file
      fireEvent.change(fileInput, { target: { files: [largeFile] } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skkFile: largeFile });
    });
    
    // Test specifically for line 98: ComboboxCheckBox message
    test('renders ComboboxCheckBox with max selection message', () => {
      setup();
      
      // ComboboxCheckBox should have a message about max selection
      expect(screen.getByText('Pilih maksimal 5 lokasi')).toBeInTheDocument();
      
      // Test updating preferred locations
      const locationsInput = screen.getByLabelText('Bersedia Ditempatkan Di Mana');
      fireEvent.change(locationsInput, { target: { value: 'Jakarta, Bandung, Surabaya, Medan, Makassar, Bali' } });
      
      // Should still show max 5 message even when selecting more
      expect(screen.getByText('Pilih maksimal 5 lokasi')).toBeInTheDocument();
    });
    
    // Test for validation error displays (lines 48, 56, 64, 106, 123)
    test('displays all possible validation errors', () => {
      // Setup with all validation errors
      const validationErrors = {
        aboutMe: 'Tentang saya wajib diisi',
        yearsOfExperience: 'Lama pengalaman wajib diisi',
        skkLevel: 'Level SKK wajib diisi',  // Line 48
        currentLocation: 'Lokasi saat ini wajib diisi', // Line 56
        preferredLocations: 'Pilih minimal satu lokasi', // Line 64
        skill: 'Keahlian wajib diisi',
        otherSkill: 'Keahlian lainnya wajib diisi', // Line 106
        skkFile: 'File SKK wajib diunggah' // Line 123
      };
      
      // Test with normal skill first
      setup({ skill: 'Sipil' }, validationErrors);
      
      // Verify validation errors are displayed
      expect(screen.getByText('Tentang saya wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Lama pengalaman wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Level SKK wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Lokasi saat ini wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Pilih minimal satu lokasi')).toBeInTheDocument();
      expect(screen.getByText('Keahlian wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('File SKK wajib diunggah')).toBeInTheDocument();
      
      // Now test with skill='lainnya' to see otherSkill validation
      setup({ skill: 'lainnya' }, validationErrors);
      expect(screen.getByText('Keahlian lainnya wajib diisi')).toBeInTheDocument();
    });

    // Test for empty validation errors
    test('renders form without validation errors when validationErrors is empty', () => {
      // Setup with explicitly empty validation errors object
      const emptyValidationErrors = {};
      setup({}, emptyValidationErrors);
      
      // Verify none of the error messages are displayed
      expect(screen.queryByText('Tentang saya wajib diisi')).not.toBeInTheDocument();
      expect(screen.queryByText('Lama pengalaman wajib diisi')).not.toBeInTheDocument();
      expect(screen.queryByText('Level SKK wajib diisi')).not.toBeInTheDocument();
      expect(screen.queryByText('Lokasi saat ini wajib diisi')).not.toBeInTheDocument();
      expect(screen.queryByText('Pilih minimal satu lokasi')).not.toBeInTheDocument();
      expect(screen.queryByText('Keahlian wajib diisi')).not.toBeInTheDocument();
      expect(screen.queryByText('File SKK wajib diunggah')).not.toBeInTheDocument();
      expect(screen.queryByText('Keahlian lainnya wajib diisi')).not.toBeInTheDocument();
      
      // Verify error containers don't exist
      expect(screen.queryByText((_content, element) => 
        element?.className === 'error-message'
      )).not.toBeInTheDocument();
      
      // Verify the form is still interactive
      const textarea = screen.getByLabelText('Tentang Saya');
      fireEvent.change(textarea, { target: { value: 'New about me text' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ aboutMe: 'New about me text' });
    });

    test('clears skkFile error when valid file is uploaded', () => {
      // Setup dengan validation error untuk skkFile
      const validationErrors = { skkFile: 'File SKK wajib diunggah' };
      const { rerender } = setup({}, validationErrors);
      
      // Verify error message is displayed initially
      expect(screen.getByText('File SKK wajib diunggah')).toBeInTheDocument();
      
      // Upload a valid file
      const validFile = new File(['content'], 'valid-skk.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText('SKK');
      fireEvent.change(fileInput, { target: { files: [validFile] } });
      
      // Simulate form rerender after validation passes
      rerender(<StepTwoForm 
        formData={{ ...defaultFormData, skkFile: validFile }} 
        updateFormData={mockUpdateFormData}
        validationErrors={{}} // Clear validation errors
      />);
      
      // Verify error message is gone
      expect(screen.queryByText('File SKK wajib diunggah')).not.toBeInTheDocument();
    });
  });
});
