import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { BrandIcon } from '../common/Icons';

interface DashboardNavbarProps {
  user: any;
  logout: () => void;
  scrollToSection?: (id: string) => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  user,
  logout,
  scrollToSection
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleScroll = (id: string) => {
    if (scrollToSection) {
      scrollToSection(id);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <nav className="nav-bar nav-bar-scrolled sticky top-0 border-b border-[#222b38]/50 z-30">
      <div className="nav-container py-3">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <BrandIcon size={26} />
          <span className="font-serif font-semibold text-lg text-white">{t('common.brand')}</span>
        </div>

        {/* Direct Navbar Links + Colorful Avatar */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleScroll('workspaces-section')}
            className="text-xs font-semibold text-[#9aa5b3] hover:text-[#1ec8b5] transition-all cursor-pointer uppercase tracking-wider font-mono bg-transparent border-none"
          >
            {t('dashboard.nav_workspaces')}
          </button>
          <button
            onClick={() => handleScroll('friends-section')}
            className="text-xs font-semibold text-[#9aa5b3] hover:text-[#1ec8b5] transition-all cursor-pointer uppercase tracking-wider font-mono bg-transparent border-none"
          >
            {t('dashboard.nav_friends')}
          </button>
          <button
            onClick={logout}
            className="text-xs font-semibold text-[#5e6a7a] hover:text-[#e0596b] transition-all cursor-pointer uppercase tracking-wider font-mono bg-transparent border-none"
          >
            {t('dashboard.nav_sign_out')}
          </button>

          {/* Colorful & Aesthetic Avatar */}
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-[#1ec8b5] object-cover hover:scale-105 transition-all duration-300 shadow-[0_0_12px_rgba(30,200,181,0.25)]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1ec8b5] via-[#14837a] to-[#cba135] p-[2px] shadow-[0_0_15px_rgba(30,200,181,0.25)] hover:shadow-[0_0_22px_rgba(203,161,53,0.45)] hover:scale-105 transition-all duration-300">
              <div className="w-full h-full rounded-full bg-[#0a0e14] flex items-center justify-center font-mono text-[11px] font-bold text-[#1ec8b5] tracking-wider">
                {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
