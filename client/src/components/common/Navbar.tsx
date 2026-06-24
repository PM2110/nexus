import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from './Button';
import { BrandIcon } from './Icons';
import '../../styles/navbar.css';

interface NavbarProps {
  activeSection?: string;
  onNavClick?: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
  scrollToSection?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavClick,
  scrollToSection,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  const handleScrollToSection = (id: string) => {
    if (scrollToSection) {
      scrollToSection(id);
    } else {
      navigate('/dashboard');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleBrandClick = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const navClassName = isHomePage
    ? `nav-bar ${isScrolled ? 'nav-bar-scrolled' : 'nav-bar-transparent'}`
    : 'app-nav';

  const containerClassName = isHomePage ? 'nav-container' : 'wrap-xl nav-inner';

  return (
    <nav className={navClassName}>
      <div className={containerClassName}>
        <div className="brand" onClick={handleBrandClick}>
          <BrandIcon size={26} className="brand-mark" />
          <span className="brand-name">{t('common.brand')}</span>
        </div>

        <div className="nav-links">
          {isAuthenticated ? (
            // Logged In Navigation Options
            <>
              {isHomePage ? (
                <>
                  <a
                    href="#features"
                    onClick={(e) => onNavClick?.(e, 'features')}
                    className={`nav-link ${activeSection === 'features' ? 'nav-link-active' : 'nav-link-inactive'}`}
                  >
                    {t('nav.features')}
                  </a>
                  <a
                    href="#workspaces"
                    onClick={(e) => onNavClick?.(e, 'workspaces')}
                    className={`nav-link ${activeSection === 'workspaces' ? 'nav-link-active' : 'nav-link-inactive'}`}
                  >
                    {t('nav.workspaces')}
                  </a>
                  <a
                    href="#workflow"
                    onClick={(e) => onNavClick?.(e, 'workflow')}
                    className={`nav-link ${activeSection === 'workflow' ? 'nav-link-active' : 'nav-link-inactive'}`}
                  >
                    {t('nav.how_it_works')}
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="text-xs py-1.5 px-3 border-[#1ec8b5]/20 text-[#1ec8b5] hover:bg-[#1ec8b5]/5 hover:border-[#1ec8b5]"
                  >
                    Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleScrollToSection('workspaces-section')}
                    className="nav-link"
                  >
                    {t('dashboard.nav_workspaces')}
                  </button>
                  <button
                    onClick={() => handleScrollToSection('friends-section')}
                    className="nav-link"
                  >
                    {t('dashboard.nav_friends')}
                  </button>
                </>
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-[#1ec8b5]/20 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#131a24] border border-[#222b38] flex items-center justify-center font-mono text-xs font-semibold text-[#1ec8b5]">
                      {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-[#9aa5b3] hidden sm:inline">{user?.name}</span>
                </div>

                <Button
                  variant="text"
                  onClick={logout}
                  className="text-xs text-[#5e6a7a] hover:text-[#e0596b] transition-colors p-0 bg-transparent border-none cursor-pointer"
                >
                  {t('dashboard.nav_sign_out', { defaultValue: 'Sign out' })}
                </Button>
              </div>
            </>
          ) : (
            // Logged Out Navigation Options
            <>
              <a
                href="#features"
                onClick={(e) => onNavClick?.(e, 'features')}
                className={`nav-link ${activeSection === 'features' ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                {t('nav.features')}
              </a>
              <a
                href="#workspaces"
                onClick={(e) => onNavClick?.(e, 'workspaces')}
                className={`nav-link ${activeSection === 'workspaces' ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                {t('nav.workspaces')}
              </a>
              <a
                href="#workflow"
                onClick={(e) => onNavClick?.(e, 'workflow')}
                className={`nav-link ${activeSection === 'workflow' ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                {t('nav.how_it_works')}
              </a>
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                className="text-[#9aa5b3] hover:text-white"
              >
                {t('common.sign_in')}
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/login')}
              >
                {t('common.start_session')}
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
