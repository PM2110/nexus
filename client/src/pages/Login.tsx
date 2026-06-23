import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/common/Button';

interface CursorPosition {
  t: { top: number; left: number };
  g: { top: number; left: number };
  sel: { top: number; left: number; width: number };
}

const cursorPositions: CursorPosition[] = [
  { t: { top: 102, left: 230 }, g: { top: 152, left: 90 }, sel: { top: 102, left: 60, width: 90 } },
  { t: { top: 128, left: 200 }, g: { top: 202, left: 100 }, sel: { top: 128, left: 60, width: 130 } },
  { t: { top: 178, left: 130 }, g: { top: 228, left: 250 }, sel: { top: 178, left: 40, width: 80 } },
  { t: { top: 152, left: 270 }, g: { top: 102, left: 80 }, sel: { top: 152, left: 70, width: 150 } },
];

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Page states
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'candidate' | 'interviewer'>('candidate');
  const [form, setForm] = useState({ name: '', email: '', password: '', remember: false });

  // Cursor mockup state
  const [cursorIdx, setCursorIdx] = useState(1);
  const currentPos = cursorPositions[cursorIdx % cursorPositions.length];

  useEffect(() => {
    const timer = setInterval(() => {
      setCursorIdx((prev) => prev + 1);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', { ...form, role, isSignup });
  };

  return (
    <div className="page-wrapper overflow-hidden">
      <div className="auth-page-grid">
        
        {/* LEFT SIDE: PRODUCT SHOWCASE */}
        <div className="auth-left-showcase">
          {/* Ambient background glows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_420px_at_20%_10%,rgba(30,200,181,0.18),transparent_65%),radial-gradient(ellipse_600px_420px_at_90%_95%,rgba(203,161,53,0.16),transparent_65%)] opacity-55 pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(#1a212c_1px,transparent_1px),linear-gradient(90deg,#1a212c_1px,transparent_1px)] bg-[size:56px_56px] opacity-22 [mask-image:radial-gradient(ellipse_700px_500px_at_30%_30%,black,transparent_75%)] pointer-events-none" />

          {/* Brand Logo */}
          <button onClick={() => navigate('/')} className="nav-logo relative z-10 text-left">
            <svg className="w-6.5 h-6.5" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="3" fill="#1ec8b5" />
              <circle cx="16" cy="16" r="10.5" stroke="#1ec8b5" stroke-width="1.3" opacity="0.8" />
              <ellipse cx="16" cy="16" rx="14" ry="6" stroke="#cba135" stroke-width="1.2" opacity="0.75" transform="rotate(28 16 16)" />
              <ellipse cx="16" cy="16" rx="14" ry="6" stroke="#cba135" stroke-width="1.2" opacity="0.4" transform="rotate(-28 16 16)" />
            </svg>
            {t('common.brand')}
          </button>

          {/* Copy section */}
          <div className="relative z-10 max-w-[430px] rise-in">
            <div className="eyebrow-teal">
              {t('login.eyebrow')}
            </div>
            <h1 className="font-serif text-4xl lg:text-[40px] leading-[1.18] tracking-tight mb-4 font-normal">
              {t('login.stage_title_main')}<br />
              <span className="italic text-[#1ec8b5]">
                {t('login.stage_title_sub')}
              </span>
            </h1>
            <p className="section-subtitle">
              {t('login.stage_desc')}
            </p>
          </div>

          {/* Interactive cursor preview using semantic classes */}
          <div className="editor-mockup">
            <div className="editor-header">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="editor-circle-btn" />
                  <span className="editor-circle-btn" />
                  <span className="editor-circle-btn" />
                </div>
                <span className="font-mono text-[11.5px] text-[#5e6a7a] ml-1.5">{t('login.editor_file')}</span>
              </div>
              <div className="flex">
                <div className="w-[19px] h-[19px] rounded-full border-2 border-[#131a24] flex items-center justify-center font-mono text-[9px] font-semibold text-[#0a0e14] bg-[#1ec8b5]">M</div>
                <div className="w-[19px] h-[19px] rounded-full border-2 border-[#131a24] flex items-center justify-center font-mono text-[9px] font-semibold text-[#0a0e14] bg-[#cba135] -ml-1.5">A</div>
              </div>
            </div>

            <div className="editor-body min-h-[220px]">
              <div className="flex"><span className="w-6 text-[#5e6a7a] opacity-55 select-none">1</span><span className="text-[#5e6a7a] italic"># shared-sheet · live</span></div>
              <div className="flex"><span className="w-6 text-[#5e6a7a] opacity-55 select-none">2</span><span className="text-[#9aa5b3]"><span className="text-[#cba135]">def</span> <span className="text-[#7fb8e0]">merge</span>(intervals):</span></div>
              <div className="flex"><span className="w-6 text-[#5e6a7a] opacity-55 select-none">3</span><span className="text-[#9aa5b3]">&nbsp;&nbsp; intervals.<span className="text-[#7fb8e0]">sort</span>()</span></div>
              <div className="flex"><span className="w-6 text-[#5e6a7a] opacity-55 select-none">4</span><span className="text-[#9aa5b3]">&nbsp;&nbsp; result = []</span></div>
              <div className="flex"><span className="w-6 text-[#5e6a7a] opacity-55 select-none">5</span><span className="text-[#9aa5b3]">&nbsp;&nbsp; <span className="text-[#cba135]">for</span> start, end <span className="text-[#cba135]">in</span> intervals:</span></div>
              <div className="flex"><span className="w-6 text-[#5e6a7a] opacity-55 select-none">6</span><span className="text-[#9aa5b3]">&nbsp;&nbsp;&nbsp;&nbsp; <span className="text-[#cba135]">if</span> result <span className="text-[#cba135]">and</span> result[-1][1] &gt;= start:</span></div>
              <div className="flex"><span className="w-6 text-[#5e6a7a] opacity-55 select-none">7</span><span className="text-[#9aa5b3]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; result[-1][1] = <span className="text-[#7fb8e0]">max</span>(result[-1][1], end)</span></div>
              <div className="flex"><span className="w-6 text-[#5e6a7a] opacity-55 select-none">8</span><span className="text-[#9aa5b3]">&nbsp;&nbsp;&nbsp;&nbsp; <span className="text-[#cba135]">else</span>:</span></div>
              <div className="flex">
                <span className="w-6 text-[#5e6a7a] opacity-55 select-none">9</span>
                <span className="text-[#9aa5b3]">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; result.<span className="text-[#7fb8e0]">append</span>([start, end])
                  <span className="inline-block w-0.5 h-[1.1em] bg-[#1ec8b5] ml-0.5 animate-[blink_1s_steps(2)_infinite]" />
                </span>
              </div>
              <div className="flex"><span className="w-6 text-[#5e6a7a] opacity-55 select-none">10</span><span className="text-[#9aa5b3]">&nbsp;&nbsp; <span className="text-[#cba135]">return</span> result</span></div>

              {/* Simulated cursors and select frames */}
              <div
                className="editor-tag-t"
                style={{ top: `${currentPos.t.top}px`, left: `${currentPos.t.left}px` }}
              >
                Manan
              </div>
              <div
                className="editor-tag-g"
                style={{ top: `${currentPos.g.top}px`, left: `${currentPos.g.left}px` }}
              >
                Alex
              </div>
              <div
                className="editor-tag-selection"
                style={{ top: `${currentPos.sel.top}px`, left: `${currentPos.sel.left}px`, width: `${currentPos.sel.width}px` }}
              />
            </div>

            <div className="editor-footer">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                {t('login.editor_collaborators')}
              </div>
            </div>
          </div>

          {/* Stats band */}
          <div className="flex gap-8 rise-in">
            <div>
              <div className="font-serif text-xl text-[#e7e9ec]">4</div>
              <div className="font-mono text-[11px] text-[#5e6a7a] tracking-wide mt-0.5">{t('login.stat_sheets')}</div>
            </div>
            <div>
              <div className="font-serif text-xl text-[#e7e9ec]">&lt;100ms</div>
              <div className="font-mono text-[11px] text-[#5e6a7a] tracking-wide mt-0.5">{t('login.stat_latency')}</div>
            </div>
            <div>
              <div className="font-serif text-xl text-[#e7e9ec]">6</div>
              <div className="font-mono text-[11px] text-[#5e6a7a] tracking-wide mt-0.5">{t('login.stat_languages')}</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: AUTHENTICATION FORM */}
        <div className="auth-right-form">
          <div className="auth-form-box">
            
            {/* Header top row */}
            <div className="auth-header-row">
              <button onClick={() => navigate('/')} className="back-btn">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {t('login.back_home')}
              </button>
              <div className="auth-tabs">
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
                  className={`auth-tab-btn ${!isSignup ? 'auth-tab-btn-active' : 'auth-tab-btn-inactive'}`}
                >
                  {t('login.sign_in_tab')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignup(true)}
                  className={`auth-tab-btn ${isSignup ? 'auth-tab-btn-active' : 'auth-tab-btn-inactive'}`}
                >
                  {t('login.sign_up_tab')}
                </button>
              </div>
            </div>

            {/* Title & switch link */}
            <div className="auth-title-section">
              <h2 className="auth-title">
                {isSignup ? t('login.create_workspace') : t('login.welcome_back')}
              </h2>
              <p className="auth-subtitle">
                {isSignup ? (
                  <>
                    {t('login.already_have')}{' '}
                    <button type="button" onClick={() => setIsSignup(false)} className="text-[#1ec8b5] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer">
                      {t('login.sign_in_tab')}
                    </button>
                  </>
                ) : (
                  <>
                    {t('login.new_to_nexus')}{' '}
                    <button type="button" onClick={() => setIsSignup(true)} className="text-[#1ec8b5] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer">
                      {t('login.create_workspace')}
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* OAuth buttons */}
            <div className="auth-oauth-row">
              <Button variant="outline" className="flex-1 flex gap-2" type="button">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#9aa5b3" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#9aa5b3" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#9aa5b3" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="flex-1 flex gap-2" type="button">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1C5.92 1 1 5.92 1 12c0 4.87 3.15 8.99 7.53 10.45.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.05-3.06.67-3.71-1.3-3.71-1.3-.5-1.27-1.22-1.6-1.22-1.6-1-.68.07-.67.07-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.57 1.19 3.2.91.1-.71.38-1.19.69-1.46-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.5 10.5 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.22-2.58 5.15-5.03 5.42.39.34.74 1.02.74 2.05 0 1.48-.01 2.67-.01 3.04 0 .29.2.64.76.53C19.85 20.98 23 16.87 23 12c0-6.08-4.92-11-11-11z" />
                </svg>
                GitHub
              </Button>
            </div>

            <div className="auth-divider">
              {t('login.or_email')}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Full Name Field (Signup Mode only) */}
              {isSignup && (
                <div className="auth-form-field">
                  <label className="input-label" htmlFor="name">
                    {t('login.label_name')}
                  </label>
                  <div className="auth-field-relative">
                    <svg className="auth-field-icon" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" stroke-width="1.4" />
                      <path d="M3 13c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
                    </svg>
                    <input
                      type="text"
                      id="name"
                      placeholder={t('login.placeholder_name')}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field input-field-icon-pad"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="auth-form-field">
                <label className="input-label" htmlFor="email">
                  {t('login.label_email')}
                </label>
                <div className="auth-field-relative">
                  <svg className="auth-field-icon" viewBox="0 0 16 16" fill="none">
                    <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" stroke-width="1.4" />
                    <path d="M2 4.5l6 4.5 6-4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <input
                    type="email"
                    id="email"
                    placeholder={t('login.placeholder_email')}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field input-field-icon-pad"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="auth-form-field">
                <label className="input-label" htmlFor="password">
                  {t('login.label_password')}
                </label>
                <div className="auth-field-relative">
                  <svg className="auth-field-icon" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="7" width="10" height="7" rx="1.4" stroke="currentColor" stroke-width="1.4" />
                    <path d="M5.5 7V4.8a2.5 2.5 0 0 1 5 0V7" stroke="currentColor" stroke-width="1.4" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder={t('login.placeholder_password')}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field input-field-icon-pad pr-10.5"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-field-btn"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.3" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Role Chip Selector (Signup Mode only) */}
              {isSignup && (
                <div className="auth-role-row">
                  <button
                    type="button"
                    onClick={() => setRole('candidate')}
                    className={`auth-role-btn ${
                      role === 'candidate' ? 'auth-role-btn-cand-active' : 'auth-role-btn-inactive'
                    }`}
                  >
                    {t('login.role_candidate')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('interviewer')}
                    className={`auth-role-btn ${
                      role === 'interviewer' ? 'auth-role-btn-int-active' : 'auth-role-btn-inactive'
                    }`}
                  >
                    {t('login.role_interviewer')}
                  </button>
                </div>
              )}

              {/* Remember and Forgot password link */}
              <div className="auth-remember-row">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                    className="auth-checkbox"
                  />
                  {t('login.keep_signed_in')}
                </label>
                {!isSignup && (
                  <a href="#" className="text-[#9aa5b3] hover:text-[#1ec8b5] transition-colors">
                    {t('login.forgot_password')}
                  </a>
                )}
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mb-6"
                icon={
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                }
              >
                {isSignup ? t('login.btn_create_account') : t('login.btn_sign_in')}
              </Button>
            </form>

            <p className="auth-terms">
              {t('login.terms_note')}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
