import { render, screen, fireEvent } from '@testing-library/react';
import RecommendationCard, {
  StatusType,
  RecommendationResponseDTO,
} from '../../components/ui/recommendation';
import '@testing-library/jest-dom';

jest.mock('@/components', () => ({
  Typography: () => <div data-testid={`typography`}></div>,
  Button: () => <button data-testid={`button`}></button>,
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
      message: 'This is a very long message that exceeds the character limit. '.repeat(10),
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
    render(
      <RecommendationCard recommendations={undefined as RecommendationResponseDTO[] | undefined} />
    );

    expect(screen.getByText('Tidak ada Rekomendasi.')).toBeInTheDocument();
  });

  it('shows confirmation dialog when Accept button is clicked', () => {
    render(<RecommendationCard recommendations={mockRecommendations} />);
    
    const acceptButton = screen.getByText('Terima');
    fireEvent.click(acceptButton);
    
    expect(screen.getByText('Konfirmasi Penerimaan')).toBeInTheDocument();
    expect(screen.getByText(`Apakah Anda yakin ingin menerima rekomendasi dari Contractor A?`)).toBeInTheDocument();
  });

  it('shows confirmation dialog when Decline button is clicked', () => {
    render(<RecommendationCard recommendations={mockRecommendations} />);
    
    const declineButton = screen.getByText('Tolak');
    fireEvent.click(declineButton);
    
    expect(screen.getByText('Konfirmasi Penolakan')).toBeInTheDocument();
    expect(screen.getByText(`Apakah Anda yakin ingin menolak rekomendasi dari Contractor A?`)).toBeInTheDocument();
  });

  it('calls onAccept only after confirmation is confirmed', () => {
    const mockOnAccept = jest.fn();
    
    render(
      <RecommendationCard
        recommendations={mockRecommendations}
        onAccept={mockOnAccept}
      />
    );
    
    const acceptButton = screen.getByText('Terima');
    fireEvent.click(acceptButton);
    
    expect(screen.getByText('Konfirmasi Penerimaan')).toBeInTheDocument();
    expect(mockOnAccept).not.toHaveBeenCalled();
    
    const confirmButton = screen.getByText('Iya');
    fireEvent.click(confirmButton);
    
    expect(mockOnAccept).toHaveBeenCalledWith('1');
  });

  it('calls onDecline only after confirmation is confirmed', () => {
    const mockOnDecline = jest.fn();
    
    render(
      <RecommendationCard
        recommendations={mockRecommendations}
        onDecline={mockOnDecline}
      />
    );
    
    const declineButton = screen.getByText('Tolak');
    fireEvent.click(declineButton);
    
    expect(screen.getByText('Konfirmasi Penolakan')).toBeInTheDocument();
    expect(mockOnDecline).not.toHaveBeenCalled();
    
    const confirmButton = screen.getByRole('button', { name: 'Tolak' });
    fireEvent.click(confirmButton);
    
    expect(mockOnDecline).toHaveBeenCalledWith('1');
  });

  it('does not call callbacks when confirmation is canceled', () => {
    const mockOnAccept = jest.fn();
    const mockOnDecline = jest.fn();
    
    render(
      <RecommendationCard
        recommendations={mockRecommendations}
        onAccept={mockOnAccept}
        onDecline={mockOnDecline}
      />
    );
    
    fireEvent.click(screen.getByText('Terima'));
    fireEvent.click(screen.getByText('Tidak'));
    fireEvent.click(screen.getByText('Tolak'));
    fireEvent.click(screen.getByText('Tidak'));

    expect(mockOnAccept).not.toHaveBeenCalled();
    expect(mockOnDecline).not.toHaveBeenCalled();
  });
});
