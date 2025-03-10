import { Typography } from '../atoms/typography';

export const Footer: React.FC = () => {
  return (
    <div className="flex h-20 items-center border-t-1 px-6 lg:px-10">
      <div className="flex w-full items-center justify-between border-gray-200 text-[#70787F]">
        <Typography variant="p4">© 2025 rencanakan.id</Typography>
        <Typography variant="p4" className="text-rencanakan-sea-blue-300 font-medium">
          Rencanakan.id
        </Typography>
      </div>
    </div>
  );
};
