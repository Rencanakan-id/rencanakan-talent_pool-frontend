import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LandingPageModule } from '@/modules';

jest.mock('@/components', () => ({
  Button: ({ children, variant, className }: any) => (
    <button data-testid={`mock-button-${variant}`} className={className}>
      {children}
    </button>
  ),
  Typography: ({ children, variant, className }: any) => (
    <div data-testid={`mock-typography-${variant}`} className={className}>
      {children}
    </div>
  ),
}));

describe('LandingPageModule', () => {
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

  it('renders the call-to-action buttons', () => {
    render(<LandingPageModule />);
    
    const primaryButton = screen.getByTestId('mock-button-secondary');
    const secondaryButton = screen.getByTestId('mock-button-secondary-outline');
    
    expect(primaryButton).toBeInTheDocument();
    expect(secondaryButton).toBeInTheDocument();
    
    const buttonTexts = screen.getAllByTestId('mock-typography-p2');
    expect(buttonTexts[0]).toHaveTextContent('Gabung sekarang');
    expect(buttonTexts[1]).toHaveTextContent('Login');
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
    expect(textContainer).toHaveClass('w-1/2');
    
    const imageContainer = screen.getByTestId('image-container');
    expect(imageContainer).toBeInTheDocument();
  });
});