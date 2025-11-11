import { useState, useEffect, useRef, FormEvent } from 'react';
import { LoginCredentials } from '../types';

interface LoginModalProps {
  onLogin: (credentials: LoginCredentials) => void;
  error: string | null;
  isLoading: boolean;
  isOpen: boolean;
}

// Eye icons components to reduce inline SVG clutter
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

export const LoginModal = ({ onLogin, error, isLoading, isOpen }: LoginModalProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  // Handle fade-in animation on mount/open
  useEffect(() => {
    if (isOpen) {
      // Trigger fade-in animation
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      // Trigger fade-out animation
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Focus username field when modal opens
  useEffect(() => {
    if (isOpen && isAnimating) {
      usernameRef.current?.focus();
    }
  }, [isOpen, isAnimating]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim() && password && !isLoading) {
      onLogin({
        username: username.trim(),
        password,
        remember_me: rememberMe,
      });
    }
  };

  // Don't render if not open and animation is complete
  if (!isOpen && !isAnimating) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20 m-0 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className={`rounded-lg shadow-2xl p-8 w-full max-w-md mx-4 border transition-all duration-300 ${
          isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{ backgroundColor: 'var(--card-background)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }}
      >
        {/* Logo and Title */}
        <div className="text-center mb-6">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="mx-auto mb-6 w-16 h-16"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm border bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form 
          onSubmit={handleSubmit} 
          autoComplete="on"
          id="login-form"
          name="login"
          data-form-type="login"
        >
          {/* Username Field */}
          <div className="mb-4">
            <label 
              htmlFor="username" 
              className="block text-sm font-medium mb-2"
            >
              Username
            </label>
            <input
              ref={usernameRef}
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              enterKeyHint="next"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                autoComplete="current-password"
                enterKeyHint="go"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed pr-10 transition-colors"
                style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed accent-sky-900"
              style={{ borderColor: 'var(--border-color)' }}
            />
            <label 
              htmlFor="remember-me" 
              className="ml-2 text-sm"
            >
              Remember me for 7 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            name="submit"
            disabled={isLoading || !username.trim() || !password}
            className="w-full py-2.5 px-4 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-sky-700 hover:bg-sky-800 disabled:hover:bg-sky-700"
            aria-label="Sign in"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

