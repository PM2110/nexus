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
  const [activeSection, setActiveSection] = useState<string>('');

  // Monitor scroll for nav styling and background parallax layers
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to detect and highlight active section in viewport
  useEffect(() => {
    const sectionIds = ['features', 'workspaces', 'workflow'];
    const elements = sectionIds.map(id => document.getElementById(id));
    
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -50% 0px', // Trigger when section occupies the mid-viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    elements.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      elements.forEach(el => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="page-wrapper">
      
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
      <nav className={`nav-bar ${isScrolled ? 'nav-bar-scrolled' : 'nav-bar-transparent'}`}>
        <div className="nav-container">
          <button onClick={() => navigate('/')} className="nav-logo">
            <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="3" fill="#1ec8b5" />
              <circle cx="16" cy="16" r="10.5" stroke="#1ec8b5" stroke-width="1.3" opacity="0.8" />
              <ellipse cx="16" cy="16" rx="14" ry="6" stroke="#cba135" stroke-width="1.2" opacity="0.75" transform="rotate(28 16 16)" />
              <ellipse cx="16" cy="16" rx="14" ry="6" stroke="#cba135" stroke-width="1.2" opacity="0.4" transform="rotate(-28 16 16)" />
            </svg>
            {t('common.brand')}
          </button>
          <div className="nav-links">
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, 'features')}
              className={`nav-link ${activeSection === 'features' ? 'nav-link-active' : 'nav-link-inactive'}`}
            >
              {t('nav.features')}
            </a>
            <a
              href="#workspaces"
              onClick={(e) => handleNavClick(e, 'workspaces')}
              className={`nav-link ${activeSection === 'workspaces' ? 'nav-link-active' : 'nav-link-inactive'}`}
            >
              {t('nav.workspaces')}
            </a>
            <a
              href="#workflow"
              onClick={(e) => handleNavClick(e, 'workflow')}
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
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <HomeHero />

      {/* TRUST / TOPICS SECTION */}
      <section className="trust-section">
        <div className="section-container">
          <div className="eyebrow-faint">{t('trust.label')}</div>
          <div className="trust-list">
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
        <div className="section-container">
          <div className="section-header rise-in">
            <div className="eyebrow-gold">{t('problem.eyebrow')}</div>
            <h2 className="section-title">
              {t('problem.title_main')}<br />{t('problem.title_sub')}
            </h2>
            <p className="section-subtitle">{t('problem.sub')}</p>
          </div>

          <div className="problem-grid">
            {/* Today's Stack */}
            <div className="problem-col-today">
              <div className="font-mono text-[11.5px] tracking-widest text-[#5e6a7a] uppercase mb-5 flex items-center gap-2">{t('problem.today_stack')}</div>
              <ul className="problem-list">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <li key={idx} className="problem-item-today">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#5e6a7a]" viewBox="0 0 16 16" fill="none">
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    {t(`problem.today_item_${idx}`)}
                  </li>
                ))}
              </ul>
            </div>
            {/* Nexus Stack */}
            <div className="problem-col-nexus">
              <div className="font-mono text-[11.5px] tracking-widest text-[#1ec8b5] uppercase mb-5 flex items-center gap-2">{t('problem.nexus_stack')}</div>
              <ul className="problem-list">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <li key={idx} className="problem-item-nexus">
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
        <div className="section-container">
          <div className="section-header rise-in">
            <div className="eyebrow-teal">{t('features.eyebrow')}</div>
            <h2 className="section-title">{t('features.title')}</h2>
            <p className="section-subtitle">{t('features.sub')}</p>
          </div>

          <div className="features-grid">
            {/* Feature Cards */}
            {[
              { key: 'editor', stroke: '#1ec8b5', path: 'M4 17l5-5-5-5M12 19h8' },
              { key: 'cursor', stroke: '#cba135', path: 'M12 7v5l3 3' },
              { key: 'sheets', stroke: '#1ec8b5', path: 'M3 4h7v16H3zm11 0h7v16h-7z' },
              { key: 'import', stroke: '#cba135', path: 'M5 13l4 4L19 7' },
              { key: 'run', stroke: '#1ec8b5', path: 'M5 3v18l7-4 7 4V3z' },
              { key: 'chat', stroke: '#cba135', path: 'M4 4h16v12H7l-3 3V4z' }
            ].map((feat) => (
              <div key={feat.key} className="feature-card">
                <div className="feature-icon-wrapper">
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
                <div className="feature-content">
                  <h4 className="feature-title">{t(`features.${feat.key}_title`)}</h4>
                  <p className="feature-desc">{t(`features.${feat.key}_desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWCASE SECTION */}
      <HomeWorkspaceShowcase />

      {/* STATS BAND SECTION */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid rise-in">
            <div>
              <div className="stat-value"><span className="text-[#1ec8b5]">{t('stats.sheets_num').split(' ')[0]}</span> {t('stats.sheets_num').split(' ')[1]}</div>
              <div className="stat-label">{t('stats.sheets_label')}</div>
            </div>
            <div>
              <div className="stat-value">{t('stats.langs_num')}</div>
              <div className="stat-label">{t('stats.langs_label')}</div>
            </div>
            <div>
              <div className="stat-value">{t('stats.latency_num')}</div>
              <div className="stat-label">{t('stats.latency_label')}</div>
            </div>
            <div>
              <div className="stat-value">{t('stats.link_num')}</div>
              <div className="stat-label">{t('stats.link_label')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE / WORKFLOW SECTION */}
      <section className="workflow-section" id="workflow">
        <div className="section-container">
          <div className="section-header rise-in">
            <div className="eyebrow-teal">{t('workflow.eyebrow')}</div>
            <h2 className="section-title">{t('workflow.title')}</h2>
          </div>

          <div className="workflow-timeline">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="workflow-step rise-in">
                <div className="workflow-step-badge">
                  {t(`workflow.step_${step}_num`)}
                </div>
                <div className="workflow-step-content">
                  <h4 className="workflow-step-title">{t(`workflow.step_${step}_title`)}</h4>
                  <p className="workflow-step-desc">{t(`workflow.step_${step}_desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL QUOTE BAND */}
      <section className="quote-section">
        <div className="section-container">
          <div className="quote-mark">"</div>
          <blockquote className="quote-blockquote">
            {t('quote.text')}
          </blockquote>
          <div className="quote-author">{t('quote.author')}</div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION CARD */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-card">
            <h2 className="cta-title">
              {t('final_cta.title_main')}<br />{t('final_cta.title_sub')}
            </h2>
            <p className="cta-subtitle">{t('final_cta.sub')}</p>
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
      <footer className="footer-section">
        <div className="section-container">
          <div className="footer-grid mb-12">
            <div>
              <button onClick={() => navigate('/')} className="nav-logo mb-3.5">
                <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="3" fill="#1ec8b5" />
                  <circle cx="16" cy="16" r="10.5" stroke="#1ec8b5" stroke-width="1.3" opacity="0.8" />
                  <ellipse cx="16" cy="16" rx="14" ry="6" stroke="#cba135" stroke-width="1.2" opacity="0.75" transform="rotate(28 16 16)" />
                  <ellipse cx="16" cy="16" rx="14" ry="6" stroke="#cba135" stroke-width="1.2" opacity="0.4" transform="rotate(-28 16 16)" />
                </svg>
                {t('common.brand')}
              </button>
              <p className="footer-col-desc">{t('footer.tagline')}</p>
            </div>
            <div>
              <h5 className="footer-column-title">{t('footer.heading_product')}</h5>
              <a
                href="#features"
                onClick={(e) => handleNavClick(e, 'features')}
                className="footer-link"
              >
                {t('nav.features')}
              </a>
              <a
                href="#workspaces"
                onClick={(e) => handleNavClick(e, 'workspaces')}
                className="footer-link"
              >
                {t('nav.workspaces')}
              </a>
              <a
                href="#workflow"
                onClick={(e) => handleNavClick(e, 'workflow')}
                className="footer-link"
              >
                {t('nav.how_it_works')}
              </a>
            </div>
            <div>
              <h5 className="footer-column-title">{t('footer.heading_platforms')}</h5>
              <a href="#" className="footer-link">{t('footer.link_lc')}</a>
              <span className="footer-link-disabled">{t('footer.link_cf')}</span>
              <span className="footer-link-disabled">{t('footer.link_hr')}</span>
            </div>
            <div>
              <h5 className="footer-column-title">{t('footer.heading_get_started')}</h5>
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                className="footer-link text-left p-0!"
              >
                {t('common.sign_in')}
              </Button>
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                className="footer-link text-left p-0!"
              >
                {t('common.create_workspace')}
              </Button>
            </div>
          </div>
          <div className="footer-bottom">
            <span>{t('footer.copyright')}</span>
            <span>{t('footer.status')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
