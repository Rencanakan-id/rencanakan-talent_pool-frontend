import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Navbar } from '../../../components/layout/navbar';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Navbar Component', () => {
  test('calls handleLogout when Logout button is clicked (website page)', () => {
    render(<Navbar />);
    
    const logoutButton = screen.getAllByText('Logout')[0]; // Ambil tombol logout pertama yang ditemukan
    fireEvent.click(logoutButton);
    
    expect(console.log).toHaveBeenCalledWith('Logout clicked');
  });
});
