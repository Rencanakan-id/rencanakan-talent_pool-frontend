import { useState, useEffect } from 'react';
import { Typography } from '../atoms/typography';
import { HiMenu, HiX } from 'react-icons/hi';
import { useOutsideClick } from '../hooks';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/context/authContext';

export const Navbar: React.FC = () => {
  const MENU_OPTIONS = [
    { name: 'Beranda', href: '/' },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = useOutsideClick(() => setIsMobileMenuOpen(false));
  const navigate = useNavigate();
  const { logout, isAuthenticated, user } = useAuth();
  
  // Update body overflow when mobile menu opens/closes to prevent scrolling
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  // Ensure main content has proper padding for the fixed navbar
  useEffect(() => {
    const mainContent = document.querySelector('main') || document.querySelector('#root > div:not(.navbar-container)');
    if (mainContent) {
      mainContent.style.paddingTop = '68px';
    }
    
    return () => {
      if (mainContent) {
        mainContent.style.paddingTop = '';
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar-container fixed top-0 left-0 w-full z-50" style={{ height: '68px' }}>
      <div
        className={`${!isMobileMenuOpen && 'shadow-lg transition-shadow delay-500'} bg-rencanakan-pure-white flex h-18 w-full items-center justify-between px-6 lg:h-20 lg:px-10`}
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

          {isAuthenticated && (
            <div className="hidden items-center gap-1 lg:flex">
            <Typography 
              variant="h6" 
              className="mr-3 font-medium"
              data-testid="desktop-user-name" // Add this line
            >
              {user?.firstName + user?.lastName || 'User'}
            </Typography>
            <img src="./dummy/profile.svg" alt="Profile" className="mr-1" />
          </div>
          )}

          {isAuthenticated && (
            <div className="hidden lg:flex">
              <Button 
                variant={'primary'}
                size={'lg'}
                onClick={handleLogout}
                className="transition-colors duration-200 bg-rencanakan-premium-gold-300 hover:bg-rencanakan-premium-gold-400 border-rencanakan-premium-gold-300 hover:border-rencanakan-premium-gold-400"
                data-testid = "desktop-logout-button"  
              >
                <Typography variant="p2" className="font-medium">
                  Logout
                </Typography>
              </Button>
            </div>
          )}
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

      {/* Mobile menu backdrop - covers the entire screen behind the menu */}
      <div
        className={`bg-rencanakan-pure-black fixed top-[68px] left-0 right-0 bottom-0 opacity-30 transition-opacity duration-500 lg:hidden ${
          isMobileMenuOpen ? 'opacity-30 visible' : 'opacity-0 invisible'
        }`}
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

      {/* Mobile menu - using fixed position with high z-index to ensure visibility */}
      <div
        className={`mobile-menu-container bg-rencanakan-pure-white fixed top-[68px] left-0 w-full z-[100] shadow-lg transition-all duration-500 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
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
          
          {isAuthenticated && (
            <div className="w-full px-6 py-5 flex items-center justify-between border-t border-gray-200">
              <div className="flex items-center gap-2">
                <img src="./dummy/profile.svg" alt="Profile" className="h-8 w-8" />
                <Typography variant="p2" className="font-medium" data-testid="mobile-user-name">
                  {user?.firstName + user?.lastName || 'User'}
                </Typography>
              </div>
              <Button
                variant="primary"
                size={'lg'}
                className="flex items-center gap-1 px-3 py-1 transition-colors duration-200 bg-rencanakan-premium-gold-300 hover:bg-rencanakan-premium-gold-400 border-rencanakan-premium-gold-300 hover:border-rencanakan-premium-gold-400"
                onClick={handleLogout}
                data-testid="mobile-logout-button"
              >
                <Typography variant="p2" className="font-medium">
                  Logout
                </Typography>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
