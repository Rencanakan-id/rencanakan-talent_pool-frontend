import { useState } from 'react';
import { Typography } from '../atoms/typography';
import { HiMenu, HiX } from 'react-icons/hi';
import { useOutsideClick } from '../hooks';

export const Navbar: React.FC = () => {
  const MENU_OPTIONS = [{ name: 'Beranda', href: '/' }];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = useOutsideClick(() => setIsMobileMenuOpen(false));

  return (
    <div className="flex w-full">
      <div
        className={`${!isMobileMenuOpen && 'shadow-lg transition-shadow delay-500'} bg-rencanakan-pure-white z-[999] flex h-18 w-full items-center justify-between px-6 lg:h-20 lg:px-10`}
      >
        <img src="./rencanakanLogo.svg" alt="Logo" className="h-7 lg:h-9" />

        <div className="hidden items-center gap-4 lg:flex lg:gap-8">
          {MENU_OPTIONS.map((menu) => (
            <a key={menu.name} href={menu.href} className="hover:text-rencanakan-dark-gray">
              <Typography variant="h6" className="font-medium">
                {menu.name}
              </Typography>
            </a>
          ))}

          <div className="hidden items-center gap-1 lg:flex">
            <Typography variant="h6" className="mr-3 font-medium">
              Yoga Listyadana
            </Typography>
            <img src="./dummy/profile.svg" alt="Profile" />
          </div>
        </div>

        <div className="flex lg:hidden" ref={closeMenu}>
          <button
            className="p-1 transition-transform duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="bg-rencanakan-pure-black fixed inset-0 opacity-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsMobileMenuOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Mobile Menu Backdrop"
        />
      )}

      <div
        className={`z-99 bg-rencanakan-pure-white absolute top-[68px] left-0 w-full transform transition-transform duration-500 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-[68px]'}`}
      >
        <div className="flex w-full flex-col items-start">
          {MENU_OPTIONS.map((menu) => (
            <a
              key={menu.name}
              href={menu.href}
              className="w-full cursor-pointer rounded px-6 py-5 text-left hover:bg-gray-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Typography variant="p2" className="font-medium">
                {menu.name}
              </Typography>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
