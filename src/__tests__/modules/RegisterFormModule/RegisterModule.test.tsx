import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterModule } from '@/modules/RegisterFormModule';
import { validateStepOneForm } from '@/lib/validation/stepOneFormValidation';
import { validateStepTwoForm } from '@/lib/validation/stepTwoFormValidation';
import { validateStepFourForm } from '@/lib/validation/stepFourFormValidation';
import { checkStepCompleteness } from '@/lib/validation/formCompletenessValidation';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';


// Mock the validation functions
jest.mock('@/lib/validation/stepOneFormValidation', () => ({
  validateStepOneForm: jest.fn()
}));
jest.mock('@/lib/validation/stepTwoFormValidation', () => ({
  validateStepTwoForm: jest.fn()
}));
jest.mock('@/lib/validation/stepFourFormValidation', () => ({
  validateStepFourForm: jest.fn()
}));
jest.mock('@/lib/validation/formCompletenessValidation', () => ({
  checkStepCompleteness: jest.fn()
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock fetch
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
    text: () => Promise.resolve(JSON.stringify({ success: true }))
  })
) as jest.Mock;

// Create a mock file
const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

describe('RegisterModule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock validation functions to return valid by default
    (checkStepCompleteness as jest.Mock).mockImplementation(() => true);
    (validateStepOneForm as jest.Mock).mockReturnValue({ isValid: true, errors: {} });
    (validateStepTwoForm as jest.Mock).mockReturnValue({ isValid: true, errors: {} });
    (validateStepFourForm as jest.Mock).mockReturnValue({ isValid: true, errors: {} });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <RegisterModule />
      </BrowserRouter>
    );
  };

  it('renders the first step form initially', () => {
    renderComponent();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
  });

  it('disables Next button when step is not valid', () => {
    (checkStepCompleteness as jest.Mock).mockReturnValue(false);
    renderComponent();
    
    const nextButton = screen.getByText('Selanjutnya');
    expect(nextButton).toBeDisabled();
  });

  it('enables Next button when step is valid', () => {
    (checkStepCompleteness as jest.Mock).mockReturnValue(true);
    renderComponent();
    
    const nextButton = screen.getByText('Selanjutnya');
    expect(nextButton).toBeEnabled();
  });

  describe('Navigation between steps', () => {
    it('navigates to step 2 when Next is clicked on step 1', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const nextButton = screen.getByText('Selanjutnya');
      await user.click(nextButton);
      
      // Check if step 2 elements are visible
      expect(validateStepOneForm).toHaveBeenCalled();
      expect(screen.getByLabelText(/about me/i)).toBeInTheDocument();
    });

    it('stays on step 1 if validation fails', async () => {
      const user = userEvent.setup();
      (validateStepOneForm as jest.Mock).mockReturnValue({
        isValid: false,
        errors: { firstName: 'First name is required' }
      });
      
      renderComponent();
      
      const nextButton = screen.getByText('Selanjutnya');
      await user.click(nextButton);
      
      // Should stay on step 1
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });

    it('navigates back to previous step when Kembali button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      // Go to step 2
      await user.click(screen.getByText('Selanjutnya'));
      
      // Go back to step 1
      await user.click(screen.getByText('Kembali'));
      
      // Should be on step 1 again
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    });

    it('shows the submit button on step 4', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      // Navigate to step 4
      await user.click(screen.getByText('Selanjutnya')); // to step 2
      await user.click(screen.getByText('Selanjutnya')); // to step 3
      await user.click(screen.getByText('Selanjutnya')); // to step 4
      
      // Should show the register button on step 4
      expect(screen.getByText('Daftar Kerja')).toBeInTheDocument();
    });
  });

  describe('Form Data Handling', () => {
    it('updates form data when inputs change', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.type(firstNameInput, 'John');
      
      // Navigate to step 2 to verify data is retained
      await user.click(screen.getByText('Selanjutnya'));
      
      // Go back to step 1
      await user.click(screen.getByText('Kembali'));
      
      // Check if data is preserved
      expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
    });

    it('handles file uploads', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const fileInput = screen.getByLabelText(/upload ktp/i);
      await user.upload(fileInput, mockFile);
      
      // Check if the file is uploaded
      const input = fileInput as HTMLInputElement;
      expect(input.files?.[0]).toStrictEqual(mockFile);
    });
  });

  describe('Form Submission', () => {
    it('submits form data and navigates to login page on success', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
        text: async () => JSON.stringify({ success: true })
      });

      renderComponent();
      
      // Fill out step 1
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByText('Selanjutnya'));
      
      // Navigate through steps
      await user.click(screen.getByText('Selanjutnya')); // to step 3
      await user.click(screen.getByText('Selanjutnya')); // to step 4
      
      // Fill password fields
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123!');
      
      // Submit
      await user.click(screen.getByText('Daftar Kerja'));
      
      // Check if API was called
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/auth/register',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          })
        })
      );
      
      // Check if navigation occurred
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('shows error message on submission failure', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Email already exists'
      });

      renderComponent();
      
      // Navigate through steps
      await user.click(screen.getByText('Selanjutnya')); // to step 2
      await user.click(screen.getByText('Selanjutnya')); // to step 3
      await user.click(screen.getByText('Selanjutnya')); // to step 4
      
      // Submit
      await user.click(screen.getByText('Daftar Kerja'));
      
      // Check if error message appears
      await waitFor(() => {
        expect(screen.getByText('Email already exists')).toBeInTheDocument();
      });
    });

    it('displays loading state during submission', async () => {
      const user = userEvent.setup();
      
      // Create a promise that we can resolve later
      let resolveFetch!: (value: any) => void;
      const fetchPromise = new Promise((resolve) => {
        resolveFetch = resolve;
      });
      
      (global.fetch as jest.Mock).mockImplementationOnce(() => fetchPromise);

      renderComponent();
      
      // Navigate through steps
      await user.click(screen.getByText('Selanjutnya')); // to step 2
      await user.click(screen.getByText('Selanjutnya')); // to step 3
      await user.click(screen.getByText('Selanjutnya')); // to step 4
      
      // Submit
      await user.click(screen.getByText('Daftar Kerja'));
      
      // Check if loading state is visible
      expect(screen.getByText('Memproses...')).toBeInTheDocument();
      
      // Resolve the fetch promise
      resolveFetch?.({
        ok: true,
        json: async () => ({ success: true }),
        text: async () => JSON.stringify({ success: true })
      });
      
      // Wait for loading state to go away
      await waitFor(() => {
        expect(screen.queryByText('Memproses...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('validates step 1 form data', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      await user.click(screen.getByText('Selanjutnya'));
      
      expect(validateStepOneForm).toHaveBeenCalled();
    });

    it('validates step 2 form data', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      await user.click(screen.getByText('Selanjutnya')); // to step 2
      await user.click(screen.getByText('Selanjutnya')); // trying to go to step 3
      
      expect(validateStepTwoForm).toHaveBeenCalled();
    });

    it('validates step 4 form data on submission', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      await user.click(screen.getByText('Selanjutnya')); // to step 2
      await user.click(screen.getByText('Selanjutnya')); // to step 3
      await user.click(screen.getByText('Selanjutnya')); // to step 4
      await user.click(screen.getByText('Daftar Kerja')); // submit
      
      expect(validateStepFourForm).toHaveBeenCalled();
    });
    
    it('displays validation errors when present', async () => {
      const user = userEvent.setup();
      (validateStepOneForm as jest.Mock).mockReturnValue({
        isValid: false,
        errors: { email: 'Invalid email format' }
      });
      
      renderComponent();
      
      await user.click(screen.getByText('Selanjutnya'));
      
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });
  
  describe('Experience Years Parsing', () => {
    it('correctly parses experience years on submission', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
        text: async () => JSON.stringify({ success: true })
      });

      renderComponent();
      
      // Navigate to step 2
      await user.click(screen.getByText('Selanjutnya'));
      
      // Select years of experience
      const expSelect = screen.getByLabelText(/years of experience/i);
      await user.selectOptions(expSelect, '5 Tahun');
      
      // Complete the form
      await user.click(screen.getByText('Selanjutnya')); // to step 3
      await user.click(screen.getByText('Selanjutnya')); // to step 4
      await user.click(screen.getByText('Daftar Kerja')); // submit
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: expect.stringContaining('"experienceYears":3')
          })
        );
      });
    });
  });
});