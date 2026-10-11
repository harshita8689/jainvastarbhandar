import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase/client';

export const CustomerAuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = (location.state as any)?.from?.pathname || '/cart';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage(
        'Online customer registration is in demo mode. You can proceed with Guest Ordering directly on the Cart page!'
      );
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
              phone: phone.trim(),
            },
          },
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          navigate(returnUrl);
        } else {
          setSuccessMessage(
            'Account created! Please check your email inbox to verify your account, or sign in.'
          );
          setIsSignUp(false);
        }
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        navigate(returnUrl);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-2xl border border-jvb-pink-100 shadow-card p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-jvb-pink-600 to-jvb-wine-700 text-white flex items-center justify-center mx-auto shadow-md">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            {isSignUp ? 'Create Customer Account' : 'Customer Sign In'}
          </h1>
          <p className="text-xs text-gray-600">
            {isSignUp
              ? 'Join Jain Vastar Bhandar to save your unstitched suit orders'
              : 'Sign in to review your cart and order unstitched suits'}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full text-xs pl-9 pr-10 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 bg-gray-50/50"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-jvb-pink-600 hover:bg-jvb-pink-700 text-white font-semibold py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Please wait...' : isSignUp ? 'Create My Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-gray-100 flex flex-col gap-3 text-center text-xs">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage(null);
            }}
            className="text-jvb-pink-600 hover:underline font-semibold"
          >
            {isSignUp
              ? 'Already have an account? Sign In here'
              : "Don't have an account yet? Create one here"}
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200" />
            <span className="flex-shrink mx-3 text-gray-400 text-[11px] uppercase tracking-wider">
              Or
            </span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          <Link
            to="/cart"
            className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            <span>Continue as Guest to Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
