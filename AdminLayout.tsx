import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Package,
  HelpCircle,
  ExternalLink,
  LogOut,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-jvb-wine-900 text-white border-b-2 border-jvb-pink-600 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Portal Tag */}
            <div className="flex items-center gap-3">
              <Link to="/admin" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-jvb-pink-500 to-jvb-wine-600 flex items-center justify-center font-serif font-bold text-sm text-white shadow">
                  JVB
                </div>
                <div>
                  <span className="font-serif font-bold text-base sm:text-lg tracking-wide text-white">
                    Jain Vastar Bhandar
                  </span>
                  <span className="text-[10px] block text-jvb-pink-300 font-semibold uppercase tracking-wider">
                    Store Manager • Est. 1977
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-4 text-xs font-semibold">
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  location.pathname === '/admin'
                    ? 'bg-jvb-wine-800 text-white'
                    : 'text-stone-300 hover:text-white hover:bg-jvb-wine-800/60'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-jvb-pink-400" />
                <span>Product Inventory</span>
              </Link>

              <Link
                to="/admin/setup"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  location.pathname === '/admin/setup'
                    ? 'bg-jvb-wine-800 text-white'
                    : 'text-stone-300 hover:text-white hover:bg-jvb-wine-800/60'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-jvb-pink-400" />
                <span>Setup & Deployment Guide</span>
              </Link>

              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-jvb-wine-800/60 transition-colors flex items-center gap-1.5"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3 h-3 text-jvb-pink-400" />
              </Link>
            </nav>

            {/* User Session & Logout */}
            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden sm:flex items-center gap-2 text-xs text-stone-300 bg-jvb-wine-800/70 py-1 px-3 rounded-full border border-jvb-wine-700">
                  <User className="w-3 h-3 text-jvb-pink-400" />
                  <span className="truncate max-w-[140px]">{user.email}</span>
                </div>
              )}

              {user && (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white bg-jvb-wine-800 hover:bg-jvb-wine-700 py-1.5 px-3 rounded-lg transition-colors border border-jvb-wine-700"
                  title="Log out of Admin Dashboard"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile secondary bar */}
        <div className="md:hidden flex items-center justify-around border-t border-jvb-wine-800 py-2 px-4 text-xs font-medium">
          <Link
            to="/admin"
            className={`flex items-center gap-1 ${
              location.pathname === '/admin' ? 'text-pink-300 font-bold' : 'text-stone-300'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory</span>
          </Link>
          <Link
            to="/admin/setup"
            className={`flex items-center gap-1 ${
              location.pathname === '/admin/setup' ? 'text-pink-300 font-bold' : 'text-stone-300'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Setup Guide</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-1 text-stone-300 hover:text-white"
          >
            <span>Store</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Jain Vastar Bhandar (JVB) Admin • Unstitched Ladies' Suits
          </span>
          <span>
            Clothing Store: Railway Road, Gharaunda, Karnal – 132114
          </span>
        </div>
      </footer>
    </div>
  );
};
