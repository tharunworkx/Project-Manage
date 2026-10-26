import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg('Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const res = await signUp(email, password, fullName);
        if (res?.error) {
          setErrorMsg(res.error.message || 'Failed to register account');
          setIsSubmitting(false);
          return;
        }
        navigate('/kanban');
      } else {
        const res = await signIn(email, password);
        if (res?.error) {
          setErrorMsg(res.error.message || 'Invalid email or password');
          setIsSubmitting(false);
          return;
        }
        navigate('/kanban');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
      setIsSubmitting(false);
    }
  };

  const handleGitHubClick = (e) => {
    e?.preventDefault?.();
  };

  return (
    <StarsBackground
      starColor="#9FADBC"
      className="min-h-screen w-full flex items-center justify-center p-4 bg-[#101214] select-none"
    >
      <div className="w-full max-w-[390px] mx-auto relative z-10 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header Section */}
        <div className="text-left mb-6">
          <div className="flex items-center gap-2.5 mb-3">
            <img
              src="/logo.png"
              alt="Taskora Logo"
              className="h-9 w-9 rounded-full object-cover shadow-md ring-1 ring-blue-500/30"
            />
            <span className="text-xl font-extrabold tracking-tight text-white">
              Taskora
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#DEE4EA] tracking-tight">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="text-xs text-[#9FADBC] mt-1.5 font-normal">
            {isSignUp
              ? 'Enter your company email to continue your work.'
              : 'Login to your account to continue your work.'}
          </p>
        </div>

        {/* GitHub Social Button (styled to match dashboard card/button palette) */}
        <button
          type="button"
          onClick={handleGitHubClick}
          className="w-full flex items-center justify-center gap-2.5 h-11 rounded-xl border border-[#333C44] bg-[#161A1D] hover:bg-[#22272B] text-[#DEE4EA] text-xs font-semibold transition cursor-pointer active:scale-[0.99] shadow-xs"
        >
          <svg className="h-4.5 w-4.5 fill-current shrink-0" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span>Continue with GitHub</span>
        </button>

        {/* Divider matching dashboard border colors */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#282E33]" />
          </div>
          <span className="relative px-3 bg-[#101214] text-[11px] font-normal text-[#738496]">
            Or continue with email
          </span>
        </div>

        {/* Form Body matching dashboard inputs & text */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl leading-relaxed">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl leading-relaxed">
              {successMsg}
            </div>
          )}

          {/* Full Name (Sign Up only) */}
          {isSignUp && (
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold text-[#DEE4EA] mb-1.5"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                placeholder="e.g. Alex Johnson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-10.5 rounded-xl bg-[#22272B] border border-[#333C44] px-3.5 text-xs text-[#DEE4EA] placeholder-[#738496] focus:outline-none focus:border-[#579DFF] transition"
              />
            </div>
          )}

          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-[#DEE4EA] mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10.5 rounded-xl bg-[#22272B] border border-[#333C44] px-3.5 text-xs text-[#DEE4EA] placeholder-[#738496] focus:outline-none focus:border-[#579DFF] transition"
            />
          </div>

          {/* Password with Lock icon and Eye toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-[#DEE4EA]"
              >
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => alert('Please contact your administrator to reset your password.')}
                  className="text-[11px] text-[#579DFF] hover:underline transition cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#738496] pointer-events-none stroke-[1.8]" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10.5 rounded-xl bg-[#22272B] border border-[#333C44] pl-10 pr-10 text-xs text-[#DEE4EA] placeholder-[#738496] focus:outline-none focus:border-[#579DFF] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#738496] hover:text-[#DEE4EA] transition cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 stroke-[1.8]" />
                ) : (
                  <Eye className="h-4 w-4 stroke-[1.8]" />
                )}
              </button>
            </div>
          </div>

          {/* Remember this device checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="h-4 w-4 rounded border-[#333C44] bg-[#22272B] accent-[#0C66E4] text-[#0C66E4] cursor-pointer"
              />
              <span className="text-xs text-[#DEE4EA] font-medium">Remember this device</span>
            </label>
          </div>

          {/* Sign In Primary Action Button matching Dashboard Brand Blue */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10.5 rounded-xl bg-[#0C66E4] hover:bg-[#0055CC] text-white font-semibold text-xs transition cursor-pointer shadow-xs active:scale-[0.99] flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isSignUp
                  ? 'Creating Account...'
                  : 'Signing In...'
                : isSignUp
                ? 'Sign Up'
                : 'Sign In'}
            </button>
          </div>

          {/* Toggle between Sign In and Sign Up */}
          <div className="text-center pt-3">
            {isSignUp ? (
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs text-[#9FADBC] hover:text-[#DEE4EA] transition cursor-pointer"
              >
                Already have an account?{' '}
                <span className="text-[#579DFF] font-semibold hover:underline">
                  Sign in
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs text-[#9FADBC] hover:text-[#DEE4EA] transition cursor-pointer"
              >
                Don't have an account?{' '}
                <span className="text-[#579DFF] font-semibold hover:underline">
                  Sign up
                </span>
              </button>
            )}
          </div>

          {/* Footer Copyright matching dashboard muted text */}
          <p className="text-[11px] text-[#738496] text-center pt-4 font-normal">
            © 2026 PaceUI, Inc. All rights reserved.
          </p>
        </form>
      </div>
    </StarsBackground>
  );
}
