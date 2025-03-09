import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StepTwoForm } from '@/modules/RegisterFormModule/Section/register-2';
import { RegisterFormData } from '@/lib/register';

// Mock the UI components before other imports to ensure they're properly mocked
jest.mock('@/components/ui/combobox', () => ({
  Combobox: ({ 
    label, 
    onChange, 
    value 
  }: any) => (
    <div>
      <label>{label}</label>
      <input 
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      />
    </div>
  )
}));

jest.mock('@/components/ui/comboboxCheckbox', () => ({
  ComboboxCheckBox: ({ 
    label, 
    onChange, 
    values,
    placeholder,
  }: any) => (
    <div>
      <label>{label}</label>
      <input 
        value={(values || []).join(', ')}
        onChange={(e) => onChange(e.target.value.split(', '))}
        placeholder={placeholder || ""}
        aria-label={label}
      />
    </div>
  )
}));

jest.mock('@/components', () => ({
  Typography: ({ children, className }: { children: React.ReactNode, className?: string, variant?: string }) => (
    <div className={className}>{children}</div>
  ),
  Stepper: ({ currentStep }: { currentStep: number }) => (
    <div>{`Current step: ${currentStep}`}</div>
  ),
  Input: ({ 
    name, 
    label, 
    placeholder,
    type,
    value,
    onChange,
    error,
    className
  }: any) => (
    <div className={className}>
      {label && <label htmlFor={name}>{label}</label>}
      <input 
        id={name}
        name={name}
        placeholder={placeholder || ""}
        type={type}
        value={value || ""}
        onChange={onChange}
        aria-label={label}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  ),
  Textarea: ({
    textLabel,
    placeholder,
    value,
    onChange
  }: any) => (
    <div>
      <label>{textLabel}</label>
      <textarea
        placeholder={placeholder || ""}
        value={value || ""}
        onChange={onChange}
        aria-label={textLabel}
      />
    </div>
  ),
  FileInput: ({
    textLabel,
    accept,
    state,
    value,
    onFileSelect
  }: any) => (
    <div>
      <label>{textLabel}</label>
      <input
        type="file"
        accept={accept}
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        aria-label={textLabel}
      />
      {state === 'filled' && <span>{value}</span>}
    </div>
  )
}));

describe('StepTwoForm Component', () => {
  // Default props
  const defaultFormData: RegisterFormData = {
    aboutMe: '',
    yearsOfExperience: '',
    skkLevel: '',
    currentLocation: '',
    prefferedLocations: [],
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

    test('updates prefferedLocations when input changes', () => {
      setup();
      const input = screen.getByLabelText('Bersedia Ditempatkan Di Mana');
      fireEvent.change(input, { target: { value: 'Bandung, Surabaya' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ prefferedLocations: ['Bandung', 'Surabaya'] });
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
        prefferedLocations: undefined,
        skill: undefined,
      } as any);
      
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
});
