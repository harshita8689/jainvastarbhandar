import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import { Link } from 'react-router-dom';

export const ConfigBanner: React.FC = () => {
  if (isSupabaseConfigured) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-3 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Database Not Connected Yet:</strong> Supabase environment variables are missing. Storefront is in demonstration mode.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="font-medium underline hover:text-amber-800 flex items-center gap-1"
          >
            Open Admin Setup Guide <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
