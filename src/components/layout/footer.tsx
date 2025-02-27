import { Typography } from '../atoms/typography';

export const Footer: React.FC = () => {
  return (
    <div className="mx-5 flex h-20 items-center border-t-1 px-1 lg:mx-10 lg:px-10">
      <div className="flex w-full items-center justify-between border-gray-200 text-[#70787F]">
        <Typography variant="b2">© 2025 rencanakan.id</Typography>
        <Typography variant="b2">Rencanakan.id</Typography>
      </div>
    </div>
  );
};
