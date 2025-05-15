import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LandingPageModule } from '@/modules';
import { ButtonProps } from '@/components/ui/button';
import { TypographyProps } from '@/components/atoms/typography';

jest.mock('@/components', () => ({
  Button: ({ children, variant, className, 'data-testid': dataTestId, onClick }: ButtonProps & { 'data-testid'?: string }) => (
    <button 
      data-testid={dataTestId || `mock-button-${variant}`} 
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  ),
  Typography: ({ children, variant, className }: TypographyProps) => (
    <div data-testid={`mock-typography-${variant}`} className={className}>
      {children}
    </div>
  ),
}));

describe('LandingPageModule', () => {
    beforeEach(() => {
    // Mock window.location.href
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: 'http://localhost/' }
    });
  });

  it('renders without crashing', () => {
    render(<LandingPageModule />);
  });

  it('displays the correct heading text', () => {
    render(<LandingPageModule />);

    const headingElements = screen.getAllByTestId('mock-typography-d1');
    expect(headingElements[0]).toHaveTextContent('YUK GABUNG SEBAGAI');
    expect(headingElements[1]).toHaveTextContent('TALENT KAMI');
  });

  it('displays the subheading text', () => {
    render(<LandingPageModule />);

    const subheading = screen.getByTestId('mock-typography-p1');
    expect(subheading).toHaveTextContent('Lebih dari 500 kesempatan kerja menanti kamu!');
  });

  it('renders the hero image', () => {
    render(<LandingPageModule />);

    const heroImage = screen.getByAltText('Hero');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('src', '/landingPage/hero.png');
    expect(heroImage).toHaveClass('animate-float-vertical');
  });

  it('has the animated border element', () => {
    render(<LandingPageModule />);

    const animatedBorder = screen.getByTestId('animated-border');
    expect(animatedBorder).toBeInTheDocument();
    expect(animatedBorder).toHaveClass('animate-glow');
  });

  it('applies correct layout classes', () => {
    render(<LandingPageModule />);

    const mainContainer = screen.getByTestId('main-container');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('overflow-hidden');

    const textContainer = screen.getByTestId('text-container');
    expect(textContainer).toBeInTheDocument();
    expect(textContainer).toHaveClass('lg:w-1/2');

    const imageContainer = screen.getByTestId('image-container');
    expect(imageContainer).toBeInTheDocument();
  });

  test('navigates to register page when "Gabung sekarang" button is clicked', () => {
    render(<LandingPageModule />);
    
    const registerButton = screen.getByTestId('join-button');
    fireEvent.click(registerButton);
    
    expect(window.location.href).toBe('/register');
  });

  test('navigates to login page when "Login" button is clicked', () => {
    render(<LandingPageModule />);
    
    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);
    
    expect(window.location.href).toBe('/login');
  });

  test('displays hero image with animated border', () => {
    render(<LandingPageModule />);
    
    const heroImage = screen.getByAltText('Hero');
    const animatedBorder = screen.getByTestId('animated-border');
    
    expect(heroImage).toBeInTheDocument();
    expect(animatedBorder).toBeInTheDocument();
  });
});

