import { LoginCredentials } from '../types/auth';
import { supabase } from '../supabase';
import { Profile } from '../supabase';
import toast from 'react-hot-toast';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: Profile; token: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned');
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        toast.error('Error fetching user profile');
        throw profileError;
      }

      return {
        user: profile,
        token: data.session?.access_token || '',
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(credentials: LoginCredentials & { name: string }): Promise<{ user: Profile; token: string }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned');
      }

      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            name: credentials.name,
            role: 'farmer', // default role
          },
        ])
        .select()
        .single();

      if (profileError) {
        toast.error('Error creating user profile');
        throw profileError;
      }

      return {
        user: profile,
        token: data.session?.access_token || '',
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async validateToken(): Promise<Profile | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        return null;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return profile;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        throw error;
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
}; 