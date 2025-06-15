
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'buyer' | 'farmer';

export interface Profile {
  id: string;
  name: string | null;
  role: UserRole;
  phone_number: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        const profileData: Profile = {
          ...data,
          role: data.role as UserRole
        };
        console.log('Profile fetched successfully:', profileData);
        setProfile(profileData);
      } else {
        console.log('No profile found for user:', userId);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      console.log('Attempting to sign up with email:', email);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role
          }
        }
      });

      console.log('Sign up response:', { data, error });

      if (error) {
        console.error('Sign up error:', error);
        if (error.message.includes('User already registered')) {
          toast({
            title: "Email Sudah Terdaftar",
            description: "Email ini sudah terdaftar. Silakan login atau gunakan email lain.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error Registrasi",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Registrasi Berhasil",
          description: "Silakan cek email Anda untuk konfirmasi akun. Jika tidak ada di inbox, cek folder spam.",
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Sign up catch error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.error('Sign in error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Login Gagal",
            description: "Email atau password salah. Pastikan email sudah dikonfirmasi.",
            variant: "destructive"
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Belum Dikonfirmasi",
            description: "Silakan cek email Anda dan klik link konfirmasi terlebih dahulu.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error Login",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        console.log('Login successful for user:', data.user?.email);
        toast({
          title: "Login Berhasil",
          description: "Selamat datang di AgroMart!",
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Sign in catch error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      await supabase.auth.signOut();
      setProfile(null);
      setUser(null);
      setSession(null);
      toast({
        title: "Logout Berhasil",
        description: "Anda telah keluar dari akun",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
