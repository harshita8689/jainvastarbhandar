import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminLayout } from './AdminLayout';
import { Loader2 } from 'lucide-react';

export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-jvb-pink-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-gray-700">
            Verifying Administrator Access...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect unauthenticated visitor to login page
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};
