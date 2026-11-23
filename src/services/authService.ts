import { supabase, isSupabaseConfigured } from './supabase';
import { User, Session } from '@supabase/supabase-js';

const DEMO_ADMIN_KEY = 'bibliophile_demo_admin_logged_in';

export const authService = {
  async signIn(email: string, password: string):Promise<{ user: User | null; session: Session | null }> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { user: data.user, session: data.session };
    }

    // Fallback development mode for initial testing before Supabase credentials are input
    if (email === 'admin@bibliophile.com' && password === 'admin123') {
      localStorage.setItem(DEMO_ADMIN_KEY, 'true');
      return {
        user: { id: 'demo-admin', email: 'admin@bibliophile.com' } as unknown as User,
        session: { access_token: 'demo-token' } as unknown as Session
      };
    }

    throw new Error('Invalid credentials or Supabase Auth not yet configured.');
  },

  async signOut(): Promise<void> {
    localStorage.removeItem(DEMO_ADMIN_KEY);
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
  },

  async getSession(): Promise<{ user: User | null; session: Session | null }> {
    if (isSupabaseConfigured() && supabase) {
      const { data } = await supabase.auth.getSession();
      return { user: data.session?.user || null, session: data.session };
    }

    if (localStorage.getItem(DEMO_ADMIN_KEY) === 'true') {
      return {
        user: { id: 'demo-admin', email: 'admin@bibliophile.com' } as unknown as User,
        session: { access_token: 'demo-token' } as unknown as Session
      };
    }

    return { user: null, session: null };
  },

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    if (isSupabaseConfigured() && supabase) {
      return supabase.auth.onAuthStateChange(callback);
    }
    // Return mock unsubscribe
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
};
