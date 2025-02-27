import { Typography } from '../atoms/typography';

export const Navbar: React.FC = () => {
  const MENU_OPTIONS = [
      { name: 'Beranda', href: '/' },
  ]

  return (
    <div className="flex justify-between bg-gray-200 shaddow-lg px-10 items-center py-4">
      <img src="./rencanakanLogo.svg" alt="Logo" />

      <div className='flex gap-8 items-center'>
        {MENU_OPTIONS.map((menu, index) => (
            <a key={index} href={menu.href} className='text-gray-600 hover:text-gray-800'>{menu.name}</a>
        ))}
        <div className='flex gap-1'>
          <Typography variant="h6">Halo,</Typography>
          <Typography variant="h6">Aman</Typography>
        </div>
      </div>
    </div>
  );
};
