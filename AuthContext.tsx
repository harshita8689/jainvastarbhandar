import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if authenticated user is registered as admin
  const verifyAdminStatus = async (currentUser: User | null): Promise<boolean> => {
    if (!currentUser || !isSupabaseConfigured) {
      return false;
    }

    try {
      // Query admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (!error && data) {
        return true;
      }

      // If admin_users table is empty or during first setup, any authenticated user
      // can be treated as initial admin if they signed in via Supabase dashboard credentials
      const { count } = await supabase.from('admin_users').select('*', { count: 'exact', head: true });
      if (count === 0) {
        return true;
      }

      return false;
    } catch {
      // Fallback: authenticated Supabase user is allowed in admin portal
      return Boolean(currentUser);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const admin = await verifyAdminStatus(session.user);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const admin = await verifyAdminStatus(session.user);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      return {
        error: 'Supabase credentials are not configured yet. Please configure your .env file or Netlify environment variables.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        const admin = await verifyAdminStatus(data.user);
        setIsAdmin(admin);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'Login failed' };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error signing out:', err);
      }
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isLoading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
