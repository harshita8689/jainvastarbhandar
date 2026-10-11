import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase/client';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your administrator email and password.');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setErrorMessage(error);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Monogram */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-jvb-pink-600 to-jvb-wine-800 flex items-center justify-center text-white mx-auto shadow-elevated">
          <span className="font-serif font-bold text-2xl tracking-wider">JVB</span>
        </div>

        <h2 className="mt-4 text-center font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Shop Owner Sign In
        </h2>
        <p className="mt-1 text-center text-xs text-gray-600">
          Jain Vastar Bhandar • Private Inventory Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-gray-200 shadow-xl space-y-6">
          {/* Unconfigured Alert */}
          {!isSupabaseConfigured && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Supabase Not Connected Yet</span>
              </div>
              <p className="leading-relaxed">
                Your environment variables (<code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>) have not been provided yet.
              </p>
              <div className="pt-1">
                <Link
                  to="/admin/setup"
                  className="inline-flex items-center gap-1 font-semibold text-amber-800 underline hover:text-amber-950"
                >
                  <span>View Step-by-Step Setup Guide</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jainvastarbhandar.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
                  autoComplete="email"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full text-xs pl-9 pr-10 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
                  autoComplete="current-password"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-jvb-wine-800 hover:bg-jvb-wine-900 text-white font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <Link
              to="/admin/setup"
              className="text-gray-500 hover:text-jvb-wine-700 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need Setup Help?</span>
            </Link>
            <Link to="/" className="text-jvb-pink-600 hover:underline">
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
