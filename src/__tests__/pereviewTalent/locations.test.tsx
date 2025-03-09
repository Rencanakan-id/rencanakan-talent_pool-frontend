import { render, screen } from '@testing-library/react';
import Location from '../../components/ui/location';

describe('Location Component', () => {
  test('menampilkan teks default jika tidak ada data', () => {
    render(<Location data={[]} />);
    expect(screen.getByText('Bersedia Ditempatkan di Kota')).toBeInTheDocument();
    expect(screen.getByText('Belum memilih lokasi')).toBeInTheDocument();
  });

  test('Tetap bekerja jika data tidak diberikan', () => {
    render(<Location />);
    expect(screen.getByText('Bersedia Ditempatkan di Kota')).toBeInTheDocument();
    expect(screen.getByText('Belum memilih lokasi')).toBeInTheDocument();
  });

  test('menampilkan daftar lokasi dengan data', () => {
    const cities = ['Jakarta', 'Bandung', 'Surabaya'];
    render(<Location data={cities} />);

    expect(screen.getByText('Bersedia Ditempatkan di Kota')).toBeInTheDocument();

    cities.forEach((city) => {
      expect(screen.getByText(city)).toBeInTheDocument();
    });
  });
});
