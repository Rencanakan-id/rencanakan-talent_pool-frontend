import { useState } from 'react';
import { Typography } from '../atoms/typography';
import { HiMenu, HiX } from 'react-icons/hi';
import { useOutsideClick } from '../hooks';
import { Button } from '../ui/button';
import { useAuth } from '../context/authContext';

export const Navbar: React.FC = () => {
  const MENU_OPTIONS = [{ name: 'Beranda', href: '/' }];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = useOutsideClick(() => setIsMobileMenuOpen(false));

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout clicked');
  };

  const { user } = useAuth();

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
            <img src="./dummy/profile.svg" alt="Profile" className="mr-1" />
          </div>

          <div className="hidden lg:flex">
            <Button
              variant={'primary'}
              size={'lg'}
              onClick={handleLogout}
              className="bg-rencanakan-premium-gold-300 hover:bg-rencanakan-premium-gold-400 border-rencanakan-premium-gold-300 hover:border-rencanakan-premium-gold-400 transition-colors duration-200"
            >
              <Typography variant="p2" className="font-medium">
                Logout
              </Typography>
            </Button>
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
        className={`bg-rencanakan-pure-white absolute top-[68px] left-0 z-99 w-full transform transition-transform duration-500 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-[68px]'}`}
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
          
          { user.id != undefined && <div className="w-full px-6 py-5 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center gap-2">
              <img src="./dummy/profile.svg" alt="Profile" className="h-8 w-8" />
              <Typography variant="p2" className="font-medium">
                {user.firstName} {user.lastName}
              </Typography>
            </div>
            <Button
              variant="primary"
              size={'lg'}
              className="bg-rencanakan-premium-gold-300 hover:bg-rencanakan-premium-gold-400 border-rencanakan-premium-gold-300 hover:border-rencanakan-premium-gold-400 flex items-center gap-1 px-3 py-1 transition-colors duration-200"
              onClick={handleLogout}
            >
              <Typography variant="p2" className="font-medium">
                Logout
              </Typography>
            </Button>
          </div>}
        </div>
      </div>
    </div>
  );
};
