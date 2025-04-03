import { render, screen, fireEvent } from '@testing-library/react';
import RecommendationCard, { StatusType, RecommendationResponseDTO } from '@/components/ui/recommendation';
import '@testing-library/jest-dom';

// Mock data for recommendations
const mockRecommendations: RecommendationResponseDTO[] = [
  {
    id: '1',
    talentId: 'talent_1',
    contractorId: 101,
    contractorName: 'Contractor A',
    message: 'This is a detailed recommendation message that might overflow when it exceeds a certain height limit.',
    status: StatusType.PENDING,
  },
  {
    id: '2',
    talentId: 'talent_2',
    contractorId: 102,
    contractorName: 'Contractor B',
    message: 'Short recommendation message.',
    status: StatusType.APPROVED,
  },
  {
    id: '3',
    talentId: 'talent_3',
    contractorId: 103,
    contractorName: 'Contractor C',
    message: '',
    status: StatusType.APPROVED
  },
];

const loremIpsum = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
  in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
  sunt in culpa qui officia deserunt mollit anim id est laborum.
  
  Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, 
  nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. 
  Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien 
  risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi.
`;

// Mock functions for accept and decline actions
const mockAccept = jest.fn();
const mockDecline = jest.fn();

// Mock implementation of ResizeObserver
class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

// Set up mock for window.ResizeObserver
global.ResizeObserver = ResizeObserverMock;

// Mock the scrollHeight property for testing overflow
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
const originalScrollHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight');

describe('RecommendationCard Component', () => {
  // Reset mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
    
    if (originalScrollHeight) {
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', originalScrollHeight);
    }
    
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  test('renders the component with recommendations', () => {
    render(<RecommendationCard recommendations={mockRecommendations} onAccept={mockAccept} onDecline={mockDecline} />);

    // Check if the contractor names are rendered
    expect(screen.getByText('Contractor A')).toBeInTheDocument();
    expect(screen.getByText('Contractor B')).toBeInTheDocument();
    expect(screen.getByText('Contractor C')).toBeInTheDocument();

    // Check if the messages are rendered
    expect(screen.getByText('This is a detailed recommendation message that might overflow when it exceeds a certain height limit.')).toBeInTheDocument();
    expect(screen.getByText('Short recommendation message.')).toBeInTheDocument();
    
    // Check for empty message
    const contractorCDiv = screen.getByText('Contractor C').closest('div')?.parentElement;
    expect(contractorCDiv).toBeInTheDocument();
  });

  test('displays the "No Recommendations" message when no recommendations are passed', () => {
    render(<RecommendationCard recommendations={[]} onAccept={mockAccept} onDecline={mockDecline} />);

    // Check if the "No Recommendations" message is displayed
    expect(screen.getByText('Tidak ada Rekomendasi.')).toBeInTheDocument();
  });

  test('shows the "Lihat Lebih Banyak" button when the message overflows', () => {
    // Mock scrollHeight to simulate overflow
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function() {
        if (this.classList.contains('overflow-hidden')) {
          return 150; // Greater than the max-height (112px)
        }
        return 20;
      }
    });

    render(<RecommendationCard recommendations={mockRecommendations} onAccept={mockAccept} onDecline={mockDecline} />);

    // The "Lihat Lebih Banyak" button should be visible due to the mocked overflow
    expect(screen.getAllByText('Lihat Lebih Banyak').length).toBeGreaterThan(0);
  });

  test('expands the message when the "Lihat Lebih Banyak" button is clicked', () => {
    // Mock scrollHeight to simulate overflow
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function() {
        if (this.classList.contains('overflow-hidden')) {
          return 150; // Greater than the max-height (112px)
        }
        return 20;
      }
    });

    render(<RecommendationCard recommendations={mockRecommendations} onAccept={mockAccept} onDecline={mockDecline} />);

    // Click to expand the message
    fireEvent.click(screen.getByText('Lihat Lebih Banyak'));

    // After expanding, the "Lihat Lebih Sedikit" button should appear
    expect(screen.getAllByText('Lihat Lebih Sedikit').length).toBeGreaterThan(0);
  });

  test('collapses the message when the "Lihat Lebih Sedikit" button is clicked', () => {
    // Mock scrollHeight to simulate overflow
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function() {
        if (this.classList.contains('overflow-hidden')) {
          return 150; // Greater than the max-height (112px)
        }
        return 20;
      }
    });
  
    render(<RecommendationCard recommendations={mockRecommendations} onAccept={mockAccept} onDecline={mockDecline} />);
  
    // Get the specific expand button for the first recommendation
    const expandButtons = screen.getAllByText('Lihat Lebih Banyak');
    const firstExpandButton = expandButtons[0]; // Take the first one
    
    // Expand first
    fireEvent.click(firstExpandButton);
  
    // Get the collapse button
    const collapseButton = screen.getByText('Lihat Lebih Sedikit');
    
    // Then collapse
    fireEvent.click(collapseButton);
  
    // After collapsing, the "Lihat Lebih Banyak" button should appear again
    expect(screen.getAllByText('Lihat Lebih Banyak').length).toBeGreaterThan(0);
    // OR use this alternative assertion
    // expect(screen.getByText('Lihat Lebih Banyak')).toBeInTheDocument();
  });

  test('does not show the "Lihat Lebih Banyak" button for recommendations without overflow', () => {
    // Mock scrollHeight to simulate no overflow
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function() {
        return 50; // Less than the max-height (112px)
      }
    });

    const shortRecommendations = [
      {
        id: '4',
        talentId: 'talent_4',
        contractorId: 104,
        contractorName: 'Contractor D',
        message: 'Short message.',
        status: StatusType.PENDING,
      },
    ];

    render(<RecommendationCard recommendations={shortRecommendations} onAccept={mockAccept} onDecline={mockDecline} />);

    // The "Lihat Lebih Banyak" button should not be visible
    expect(screen.queryByText('Lihat Lebih Banyak')).not.toBeInTheDocument();
  });

  test('does not show action buttons for accepted recommendations', () => {
    const approvedRecommendations = [
      {
        id: '4',
        talentId: 'talent_4',
        contractorId: 104,
        contractorName: 'Contractor D',
        message: 'Accepted recommendation.',
        status: StatusType.APPROVED,
      },
    ];

    render(<RecommendationCard recommendations={approvedRecommendations} onAccept={mockAccept} onDecline={mockDecline} />);

    // Ensure action buttons are not rendered for the approved recommendation
    expect(screen.queryByText('Terima')).toBeNull();
    expect(screen.queryByText('Tolak')).toBeNull();
  });

  test('does not show action buttons for declined recommendations', () => {
    const declinedRecommendations = [
      {
        id: '5',
        talentId: 'talent_5',
        contractorId: 105,
        contractorName: 'Contractor E',
        message: 'Declined recommendation.',
        status: StatusType.DECLINED,
      },
    ];

    render(<RecommendationCard recommendations={declinedRecommendations} onAccept={mockAccept} onDecline={mockDecline} />);

    // Ensure action buttons are not rendered for the declined recommendation
    expect(screen.queryByText('Terima')).toBeNull();
    expect(screen.queryByText('Tolak')).toBeNull();
  });

  test('shows action buttons for pending recommendations', () => {
    render(<RecommendationCard recommendations={mockRecommendations} onAccept={mockAccept} onDecline={mockDecline} />);

    // Ensure action buttons are rendered for the pending recommendation
    expect(screen.getByText('Terima')).toBeInTheDocument();
    expect(screen.getByText('Tolak')).toBeInTheDocument();
  });

  test('calls onAccept when accept button is clicked', () => {
    render(<RecommendationCard recommendations={mockRecommendations} onAccept={mockAccept} onDecline={mockDecline} />);

    // Click the accept button
    fireEvent.click(screen.getByText('Terima'));

    // Ensure onAccept was called with the correct recommendation ID
    expect(mockAccept).toHaveBeenCalledWith('1');
  });

  test('calls onDecline when decline button is clicked', () => {
    render(<RecommendationCard recommendations={mockRecommendations} onAccept={mockAccept} onDecline={mockDecline} />);

    // Click the decline button
    fireEvent.click(screen.getByText('Tolak'));

    // Ensure onDecline was called with the correct recommendation ID
    expect(mockDecline).toHaveBeenCalledWith('1');
  });

  test('handles recommendations with empty messages correctly', () => {
    const emptyMessageRecommendation = [
      {
        id: '6',
        talentId: 'talent_6',
        contractorId: 106,
        contractorName: 'Contractor F',
        message: '',
        status: StatusType.PENDING,
      },
    ];

    render(<RecommendationCard recommendations={emptyMessageRecommendation} onAccept={mockAccept} onDecline={mockDecline} />);

    // Ensure the contractor name is rendered
    expect(screen.getByText('Contractor F')).toBeInTheDocument();
    
    // Ensure action buttons are rendered (since status is PENDING)
    expect(screen.getByText('Terima')).toBeInTheDocument();
    expect(screen.getByText('Tolak')).toBeInTheDocument();
    
    // No expand button should be present for empty messages
    expect(screen.queryByText('Lihat Lebih Banyak')).not.toBeInTheDocument();
  });

  test('correctly handles very long messages that overflow', () => {
    // Mock scrollHeight to simulate a large overflow
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function() {
        if (this.classList.contains('overflow-hidden')) {
          return 1000; // Much greater than the max-height (112px)
        }
        return 20;
      }
    });
    
    const longMessageRecommendation = [
      {
        id: '7',
        talentId: 'talent_7',
        contractorId: 107,
        contractorName: 'Contractor G',
        message: loremIpsum,
        status: StatusType.PENDING,
      },
    ];

    render(<RecommendationCard recommendations={longMessageRecommendation} onAccept={mockAccept} onDecline={mockDecline} />);

    // Ensure the expand button is visible
    expect(screen.getByText('Lihat Lebih Banyak')).toBeInTheDocument();
    
    // Expand the message
    fireEvent.click(screen.getByText('Lihat Lebih Banyak'));
    
    // Ensure the collapse button is now visible
    expect(screen.getByText('Lihat Lebih Sedikit')).toBeInTheDocument();
  });

  
  test('displays "Tidak ada Rekomendasi." when recommendations is undefined', () => {
    // Test with undefined recommendations
    render(<RecommendationCard recommendations={undefined as any} />);
    expect(screen.getByText('Tidak ada Rekomendasi.')).toBeInTheDocument();
  
  });
});