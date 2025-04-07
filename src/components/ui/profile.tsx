import { FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { Typography } from '../atoms/typography';
import { Badge } from './badge';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  job: string;
  photo: string;
  aboutMe: string;
  price: number;
  nik: string;
  npwp: string;
  photoKtp: string;
  photoNpwp: string;
  photoIjazah: string;
  experienceYears: number;
  skkLevel: string;
  currentLocation: string;
  preferredLocations: string[];
  skill: string;
}
interface UserProfileProps {
  user: UserProfile | null;
}

const UserProfileCard: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col items-center space-y-2 md:items-start">
        <Typography variant="h1">
          {user?.firstName} {user?.lastName}
        </Typography>
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt />
          <Typography variant="p1" className="text-rencanakan-dark-gray font-lighter">
            {user?.currentLocation}
          </Typography>
          <div className="h-5 border-l border-gray-400"></div>
          <FaWhatsapp className="text-green-500" />
          <Typography variant="p1" className="text-rencanakan-dark-gray font-lighter">
            {user?.phoneNumber}
          </Typography>
        </div>
        <div className="flex items-center space-y-2 space-x-2">
          <Badge variant={'profileOrange'} className='text-rencanakan-premium-gold-400'> {user?.skkLevel}</Badge>
          <Badge variant={'profileOrange'} className='text-rencanakan-premium-gold-400'> {user?.experienceYears} Tahun Pengalaman</Badge>
          <Badge variant={'profileGray'}> {user?.job}</Badge>
        </div>
      </div>
      <div className="bg-rencanakan-lightest-gray relative flex w-full flex-col justify-center space-y-2 p-6 md:flex-row md:items-center md:justify-start">
        <div className="flex w-full flex-col items-center md:items-start">
          <Typography variant="p2" className="text-rencanakan-dark-gray">
            Perkiraan Harga
          </Typography>
          <Typography variant="h2" className="pt-4">
            Rp {new Intl.NumberFormat('id-ID').format(user?.price ?? 0)}
          </Typography>
        </div>
      </div>

      <div className="w-full rounded-lg border border-gray-300 px-6 py-6">
        <Typography variant="p1" className="pb-4">
          Tentang Saya
        </Typography>
        <Typography variant="p5">{user?.aboutMe}</Typography>
      </div>
    </div>
  );
};
export default UserProfileCard;
