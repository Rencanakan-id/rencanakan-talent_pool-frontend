import { render, screen } from '@testing-library/react';
import UserProfileCard from '@/components/ui/profile';
import { UserProfile } from '@/components/ui/profile';
import '@testing-library/jest-dom';

const mockUser: UserProfile = {
  id: '1',
  firstName: 'Gabriella',
  lastName: 'Naomi',
  email: 'gabriella@example.com',
  phoneNumber: '+62 8123456789',
  address: 'Jl. Merdeka No.1, Jakarta',
  job: 'Software Engineer',
  photo: '',
  aboutMe: 'Saya adalah seorang software engineer dengan pengalaman di React dan NestJS.',
  nik: '1234567890',
  npwp: '9876543210',
  price: 7500000,
  photoKtp: '',
  photoNpwp: '',
  photoIjazah: '',
  experienceYears: 5,
  skkLevel: 'Level 3',
  currentLocation: 'Surabaya, Jawa Timur',
  preferredLocations: ['Jakarta', 'Bandung'],
  skill: 'React, TypeScript, NestJS',
};

describe('UserProfileCard Component', () => {
  test('renders user name correctly', () => {
    render(<UserProfileCard user={mockUser} />);
    expect(screen.getByText('Gabriella Naomi')).toBeInTheDocument();
  });

  test('renders user location correctly', () => {
    render(<UserProfileCard user={mockUser} />);
    expect(screen.getByText('Surabaya, Jawa Timur')).toBeInTheDocument();
  });

  test('renders phone number correctly', () => {
    render(<UserProfileCard user={mockUser} />);
    expect(screen.getByText('+62 8123456789')).toBeInTheDocument();
  });

  test('renders job title correctly', () => {
    render(<UserProfileCard user={mockUser} />);
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  test('renders experience correctly', () => {
    render(<UserProfileCard user={mockUser} />);
    expect(screen.getByText('5 Tahun Pengalaman')).toBeInTheDocument();
  });

  test('renders about me section', () => {
    render(<UserProfileCard user={mockUser} />);
    expect(screen.getByText('Tentang Saya')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Saya adalah seorang software engineer dengan pengalaman di React dan NestJS.'
      )
    ).toBeInTheDocument();
  });

  test('renders estimated price section', () => {
    render(<UserProfileCard user={mockUser} />);
    expect(screen.getByText('Perkiraan Harga')).toBeInTheDocument();
    expect(screen.getByText('Rp 7.500.000')).toBeInTheDocument();
  });
});
