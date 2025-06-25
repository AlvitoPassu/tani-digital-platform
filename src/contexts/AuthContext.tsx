import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { clearSupabaseSession } from '@/lib/utils';

export type UserRole = 'admin' | 'buyer' | 'farmer';

export interface Profile {
  id: string;
  name: string | null;
  role: UserRole;
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
  clearInvalidSession: () => Promise<void>;
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
  
  // Add refs to prevent infinite loops
  const fetchingProfile = useRef(false);
  const lastFetchedUserId = useRef<string | null>(null);

  // Function to clear invalid session
  const clearInvalidSession = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      lastFetchedUserId.current = null;
      clearSupabaseSession();
      toast({
        title: "Session Diperbarui",
        description: "Silakan login kembali untuk melanjutkan.",
      });
    } catch (error) {
      // Optional: log error
    }
  };

  const fetchProfile = async (userId: string) => {
    if (fetchingProfile.current || lastFetchedUserId.current === userId) {
      return;
    }
    try {
      fetchingProfile.current = true;
      lastFetchedUserId.current = userId;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) {
        return;
      }
      if (data) {
        const profileData: Profile = {
          ...data,
          role: data.role as UserRole
        };
        setProfile(profileData);
      } else {
        await createProfileFromUser(userId);
      }
    } catch (error) {
    } finally {
      fetchingProfile.current = false;
    }
  };

  const createProfileFromUser = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: 'User',
          role: 'buyer'
        })
        .select()
        .single();
      if (profileError) {
        const defaultProfile: Profile = {
          id: userId,
          name: 'User',
          role: 'buyer',
          address: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(defaultProfile);
        return;
      }
      if (profileData) {
        const newProfile: Profile = {
          ...profileData,
          role: profileData.role as UserRole
        };
        setProfile(newProfile);
      }
    } catch (error) {
      const defaultProfile: Profile = {
        id: userId,
        name: 'User',
        role: 'buyer',
        address: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProfile(defaultProfile);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          if (lastFetchedUserId.current !== session.user.id || !profile) {
            await fetchProfile(session.user.id);
          }
        } else {
          setProfile(null);
          lastFetchedUserId.current = null;
        }
        setLoading(false);
      }
    );
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
          if (isMounted) {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
              await fetchProfile(session.user.id);
            }
            setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    getInitialSession();
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
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
      if (error) {
        toast({
          title: "Error Registrasi",
          description: error.message,
          variant: "destructive"
        });
      } else {
        if (data.user && !data.user.email_confirmed_at) {
          toast({
            title: "Registrasi Berhasil",
            description: "Silakan cek email Anda untuk konfirmasi akun.",
          });
        } else {
          toast({
            title: "Registrasi Berhasil",
            description: "Akun Anda berhasil dibuat!",
          });
        }
      }
      return { error };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat registrasi.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        toast({
          title: "Login Gagal",
          description: "Email atau password salah.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang di AgroMart!",
        });
      }
      return { error };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat logout.",
          variant: "destructive"
        });
      } else {
        setProfile(null);
        setUser(null);
        setSession(null);
        lastFetchedUserId.current = null;
        toast({
          title: "Logout Berhasil",
          description: "Anda telah keluar dari akun",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat logout.",
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
    signOut,
    clearInvalidSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};