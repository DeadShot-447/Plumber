import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  KeyRound,
  Info,
  CheckCircle2
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to admin dashboard
  useEffect(() => {
    if (user) {
      const searchParams = new URLSearchParams(location.search);
      const returnUrl = searchParams.get('redirect') || '/admin';
      navigate(returnUrl, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Frontend validation & sanitization
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    if (!cleanEmail.includes('@') || cleanEmail.length > 100) {
      setErrorMessage('Please enter a valid administrative email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(cleanEmail, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid email or password.');
      } else {
        const searchParams = new URLSearchParams(location.search);
        const returnUrl = searchParams.get('redirect') || '/admin';
        navigate(returnUrl, { replace: true });
      }
    } catch {
      setErrorMessage('A network error occurred while verifying credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle radial ambient lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Site Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-14 h-14 bg-sky-500/10 border border-sky-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-950/50">
            <ShieldCheck className="w-7 h-7 text-sky-400" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Dispatch Portal
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
            {BUSINESS_INFO.name} · Sebring, FL
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-7 sm:p-9 shadow-2xl shadow-black/80">
          
          {/* Security Banner */}
          <div className="mb-6 pb-4 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>TLS / Bcrypt Secured</span>
            </span>
            <span className="text-slate-500 font-mono">RBAC v2.4</span>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="admin-email" 
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Administrative Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="admin@allserviceplumbing.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950/70 text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="admin-password" 
                  className="block text-xs font-bold uppercase tracking-wider text-slate-300"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-700 bg-slate-950/70 text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 active:scale-98 disabled:bg-slate-700 disabled:text-slate-400 transition-all shadow-lg shadow-sky-950/50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Authenticate & Access Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-[11px] text-slate-500">
            Protected under 15-minute rate limit lockout after 5 consecutive failed attempts.
          </div>
        </div>

      </div>
    </div>
  );
}
