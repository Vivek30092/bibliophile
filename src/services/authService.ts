import { supabase, isSupabaseConfigured } from './supabase';
import { User, Session } from '@supabase/supabase-js';

export const authService = {
  async signIn(email: string, password: string): Promise<{ user: User | null; session: Session | null }> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }
      return { user: data.user, session: data.session };
    }

    throw new Error(
      'Supabase credentials are not connected on this deployment. Please verify that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your Netlify site settings (under Build & Deploy -> Environment) and redeploy.'
    );
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
  },

  async getSession(): Promise<{ user: User | null; session: Session | null }> {
    if (isSupabaseConfigured() && supabase) {
      const { data } = await supabase.auth.getSession();
      return { user: data.session?.user || null, session: data.session };
    }

    return { user: null, session: null };
  },

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    if (isSupabaseConfigured() && supabase) {
      return supabase.auth.onAuthStateChange(callback);
    }
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
};
