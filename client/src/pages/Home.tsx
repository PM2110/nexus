import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/common/Button';
import { HomeHero } from './HomeHero';
import { HomeWorkspaceShowcase } from './HomeWorkspaceShowcase';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Monitor scroll for nav styling and background parallax layers
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen text-[#e7e9ec] bg-[#0a0e14] font-sans selection:bg-[#14837a] selection:text-white relative overflow-x-hidden">
      
      {/* Parallax ambient background gradients */}
      <div
        className="fixed inset-0 bg-[radial-gradient(ellipse_800px_500px_at_15%_-5%,rgba(30,200,181,0.18),transparent_60%)] opacity-50 pointer-events-none z-0 transition-transform duration-75 ease-out"
        style={{ transform: `translateY(${-scrollY * 0.12}px)` }}
      />
      <div
        className="fixed inset-0 bg-[radial-gradient(ellipse_700px_500px_at_100%_10%,rgba(203,161,53,0.16),transparent_60%)] opacity-50 pointer-events-none z-0 transition-transform duration-75 ease-out"
        style={{ transform: `translateY(${-scrollY * 0.08}px)` }}
      />
      <div
        className="fixed inset-0 bg-[linear-gradient(#1a212c_1px,transparent_1px),linear-gradient(90deg,#1a212c_1px,transparent_1px)] bg-[size:64px_64px] opacity-18 [mask-image:radial-gradient(ellipse_900px_600px_at_50%_0%,black,transparent_70%)] pointer-events-none z-0 transition-transform duration-75 ease-out"
        style={{ transform: `translateY(${-scrollY * 0.04}px)` }}
      />

      {/* NAVIGATION BAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 py-5 backdrop-blur-md bg-[#0a0e14]/60 border-b transition-all duration-300 ${isScrolled ? 'border-[#222b38] bg-[#0a0e14]/85' : 'border-transparent'}`}>
        <div className="max-w-[1180px] mx-auto px-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 font-serif font-semibold text-[21px] tracking-wide bg-transparent border-none p-0 cursor-pointer text-[#e7e9ec]"
          >
            <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="3" fill="#1ec8b5" />
              <circle cx="16" cy="16" r="10.5" stroke="#1ec8b5" stroke-width="1.3" opacity="0.8" />
              <ellipse cx="16" cy="16" rx="14" ry="6" stroke="#cba135" stroke-width="1.2" opacity="0.75" transform="rotate(28 16 16)" />
              <ellipse cx="16" cy="16" rx="14" ry="6" stroke="#cba135" stroke-width="1.2" opacity="0.4" transform="rotate(-28 16 16)" />
            </svg>
            {t('common.brand')}
          </button>
          <div className="flex items-center gap-9 text-[14.2px] text-[#9aa5b3]">
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, 'features')}
              className="hover:text-white transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-0 after:h-[1px] after:bg-[#1ec8b5] after:transition-all hover:after:w-full"
            >
              {t('nav.features')}
            </a>
            <a
              href="#workspaces"
              onClick={(e) => handleNavClick(e, 'workspaces')}
              className="hover:text-white transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-0 after:h-[1px] after:bg-[#1ec8b5] after:transition-all hover:after:w-full"
            >
              {t('nav.workspaces')}
            </a>
            <a
              href="#workflow"
              onClick={(e) => handleNavClick(e, 'workflow')}
              className="hover:text-white transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-0 after:h-[1px] after:bg-[#1ec8b5] after:transition-all hover:after:w-full"
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
              size="sm"
              onClick={() => navigate('/login')}
            >
              {t('common.start_session')}
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <HomeHero />

      {/* TRUST / TOPICS SECTION */}
      <section className="py-12.5 text-center relative z-10 border-t border-[#222b38]/40">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="font-mono text-[11.5px] tracking-widest text-[#5e6a7a] mb-7.5">{t('trust.label')}</div>
          <div className="flex justify-center items-center gap-14 flex-wrap text-[#5e6a7a] font-mono text-[14.8px] opacity-75">
            <span>{t('trust.mock_interviews')}</span>
            <span>{t('trust.dsa_practice')}</span>
            <span>{t('trust.pair_programming')}</span>
            <span>{t('trust.competitive_programming')}</span>
            <span>{t('trust.mentorship_sessions')}</span>
          </div>
        </div>
      </section>

      {/* PROBLEM & COMPARISON SECTION */}
      <section className="py-32 relative z-10">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="text-center max-w-[640px] mx-auto mb-16 rise-in">
            <div className="font-mono text-[11.8px] tracking-widest text-[#cba135] uppercase mb-3.5">{t('problem.eyebrow')}</div>
            <h2 className="font-serif font-normal text-3xl md:text-[42px] leading-[1.18] tracking-tight mb-4">
              {t('problem.title_main')}<br />{t('problem.title_sub')}
            </h2>
            <p className="text-[#9aa5b3] text-[16.3px] leading-relaxed">{t('problem.sub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#222b38] border border-[#222b38] rounded-2xl overflow-hidden max-w-[980px] mx-auto rise-in">
            {/* Today's Stack */}
            <div className="bg-[#0d1219] p-8 md:p-9.5">
              <div className="font-mono text-[11.5px] tracking-widest text-[#5e6a7a] uppercase mb-5 flex items-center gap-2">{t('problem.today_stack')}</div>
              <ul className="flex flex-col gap-5.5">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <li key={idx} className="flex items-start gap-3.5 text-[#9aa5b3] text-[14.8px] leading-relaxed">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#5e6a7a]" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    {t(`problem.today_item_${idx}`)}
                  </li>
                ))}
              </ul>
            </div>
            {/* Nexus Stack */}
            <div className="bg-[#131a24] p-8 md:p-9.5">
              <div className="font-mono text-[11.5px] tracking-widest text-[#1ec8b5] uppercase mb-5 flex items-center gap-2">{t('problem.nexus_stack')}</div>
              <ul className="flex flex-col gap-5.5">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <li key={idx} className="flex items-start gap-3.5 text-[#e7e9ec] text-[14.8px] leading-relaxed">
                    <svg className="w-4.5 h-4.5 flex-shrink-0 text-[#1ec8b5]" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    {t(`problem.nexus_item_${idx}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE GRID SECTION */}
      <section className="py-22.5 relative z-10" id="features">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="text-center max-w-[640px] mx-auto mb-16 rise-in">
            <div className="font-mono text-[11.8px] tracking-widest text-[#1ec8b5] uppercase mb-3.5">{t('features.eyebrow')}</div>
            <h2 className="font-serif font-normal text-3xl md:text-[42px] leading-[1.18] tracking-tight mb-4">{t('features.title')}</h2>
            <p className="text-[#9aa5b3] text-[16.3px] leading-relaxed">{t('features.sub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#222b38] border border-[#222b38] rounded-2xl overflow-hidden rise-in">
            {/* Feature Cards */}
            {[
              { key: 'editor', stroke: '#1ec8b5', path: 'M4 17l5-5-5-5M12 19h8' },
              { key: 'cursor', stroke: '#cba135', path: 'M12 7v5l3 3' },
              { key: 'sheets', stroke: '#1ec8b5', path: 'M3 4h7v16H3zm11 0h7v16h-7z' },
              { key: 'import', stroke: '#cba135', path: 'M5 13l4 4L19 7' },
              { key: 'run', stroke: '#1ec8b5', path: 'M5 3v18l7-4 7 4V3z' },
              { key: 'chat', stroke: '#cba135', path: 'M4 4h16v12H7l-3 3V4z' }
            ].map((feat) => (
              <div key={feat.key} className="bg-[#0d1219] hover:bg-[#131a24] p-8 transition-colors duration-300 relative text-left">
                <div className="w-9.5 h-9.5 rounded-lg flex items-center justify-center bg-[#1a222e] border border-[#222b38] mb-5">
                  {feat.key === 'cursor' ? (
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke={feat.stroke} strokeWidth="1.6">
                      <circle cx="12" cy="12" r="9" />
                      <path d={feat.path} strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke={feat.stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d={feat.path} />
                    </svg>
                  )}
                </div>
                <h4 className="text-[16.5px] font-semibold text-[#e7e9ec] mb-2.5">{t(`features.${feat.key}_title`)}</h4>
                <p className="text-[#9aa5b3] text-[14.2px] leading-relaxed">{t(`features.${feat.key}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWCASE SECTION */}
      <HomeWorkspaceShowcase />

      {/* STATS BAND SECTION */}
      <section className="py-20 border-y border-[#222b38] relative z-10">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center rise-in">
            <div>
              <div className="font-serif text-3xl md:text-[45px] text-[#e7e9ec] mb-2 font-normal"><span className="text-[#1ec8b5]">{t('stats.sheets_num').split(' ')[0]}</span> {t('stats.sheets_num').split(' ')[1]}</div>
              <div className="text-[13.8px] text-[#5e6a7a] font-mono">{t('stats.sheets_label')}</div>
            </div>
            <div>
              <div className="font-serif text-3xl md:text-[45px] text-[#e7e9ec] mb-2 font-normal">{t('stats.langs_num')}</div>
              <div className="text-[13.8px] text-[#5e6a7a] font-mono">{t('stats.langs_label')}</div>
            </div>
            <div>
              <div className="font-serif text-3xl md:text-[45px] text-[#e7e9ec] mb-2 font-normal">{t('stats.latency_num')}</div>
              <div className="text-[13.8px] text-[#5e6a7a] font-mono">{t('stats.latency_label')}</div>
            </div>
            <div>
              <div className="font-serif text-3xl md:text-[45px] text-[#e7e9ec] mb-2 font-normal">{t('stats.link_num')}</div>
              <div className="text-[13.8px] text-[#5e6a7a] font-mono">{t('stats.link_label')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE / WORKFLOW SECTION */}
      <section className="py-30 relative z-10" id="workflow">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="text-center max-w-[640px] mx-auto mb-16 rise-in">
            <div className="font-mono text-[11.8px] tracking-widest text-[#1ec8b5] uppercase mb-3.5">{t('workflow.eyebrow')}</div>
            <h2 className="font-serif font-normal text-3xl md:text-[42px] leading-[1.18] tracking-tight mb-4">{t('workflow.title')}</h2>
          </div>

          <div className="max-w-[760px] mx-auto relative before:content-[''] before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gradient-to-b before:from-[#222b38] before:via-[#1ec8b5] before:to-[#222b38] before:opacity-50 rise-in">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex gap-6.5 pb-12 last:pb-0 relative text-left">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[#0d1219] border border-[#222b38] flex items-center justify-center font-mono font-semibold text-[13.6px] text-[#9aa5b3] relative z-10 border-t-[#1ec8b5] border-r-[#1ec8b5]">
                  {t(`workflow.step_${step}_num`)}
                </div>
                <div className="pt-2">
                  <h4 className="text-[17.3px] font-semibold text-[#e7e9ec] mb-2">{t(`workflow.step_${step}_title`)}</h4>
                  <p className="text-[#9aa5b3] text-[14.8px] leading-relaxed max-w-[480px]">{t(`workflow.step_${step}_desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL QUOTE BAND */}
      <section className="py-25 text-center relative z-10 border-t border-[#222b38]/30">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="font-serif text-[64px] leading-none text-[#1ec8b5] opacity-40 mb-2.5">"</div>
          <blockquote className="font-serif italic font-normal text-2.5xl md:text-[32px] leading-[1.45] max-w-[760px] mx-auto mb-6 text-[#e7e9ec]">
            {t('quote.text')}
          </blockquote>
          <div className="text-[#5e6a7a] font-mono text-[13.6px]">{t('quote.author')}</div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION CARD */}
      <section className="py-30 relative z-10">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="max-w-[780px] mx-auto p-12 md:p-16 rounded-[20px] border border-[#222b38] bg-gradient-to-br from-[rgba(30,200,181,0.06)] via-[rgba(19,26,36,0.85)] to-[rgba(203,161,53,0.04)] relative overflow-hidden rise-in text-center">
            <h2 className="font-serif font-normal text-3xl md:text-[40px] mb-4 leading-tight">
              {t('final_cta.title_main')}<br />{t('final_cta.title_sub')}
            </h2>
            <p className="text-[#9aa5b3] text-lg mb-8.5 max-w-[500px] mx-auto">{t('final_cta.sub')}</p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/login')}
              icon={
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              }
            >
              {t('final_cta.btn')}
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 border-t border-[#222b38] relative z-10 text-left">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 mb-12">
            <div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2.5 font-serif font-semibold text-[21px] tracking-wide mb-3.5 bg-transparent border-none p-0 cursor-pointer text-[#e7e9ec]"
              >
                <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="3" fill="#1ec8b5" />
                  <circle cx="16" cy="16" r="10.5" stroke="#1ec8b5" stroke-width="1.3" opacity="0.8" />
                  <ellipse cx="16" cy="16" rx="14" ry="6" stroke="#cba135" stroke-width="1.2" opacity="0.75" transform="rotate(28 16 16)" />
                  <ellipse cx="16" cy="16" rx="14" ry="6" stroke="#cba135" stroke-width="1.2" opacity="0.4" transform="rotate(-28 16 16)" />
                </svg>
                {t('common.brand')}
              </button>
              <p className="text-[#5e6a7a] text-[14px] leading-relaxed max-w-[280px]">{t('footer.tagline')}</p>
            </div>
            <div>
              <h5 className="font-mono text-[11.8px] text-[#5e6a7a] uppercase tracking-wider mb-4">{t('footer.heading_product')}</h5>
              <a
                href="#features"
                onClick={(e) => handleNavClick(e, 'features')}
                className="block text-[#9aa5b3] text-[14.2px] py-1.5 hover:text-[#1ec8b5] transition-colors"
              >
                {t('nav.features')}
              </a>
              <a
                href="#workspaces"
                onClick={(e) => handleNavClick(e, 'workspaces')}
                className="block text-[#9aa5b3] text-[14.2px] py-1.5 hover:text-[#1ec8b5] transition-colors"
              >
                {t('nav.workspaces')}
              </a>
              <a
                href="#workflow"
                onClick={(e) => handleNavClick(e, 'workflow')}
                className="block text-[#9aa5b3] text-[14.2px] py-1.5 hover:text-[#1ec8b5] transition-colors"
              >
                {t('nav.how_it_works')}
              </a>
            </div>
            <div>
              <h5 className="font-mono text-[11.8px] text-[#5e6a7a] uppercase tracking-wider mb-4">{t('footer.heading_platforms')}</h5>
              <a href="#" className="block text-[#9aa5b3] text-[14.2px] py-1.5 hover:text-[#1ec8b5] transition-colors">{t('footer.link_lc')}</a>
              <span className="block text-[#5e6a7a] text-[14.2px] py-1.5 select-none">{t('footer.link_cf')}</span>
              <span className="block text-[#5e6a7a] text-[14.2px] py-1.5 select-none">{t('footer.link_hr')}</span>
            </div>
            <div>
              <h5 className="font-mono text-[11.8px] text-[#5e6a7a] uppercase tracking-wider mb-4">{t('footer.heading_get_started')}</h5>
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                className="block text-[#9aa5b3] text-[14.2px] py-1.5 hover:text-[#1ec8b5] transition-colors text-left"
              >
                {t('common.sign_in')}
              </Button>
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                className="block text-[#9aa5b3] text-[14.2px] py-1.5 hover:text-[#1ec8b5] transition-colors text-left"
              >
                {t('common.create_workspace')}
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center pt-7 border-t border-[#1a212c] text-[#5e6a7a] text-[13px] font-mono">
            <span>{t('footer.copyright')}</span>
            <span>{t('footer.status')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
