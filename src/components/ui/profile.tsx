import { FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { Typography } from '../atoms/typography';
import { Badge } from './badge';
import { Button } from './button';

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
  user: UserProfile;
}

const UserProfileCard: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Typography variant="h1">
          {user.firstName} {user.lastName}
        </Typography>
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt />
          <Typography variant="p1" className="text-gray-600">
            {user.currentLocation}
          </Typography>
          <div className="h-5 border-l border-gray-400"></div>
          <FaWhatsapp className="text-green-500" />
          <Typography variant="p1" className="text-gray-600">
            {user.phoneNumber}
          </Typography>
        </div>
        <div className="flex flex-wrap items-center space-y-2 space-x-2">
          <Badge variant={'profileOrange'}> {user.skkLevel}</Badge>
          <Badge variant={'profileOrange'}> {user.experienceYears} Tahun Pengalaman</Badge>
          <Badge variant={'profileGray'}> {user.job}</Badge>
        </div>
      </div>
      <div className="bg-rencanakan-lightest-gray relative flex w-full flex-col justify-center p-6 sm:flex-row sm:items-center sm:justify-start space-y-2">
        {/* Button di atas kalau layar kecil */}
   
        <div className="sm:absolute sm:top-1/2 sm:right-6  w-full flex justify-center sm:justify-end sm:-translate-y-1/2">
          <Button variant="primary" className="py-4">
            Hubungi {user.firstName}
          </Button>
        </div>

        {/* Text bagian harga */}
        <div className="flex w-full items-center sm:items-start flex-col">
          <Typography variant="p2" className="text-gray-600">
            Perkiraan Harga
          </Typography>
          <Typography variant="h1" className="pt-4">
            Rp {new Intl.NumberFormat("id-ID").format(user.price)}
          </Typography>
        </div>
      </div>

      <div className="w-full rounded-[4px] border border-gray-300 px-6 py-6">
        <Typography variant="p1" className="pb-4">
          Tentang Saya
        </Typography>
        <Typography variant="p5">{user.aboutMe}</Typography>
      </div>
    </div>
  );
};
export default UserProfileCard;
