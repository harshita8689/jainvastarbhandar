import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-jvb-pink-600 to-jvb-wine-700 text-white font-serif font-bold text-3xl flex items-center justify-center mx-auto shadow-elevated">
        <span>404</span>
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
          Page or Suit Material Not Found
        </h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          The page or unstitched suit fabric you are looking for may have been moved, updated, or does not exist.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-jvb-pink-600 hover:bg-jvb-pink-700 text-white font-semibold px-6 py-3 rounded-full text-xs sm:text-sm shadow-md transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>

        <Link
          to="/collection"
          className="inline-flex items-center gap-2 border border-jvb-pink-300 text-jvb-wine-800 hover:bg-jvb-pink-50 font-semibold px-6 py-3 rounded-full text-xs sm:text-sm transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Browse Unstitched Suits</span>
        </Link>
      </div>
    </div>
  );
};
