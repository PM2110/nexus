import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Form } from '../components/common/Form';
import { useAuth } from '../context/AuthContext';
import {
  BrandIcon,
  GoogleIcon,
  GitHubIcon,
  UserIcon,
  MailIcon,
  LockIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SpinnerIcon
} from '../components/common/Icons';

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, signup, forgotPassword, resetPassword, isAuthenticated } = useAuth();

  // Page states: 'login' | 'signup' | 'forgot' | 'reset'
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>('login');
  const [role, setRole] = useState<'Candidate' | 'Interviewer'>('Candidate');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [remember, setRemember] = useState(false);

  // Submission/Response states
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setDevCode(null);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password, remember);
        if (res.success) {
          navigate('/');
        } else {
          setError(res.message);
        }
      } else if (mode === 'signup') {
        const res = await signup(name, email, password, role);
        if (res.success) {
          navigate('/');
        } else {
          setError(res.message);
        }
      } else if (mode === 'forgot') {
        const res = await forgotPassword(email);
        if (res.success) {
          setSuccess(res.message);
          if (res.token) {
            setDevCode(res.token);
          }
          // Automatically transition to reset password after 2.5 seconds
          setTimeout(() => {
            setMode('reset');
            setError(null);
            setSuccess(null);
          }, 2500);
        } else {
          setError(res.message);
        }
      } else if (mode === 'reset') {
        const res = await resetPassword(email, code, password);
        if (res.success) {
          setSuccess(res.message);
          // Redirect to login after 2 seconds
          setTimeout(() => {
            setMode('login');
            setPassword('');
            setCode('');
            setError(null);
            setSuccess(null);
          }, 2000);
        } else {
          setError(res.message);
        }
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleModeChange = (newMode: 'login' | 'signup' | 'forgot' | 'reset') => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
    setDevCode(null);
    setPassword('');
    setCode('');
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
            <BrandIcon size={26} />
            {t('common.brand')}
          </button>

          {/* Copy section */}
          <div className="relative z-10 max-w-[430px] rise-in">
            <div className="eyebrow-teal">
              {t('login.eyebrow')}
            </div>
            <h1 className="auth-showcase-title">
              {t('login.stage_title_main')}<br />
              <span className="italic text-[#1ec8b5]">
                {t('login.stage_title_sub')}
              </span>
            </h1>
            <p className="auth-showcase-desc">
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
                </span>
              </div>
              <div className="flex"><span className="w-6 text-[#5e6a7a] opacity-55 select-none">10</span><span className="text-[#9aa5b3]">&nbsp;&nbsp; <span className="text-[#cba135]">return</span> result</span></div>

              {/* Simulated static blinking cursors */}
              <div
                className="editor-caret-t"
                style={{ top: '242px', left: '309px' }}
              />
              <div
                className="editor-tag-t"
                style={{ top: '239px', left: '309px' }}
              >
                Manan
              </div>

              <div
                className="editor-caret-g"
                style={{ top: '136px', left: '240px' }}
              />
              <div
                className="editor-tag-g"
                style={{ top: '133px', left: '240px' }}
              >
                Alex
              </div>
            </div>

            <div className="editor-footer">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                {t('login.editor_collaborators')}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: AUTHENTICATION FORM */}
        <div className="auth-right-form">
          <div className="auth-form-box">

            {/* Header top row */}
            <div className="auth-header-row">
              <button onClick={() => navigate('/')} className="back-btn">
                <ArrowLeftIcon size={14} />
                {t('login.back_home')}
              </button>

              {/* Tabs shown only in login/signup modes */}
              {(mode === 'login' || mode === 'signup') && (
                <div className="auth-tabs">
                  <button
                    type="button"
                    onClick={() => handleModeChange('login')}
                    className={`auth-tab-btn ${mode === 'login' ? 'auth-tab-btn-active' : 'auth-tab-btn-inactive'}`}
                  >
                    {t('login.sign_in_tab')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange('signup')}
                    className={`auth-tab-btn ${mode === 'signup' ? 'auth-tab-btn-active' : 'auth-tab-btn-inactive'}`}
                  >
                    {t('login.sign_up_tab')}
                  </button>
                </div>
              )}
            </div>

            {/* Title & switch link */}
            <div className="auth-title-section">
              <h2 className="auth-title">
                {mode === 'login' && t('login.welcome_back')}
                {mode === 'signup' && t('login.create_workspace')}
                {mode === 'forgot' && t('login.forgot_title')}
                {mode === 'reset' && t('login.reset_title')}
              </h2>
              <p className="auth-subtitle">
                {mode === 'login' && (
                  <>
                    {t('login.new_to_nexus')}{' '}
                    <button type="button" onClick={() => handleModeChange('signup')} className="text-[#1ec8b5] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer">
                      {t('login.create_workspace')}
                    </button>
                  </>
                )}
                {mode === 'signup' && (
                  <>
                    {t('login.already_have')}{' '}
                    <button type="button" onClick={() => handleModeChange('login')} className="text-[#1ec8b5] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer">
                      {t('login.sign_in_tab')}
                    </button>
                  </>
                )}
                {mode === 'forgot' && t('login.forgot_subtitle')}
                {mode === 'reset' && t('login.reset_subtitle')}
              </p>
            </div>

            {/* OAuth buttons (only in login/signup modes) */}
            {(mode === 'login' || mode === 'signup') && (
              <>
                <div className="auth-oauth-row">
                  <Button variant="outline" className="flex-1 flex gap-2" type="button">
                    <GoogleIcon size={16} />
                    Google
                  </Button>
                  <Button variant="outline" className="flex-1 flex gap-2" type="button">
                    <GitHubIcon size={16} />
                    GitHub
                  </Button>
                </div>

                <div className="auth-divider">
                  {t('login.or_email')}
                </div>
              </>
            )}

            {/* Show test recovery code immediately to user for validation convenience */}
            {mode === 'forgot' && devCode && (
              <div className="mb-6 p-4.5 rounded-lg border border-[#cba135]/30 bg-[#cba135]/8 text-[#cba135] text-xs font-mono rise-in">
                <div className="font-semibold mb-1 text-[13px] text-center flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#cba135] animate-ping" />
                  DEVELOPMENT RESET CODE:
                </div>
                <div className="text-[17px] font-bold tracking-widest text-center py-2.5 my-2 bg-[#131a24] rounded border border-[#222b38] select-all">
                  {devCode}
                </div>
                <div className="text-center opacity-85 text-[10.5px]">Copy this code. Redirecting you to reset form...</div>
              </div>
            )}

            <Form error={error} success={success} onSubmit={handleSubmit}>
              
              {/* Role Selection (Signup Mode only) */}
              {mode === 'signup' && (
                <div className="auth-role-row mb-4">
                  <button
                    type="button"
                    onClick={() => setRole('Candidate')}
                    className={`auth-role-btn ${role === 'Candidate' ? 'auth-role-btn-cand-active' : 'auth-role-btn-inactive'}`}
                  >
                    {t('login.role_candidate')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Interviewer')}
                    className={`auth-role-btn ${role === 'Interviewer' ? 'auth-role-btn-int-active' : 'auth-role-btn-inactive'}`}
                  >
                    {t('login.role_interviewer')}
                  </button>
                </div>
              )}

              {/* Full Name Field (Signup Mode only) */}
              {mode === 'signup' && (
                <Input
                  type="text"
                  id="name"
                  label={t('login.label_name')}
                  placeholder={t('login.placeholder_name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<UserIcon size={16} />}
                  required
                />
              )}

              {/* Email Field (Required in all modes) */}
              <Input
                type="email"
                id="email"
                label={t('login.label_email')}
                placeholder={t('login.placeholder_email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<MailIcon size={16} />}
                required
              />

              {/* Reset Code/Token Field (Reset Mode only) */}
              {mode === 'reset' && (
                <Input
                  type="text"
                  id="code"
                  label={t('login.label_code')}
                  placeholder={t('login.placeholder_code')}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  icon={
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M10 5L6 9 3 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  required
                />
              )}

              {/* Password Field (Login, Signup, and Reset modes) */}
              {mode !== 'forgot' && (
                <Input
                  type="password"
                  id="password"
                  label={mode === 'reset' ? 'New Password' : t('login.label_password')}
                  placeholder={t('login.placeholder_password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<LockIcon size={16} />}
                  required
                />
              )}

              {/* Remember and Forgot password link (Login mode only) */}
              {mode === 'login' && (
                <div className="auth-remember-row">
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="auth-checkbox"
                    />
                    {t('login.keep_signed_in')}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleModeChange('forgot')}
                    className="text-[#9aa5b3] hover:text-[#1ec8b5] transition-colors bg-transparent border-none p-0 cursor-pointer text-sm"
                  >
                    {t('login.forgot_password')}
                  </button>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mb-6"
                disabled={submitting}
                icon={
                  submitting ? (
                    <SpinnerIcon size={15} />
                  ) : (
                    <ArrowRightIcon size={14} />
                  )
                }
              >
                {submitting
                  ? 'Processing...'
                  : mode === 'signup'
                  ? t('login.btn_create_account')
                  : mode === 'login'
                  ? t('login.btn_sign_in')
                  : mode === 'forgot'
                  ? t('login.btn_send_code')
                  : t('login.btn_reset_password')}
              </Button>
            </Form>

            {/* Back to login option in Recovery / Reset flows */}
            {(mode === 'forgot' || mode === 'reset') && (
              <div className="text-center mt-2 mb-6">
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  className="text-sm text-[#9aa5b3] hover:text-[#1ec8b5] transition-colors bg-transparent border-none p-0 cursor-pointer font-medium"
                >
                  {t('login.back_to_login')}
                </button>
              </div>
            )}

            <p className="auth-terms">
              {t('login.terms_note')}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
