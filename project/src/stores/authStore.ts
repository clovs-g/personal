import { create } from 'zustand';
import { supabase, supabaseConfigured, supabaseConfigWarning } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, _get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  signIn: async (email: string, password: string) => {
    try {
      if (!supabaseConfigured) {
        const msg = supabaseConfigWarning();
        console.warn(msg);
        // If supabase is not configured we still allow a demo login only when explicitly enabled
        const allowDemo = import.meta.env.VITE_ALLOW_DEMO_LOGIN === 'true';
        if (!allowDemo) {
          throw new Error(msg || 'Supabase not configured');
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        // Do not immediately fallback to demo login on auth error unless explicitly allowed
        const allowDemo = import.meta.env.VITE_ALLOW_DEMO_LOGIN === 'true';
        if (allowDemo) {
          console.warn('Supabase sign-in failed, but demo login is enabled. Sign-in error:', error.message);
        } else {
          throw error;
        }
      }

      if (data?.user) {
        set({ user: data.user, isAuthenticated: true });
        return;
      }

      // If we reach here and demo is allowed, use demo fallback
      const demoEmail = import.meta.env.VITE_DEMO_ADMIN_EMAIL || 'admin@example.com';
      const demoPassword = import.meta.env.VITE_DEMO_ADMIN_PASSWORD || 'password123';
      const allowDemo = import.meta.env.VITE_ALLOW_DEMO_LOGIN === 'true';
      if (allowDemo && email === demoEmail && password === demoPassword) {
        const mockUser = { id: 'demo-user', email } as unknown as User;
        set({ user: mockUser, isAuthenticated: true });
        return;
      }

      throw new Error('Sign-in failed: invalid credentials');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Client-only demo sign-in. Creates a mock in-memory user for testing/admin access.
  // This does NOT authenticate with Supabase and should only be used for testing.
  // no demo sign-in in production; use real Supabase signIn/signUp flows

  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) throw error;
      set({
        user: data.user,
        isAuthenticated: true
      });
      // Try to create an admin record in the `admins` table. If the table
      // doesn't exist (migration not applied), don't block signup — just log.
      try {
        if (data?.user?.id) {
          await supabase.from('admins').insert([{ user_id: data.user.id, email }]);
        }
      } catch (e) {
        // Non-fatal: table may not exist yet. Log for debugging.
        console.warn('Could not create admin row in `admins` table:', e);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({
        user: null,
        isAuthenticated: false
      });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  initialize: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          user: session?.user ?? null,
          isAuthenticated: !!session?.user
        });
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  }
}));