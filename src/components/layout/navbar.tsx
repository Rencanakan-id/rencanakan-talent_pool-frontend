import { useState } from 'react';
import { Typography } from '../atoms/typography';
import { HiMenu, HiX } from 'react-icons/hi';
import { useOutsideClick } from '../hooks';

export const Navbar: React.FC = () => {
  const MENU_OPTIONS = [{ name: 'Beranda', href: '/' }];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const ref = useOutsideClick(() => setIsMobileMenuOpen(false));

  return (
    <div className="shadow-lg flex h-18 lg:h-20 items-center justify-between bg-rencanakan-pure-white px-6 lg:px-10">
      <img src="./rencanakanLogo.svg" alt="Logo" className='h-7 lg:h-9'/>

      <div className="hidden lg:flex items-center gap-4 lg:gap-8">
        {MENU_OPTIONS.map((menu, index) => (
          <a key={index} href={menu.href} className=" hover:text-gray-800 font-medium">
            {menu.name}
          </a>
        ))}

        <div className="hidden lg:flex gap-1 items-center">
          <Typography variant="h6" className='mr-3 font-medium'>Yoga Listyadana</Typography>
          <img src="./dummy/profile.svg" />
        </div>
      </div>

      <div className="flex lg:hidden" ref={ref}>
        <button
          className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : 'rotate-0'} p-1`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="flex lg:hidden fixed inset-0 opacity-30 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {isMobileMenuOpen && (
        <div className="flex lg:hidden absolute top-[68px] left-0 w-full bg-white z-[999] shadow-xl">
          <div className="flex flex-col items-start w-full">
            {MENU_OPTIONS.map((menu, key) => (
              // <Button></Button>
              // <a
              //   className="w-full text-left py-4 px-4 hover:bg-black-5 rounded hover:bg-gray-200 cursor-pointer"
              //   key={key}
              //   onClick={() => {
              //     // TODO: use button DS
              //     // handleMenuClick(menu.route);
              //     setIsMobileMenuOpen(false);
              //   }}
              // >
              //   <Typography variant="p3">{menu.name}</Typography>
              // </a>
            ))}
          </div>
        </div>

          )}
    </div>
  )};

