
import { render, screen, fireEvent } from '@testing-library/react';
import RecommendationCard, { StatusType, RecommendationResponseDTO } from '../../components/ui/recommendation';
import '@testing-library/jest-dom'; 

jest.mock('@/components', () => ({
  Typography: ({ children, variant, className }: any) => (
    <div data-testid={`typography-${variant}`} className={className}>
      {children}
    </div>
  ),
  Button: ({ children, variant, onClick }: any) => (
    <button data-testid={`button-${variant}`} onClick={onClick}>
      {children}
    </button>
  ),
}));


describe('RecommendationCard', () => {
  const mockRecommendations: RecommendationResponseDTO[] = [
    {
      id: '1',
      talentId: 'talent-1',
      contractorId: 101,
      contractorName: 'Contractor A',
      message: 'This is a short message.',
      status: StatusType.PENDING,
    },
    {
      id: '2',
      talentId: 'talent-2',
      contractorId: 102,
      contractorName: 'Contractor B',
      message: 'This is a very long message that exceeds the character limit. '.repeat(10), // Makes it longer than 250 chars
      status: StatusType.APPROVED,
    },
    {
      id: '3',
      talentId: 'talent-3',
      contractorId: 103,
      contractorName: 'Contractor C',
      message: 'Another message.',
      status: StatusType.DECLINED,
    },
  ];

  it('renders the "No Recommendations" message when recommendations array is empty', () => {
    render(<RecommendationCard recommendations={[]} />);
    
    expect(screen.getByText('Tidak ada Rekomendasi.')).toBeInTheDocument();
  });

  it('renders all recommendation items when recommendations are provided', () => {
    render(<RecommendationCard recommendations={mockRecommendations} />);
    
    expect(screen.getByText('Contractor A')).toBeInTheDocument();
    expect(screen.getByText('Contractor B')).toBeInTheDocument();
    expect(screen.getByText('Contractor C')).toBeInTheDocument();
  });

  it('renders action buttons only for PENDING recommendations', () => {
    render(<RecommendationCard recommendations={mockRecommendations} />);


    const terimaButtons = screen.getAllByText('Terima');
    expect(terimaButtons).toHaveLength(1);

    const tolakButtons = screen.getAllByText('Tolak');
    expect(tolakButtons).toHaveLength(1);
      
      });

  it('calls onAccept function when Accept button is clicked', () => {
    const mockOnAccept = jest.fn();
    const mockOnDecline = jest.fn();
    
    render(
      <RecommendationCard 
        recommendations={mockRecommendations} 
        onAccept={mockOnAccept} 
        onDecline={mockOnDecline}
      />
    );
    

    const acceptButton = screen.getByText('Terima');
    fireEvent.click(acceptButton);
    

    expect(mockOnAccept).toHaveBeenCalledWith('1');
    expect(mockOnDecline).not.toHaveBeenCalled();
  });

  it('calls onDecline function when Decline button is clicked', () => {
    const mockOnAccept = jest.fn();
    const mockOnDecline = jest.fn();
    
    render(
      <RecommendationCard 
        recommendations={mockRecommendations} 
        onAccept={mockOnAccept} 
        onDecline={mockOnDecline}
      />
    );
    

    const declineButton = screen.getByText('Tolak');
    fireEvent.click(declineButton);
    

    expect(mockOnDecline).toHaveBeenCalledWith('1');
    expect(mockOnAccept).not.toHaveBeenCalled();
  });

  it('handles undefined onAccept and onDecline callbacks gracefully', () => {
    render(<RecommendationCard recommendations={mockRecommendations} />);
    

    const acceptButton = screen.getByText('Terima');
    const declineButton = screen.getByText('Tolak');
    
    expect(() => {
      fireEvent.click(acceptButton);
      fireEvent.click(declineButton);
    }).not.toThrow();
  });

  it('truncates long messages and shows "See More" button', () => {
    render(<RecommendationCard recommendations={mockRecommendations} />);
    

    expect(screen.getByText(/This is a very long message/)).toBeInTheDocument();
    expect(screen.getByText('Lihat Lebih Banyak')).toBeInTheDocument();
  });

  it('expands truncated message when "See More" is clicked', () => {
    render(<RecommendationCard recommendations={mockRecommendations} />);
    

    fireEvent.click(screen.getByText('Lihat Lebih Banyak'));
    

    expect(screen.getByText('Lihat Lebih Sedikit')).toBeInTheDocument();
    

    const fullMessage = 'This is a very long message that exceeds the character limit. '.repeat(10);
    expect(screen.getByText(new RegExp(fullMessage.substring(0, 50)))).toBeInTheDocument();
  });

  it('collapses expanded message when "See Less" is clicked', () => {
    render(<RecommendationCard recommendations={mockRecommendations} />);
    

    fireEvent.click(screen.getByText('Lihat Lebih Banyak'));

    fireEvent.click(screen.getByText('Lihat Lebih Sedikit'));

    expect(screen.getByText('Lihat Lebih Banyak')).toBeInTheDocument();
  });

  it('does not show expand/collapse buttons for short messages', () => {
    render(<RecommendationCard recommendations={mockRecommendations} />);
    

    const contractorA = screen.getByText('Contractor A');
    const contractorASection = contractorA?.closest('div')?.parentElement;
    

    expect(contractorASection?.textContent).not.toContain('Lihat Lebih Banyak');
  });

  it('handles undefined recommendations gracefully', () => {
    // @ts-ignore - intentionally passing undefined to test defaulting to empty array
    render(<RecommendationCard />);
    
    expect(screen.getByText('Tidak ada Rekomendasi.')).toBeInTheDocument();
  });
});