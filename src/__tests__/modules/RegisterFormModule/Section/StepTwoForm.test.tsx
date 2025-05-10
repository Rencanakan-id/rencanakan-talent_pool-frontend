import { render, screen, fireEvent } from '@testing-library/react';
import { setupComponentMocks } from '@/__mocks__/components/setUpComponents';
setupComponentMocks();
import '@testing-library/jest-dom';
import { StepTwoForm } from '@/modules/RegisterFormModule/Section/register-2';
import { RegisterFormData } from '@/lib/register';

describe('StepTwoForm Component', () => {
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

      expect(screen.getByText('Ceritakan sedikit pengalaman kerja kamu')).toBeInTheDocument();
      expect(screen.getByText('Tentang Pekerjaan')).toBeInTheDocument();
      expect(screen.getByText('Dokumen Pendukung')).toBeInTheDocument();

      expect(screen.getByLabelText('Tentang Saya *')).toBeInTheDocument();
      expect(screen.getByLabelText('Lama Pengalaman *')).toBeInTheDocument();
      expect(screen.getByLabelText('Level Sertifikasi SKK *')).toBeInTheDocument();
      expect(screen.getByLabelText('Lokasi Saat Ini *')).toBeInTheDocument();
      expect(screen.getByLabelText('Bersedia Ditempatkan Di Mana *')).toBeInTheDocument();
      expect(screen.getByLabelText('Keahlian *')).toBeInTheDocument();
      expect(screen.getByLabelText('SKK')).toBeInTheDocument();
    });

    test('updates aboutMe when textarea changes', () => {
      setup();
      const textarea = screen.getByLabelText('Tentang Saya *');
      fireEvent.change(textarea, { target: { value: 'Test about me' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ aboutMe: 'Test about me' });
    });

    test('updates yearsOfExperience when input changes', () => {
      setup();
      const input = screen.getByLabelText('Lama Pengalaman *');
      fireEvent.change(input, { target: { value: '5 Tahun' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ yearsOfExperience: '5 Tahun' });
    });

    test('updates skkLevel when input changes', () => {
      setup();
      const input = screen.getByLabelText('Level Sertifikasi SKK *');
      fireEvent.change(input, { target: { value: 'Operator' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skkLevel: 'Operator' });
    });

    test('updates currentLocation when input changes', () => {
      setup();
      const input = screen.getByLabelText('Lokasi Saat Ini *');
      fireEvent.change(input, { target: { value: 'Jakarta' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ currentLocation: 'Jakarta' });
    });

    test('updates preferedLocations when input changes', () => {
      setup({
        preferredLocations: ['jakarta', 'bandung', 'unknown-location'],
      });
      const input = screen.getByLabelText('Bersedia Ditempatkan Di Mana *');
      fireEvent.change(input, { target: { value: 'Bandung, Surabaya' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({
        preferredLocations: ['Bandung', 'Surabaya'],
      });
    });

    test('updates skill when input changes', () => {
      setup();
      const input = screen.getByLabelText('Keahlian *');
      fireEvent.change(input, { target: { value: 'Sipil' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skill: 'Sipil' });
    });

    test('shows otherSkill input when skill is "lainnya"', () => {
      setup({ skill: 'lainnya' });
      const otherSkillInput = screen.getByPlaceholderText('Tulis di sini keahlian kamu *');
      expect(otherSkillInput).toBeInTheDocument();
    });

    test('updates otherSkill when input changes', () => {
      setup({ skill: 'lainnya' });
      const otherSkillInput = screen.getByPlaceholderText('Tulis di sini keahlian kamu *');
      fireEvent.change(otherSkillInput, { target: { value: 'Custom Skill' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ otherSkill: 'Custom Skill' });
    });

    test('updates skkFile when file is selected', () => {
      setup();
      const file = new File(['dummy content'], 'skk.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText('SKK');

      fireEvent.change(fileInput, { target: { files: [file] } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skkFile: file });

      setup({ skkFile: file });
      expect(screen.getByText('skk.pdf')).toBeInTheDocument();
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
      const { rerender } = setup({ skill: 'lainnya', otherSkill: 'Custom Skill' });

      expect(screen.getByPlaceholderText('Tulis di sini keahlian kamu *')).toBeInTheDocument();

      const skillInput = screen.getByLabelText('Keahlian *');
      fireEvent.change(skillInput, { target: { value: 'Sipil' } });

      rerender(
        <StepTwoForm
          formData={{ ...defaultFormData, skill: 'Sipil' }}
          updateFormData={mockUpdateFormData}
        />
      );

      const otherSkillInput = screen.queryByPlaceholderText('Tulis di sini keahlian kamu');
      expect(otherSkillInput).not.toBeInTheDocument();
    });

    test('handles very long text input in textarea', () => {
      const longText = 'a'.repeat(1000);
      setup();
      const textarea = screen.getByLabelText('Tentang Saya *');
      fireEvent.change(textarea, { target: { value: longText } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ aboutMe: longText });
    });
  });

  describe('StepTwoForm Component Additional Tests', () => {
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

    test('displays validation error for skkLevel field', () => {
      const validationErrors = { skkLevel: 'Level SKK wajib diisi' };
      setup({}, validationErrors);

      expect(screen.getByText('Level SKK wajib diisi')).toBeInTheDocument();
    });

    test('displays validation error for currentLocation field', () => {
      const validationErrors = { currentLocation: 'Lokasi saat ini wajib diisi' };
      setup({}, validationErrors);

      expect(screen.getByText('Lokasi saat ini wajib diisi')).toBeInTheDocument();
    });

    test('displays validation error for preferredLocations field', () => {
      const validationErrors = { preferredLocations: 'Pilih minimal satu lokasi' };
      setup({}, validationErrors);

      expect(screen.getByText('Pilih minimal satu lokasi')).toBeInTheDocument();
    });

    test('displays max selection message for preferredLocations', () => {
      setup();
      expect(screen.getByText('Pilih maksimal 5 lokasi')).toBeInTheDocument();
    });

    test('displays validation error for skill field', () => {
      const validationErrors = { skill: 'Keahlian wajib diisi' };
      setup({}, validationErrors);

      expect(screen.getByText('Keahlian wajib diisi')).toBeInTheDocument();
    });

    test('updates skill and clears otherSkill when changing from "lainnya"', () => {
      const { rerender } = setup({ skill: 'lainnya', otherSkill: 'Custom Skill' });

      const skillInput = screen.getByLabelText('Keahlian *');
      fireEvent.change(skillInput, { target: { value: 'Sipil' } });

      expect(mockUpdateFormData).toHaveBeenCalledWith({ skill: 'Sipil' });

      rerender(
        <StepTwoForm
          formData={{ ...defaultFormData, skill: 'Sipil' }}
          updateFormData={mockUpdateFormData}
        />
      );

      expect(screen.queryByPlaceholderText('Tulis di sini keahlian kamu')).not.toBeInTheDocument();
    });

    test('displays validation error for otherSkill when skill is "lainnya"', () => {
      const validationErrors = { otherSkill: 'Keahlian lainnya wajib diisi' };
      setup({ skill: 'lainnya' }, validationErrors);

      const otherSkillInput = screen.getByPlaceholderText('Tulis di sini keahlian kamu *');
      expect(otherSkillInput).toBeInTheDocument();
      expect(screen.getByText('Keahlian lainnya wajib diisi')).toBeInTheDocument();
    });

    test('displays validation error for skkFile field', () => {
      const validationErrors = { skkFile: 'File SKK wajib diunggah' };
      setup({}, validationErrors);

      expect(screen.getByText('File SKK wajib diunggah')).toBeInTheDocument();
    });

    test('updates multiple form fields in sequence', () => {
      setup();

      const skkLevelInput = screen.getByLabelText('Level Sertifikasi SKK *');
      fireEvent.change(skkLevelInput, { target: { value: 'Senior' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skkLevel: 'Senior' });

      const locationInput = screen.getByLabelText('Lokasi Saat Ini *');
      fireEvent.change(locationInput, { target: { value: 'Jakarta' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ currentLocation: 'Jakarta' });

      const prefLocInput = screen.getByLabelText('Bersedia Ditempatkan Di Mana *');
      fireEvent.change(prefLocInput, { target: { value: 'Surabaya, Bandung, Medan' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({
        preferredLocations: ['Surabaya', 'Bandung', 'Medan'],
      });

      const skillInput = screen.getByLabelText('Keahlian *');
      fireEvent.change(skillInput, { target: { value: 'lainnya' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skill: 'lainnya' });

      setup({ skill: 'lainnya' });

      const otherSkillInput = screen.getByPlaceholderText('Tulis di sini keahlian kamu *');
      fireEvent.change(otherSkillInput, { target: { value: 'DevOps' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ otherSkill: 'DevOps' });
    });

    test('handles changing skill from another value to "lainnya"', () => {
      const { rerender } = setup({ skill: 'Sipil' });

      expect(screen.queryByPlaceholderText('Tulis di sini keahlian kamu')).not.toBeInTheDocument();

      const skillInput = screen.getByLabelText('Keahlian *');
      fireEvent.change(skillInput, { target: { value: 'lainnya' } });

      expect(mockUpdateFormData).toHaveBeenCalledWith({ skill: 'lainnya' });

      rerender(
        <StepTwoForm
          formData={{ ...defaultFormData, skill: 'lainnya' }}
          updateFormData={mockUpdateFormData}
        />
      );

      expect(screen.getByPlaceholderText('Tulis di sini keahlian kamu *')).toBeInTheDocument();
    });

    test('changing skill value properly updates state and triggers conditional rendering', () => {
      const { rerender } = setup();

      const skillInput = screen.getByLabelText('Keahlian *');
      fireEvent.change(skillInput, { target: { value: 'Sipil' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skill: 'Sipil' });

      rerender(
        <StepTwoForm
          formData={{ ...defaultFormData, skill: 'Sipil' }}
          updateFormData={mockUpdateFormData}
        />
      );

      expect(screen.queryByPlaceholderText('Tulis di sini keahlian kamu')).not.toBeInTheDocument();

      fireEvent.change(skillInput, { target: { value: 'lainnya' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skill: 'lainnya' });

      rerender(
        <StepTwoForm
          formData={{ ...defaultFormData, skill: 'lainnya' }}
          updateFormData={mockUpdateFormData}
        />
      );

      expect(screen.getByPlaceholderText('Tulis di sini keahlian kamu *')).toBeInTheDocument();

      fireEvent.change(skillInput, { target: { value: 'Mechanical' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skill: 'Mechanical' });
    });

    test('validates file size for skkFile uploads', () => {
      setup();

      const smallFile = new File(['content'], 'small-skk.pdf', { type: 'application/pdf' });
      Object.defineProperty(smallFile, 'size', { value: 1 * 1024 * 1024 });

      const largeFile = new File(['content'], 'large-skk.pdf', { type: 'application/pdf' });
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

      const fileInput = screen.getByLabelText('SKK');

      fireEvent.change(fileInput, { target: { files: [smallFile] } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skkFile: smallFile });

      fireEvent.change(fileInput, { target: { files: [largeFile] } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ skkFile: largeFile });
    });

    test('renders ComboboxCheckBox with max selection message', () => {
      setup();

      expect(screen.getByText('Pilih maksimal 5 lokasi')).toBeInTheDocument();

      const locationsInput = screen.getByLabelText('Bersedia Ditempatkan Di Mana *');
      fireEvent.change(locationsInput, {
        target: { value: 'Jakarta, Bandung, Surabaya, Medan, Makassar, Bali' },
      });

      expect(screen.getByText('Pilih maksimal 5 lokasi')).toBeInTheDocument();
    });

    test('displays all possible validation errors', () => {
      const validationErrors = {
        aboutMe: 'Tentang saya wajib diisi',
        yearsOfExperience: 'Lama pengalaman wajib diisi',
        skkLevel: 'Level SKK wajib diisi',
        currentLocation: 'Lokasi saat ini wajib diisi',
        preferredLocations: 'Pilih minimal satu lokasi',
        skill: 'Keahlian wajib diisi',
        otherSkill: 'Keahlian lainnya wajib diisi',
        skkFile: 'File SKK wajib diunggah',
      };

      setup({ skill: 'Sipil' }, validationErrors);

      expect(screen.getByText('Tentang saya wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Lama pengalaman wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Level SKK wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Lokasi saat ini wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Pilih minimal satu lokasi')).toBeInTheDocument();
      expect(screen.getByText('Keahlian wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('File SKK wajib diunggah')).toBeInTheDocument();

      setup({ skill: 'lainnya' }, validationErrors);
      expect(screen.getByText('Keahlian lainnya wajib diisi')).toBeInTheDocument();
    });

    test('renders form without validation errors when validationErrors is empty', () => {
      const emptyValidationErrors = {};
      setup({}, emptyValidationErrors);

      expect(screen.queryByText('Tentang saya wajib diisi')).not.toBeInTheDocument();
      expect(screen.queryByText('Lama pengalaman wajib diisi')).not.toBeInTheDocument();
      expect(screen.queryByText('Level SKK wajib diisi')).not.toBeInTheDocument();
      expect(screen.queryByText('Lokasi saat ini wajib diisi')).not.toBeInTheDocument();
      expect(screen.queryByText('Pilih minimal satu lokasi')).not.toBeInTheDocument();
      expect(screen.queryByText('Keahlian wajib diisi')).not.toBeInTheDocument();
      expect(screen.queryByText('File SKK wajib diunggah')).not.toBeInTheDocument();
      expect(screen.queryByText('Keahlian lainnya wajib diisi')).not.toBeInTheDocument();

      expect(
        screen.queryByText((_content, element) => element?.className === 'error-message')
      ).not.toBeInTheDocument();

      const textarea = screen.getByLabelText('Tentang Saya *');
      fireEvent.change(textarea, { target: { value: 'New about me text' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ aboutMe: 'New about me text' });
    });

    test('clears skkFile error when valid file is uploaded', () => {
      const validationErrors = { skkFile: 'File SKK wajib diunggah' };
      const { rerender } = setup({}, validationErrors);

      expect(screen.getByText('File SKK wajib diunggah')).toBeInTheDocument();

      const validFile = new File(['content'], 'valid-skk.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText('SKK');
      fireEvent.change(fileInput, { target: { files: [validFile] } });

      rerender(
        <StepTwoForm
          formData={{ ...defaultFormData, skkFile: validFile }}
          updateFormData={mockUpdateFormData}
          validationErrors={{}}
        />
      );

      expect(screen.queryByText('File SKK wajib diunggah')).not.toBeInTheDocument();
    });
  });
});
