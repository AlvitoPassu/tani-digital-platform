import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError, Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'Admin' | 'User';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
}

interface ProfileUpdate {
  name?: string;
  avatar_url?: string;
  role?: UserRole;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  login: (provider: Provider) => Promise<void>;
  updateProfile: (updates: ProfileUpdate) => Promise<void>;
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

  useEffect(() => {
    let isMounted = true;
    
    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (isMounted) {
          if (error) {
            console.error('Error fetching profile:', error);
            setProfile(null);
          } else if (data) {
            setProfile(data as Profile);
          } else {
            setProfile(null);
          }
        }
      } catch (error) {
        console.error('Catastrophic error in fetchProfile:', error);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isMounted) {
          setSession(session);
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (currentUser) {
            await fetchProfile(currentUser.id);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }
      }
    );

    // Initial load
    const initialLoad = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (isMounted) {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        }
        setLoading(false);
      }
    };
    initialLoad();

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });
    if (error) toast({ title: "Error Registrasi", description: error.message, variant: "destructive" });
    else if (data.user) toast({ title: "Registrasi Berhasil", description: "Silakan cek email Anda untuk verifikasi." });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast({ title: "Login Gagal", description: "Email atau password salah.", variant: "destructive" });
    else toast({ title: "Login Berhasil", description: "Selamat datang kembali!" });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast({ title: "Error", description: "Terjadi kesalahan saat logout.", variant: "destructive" });
    else {
      setUser(null);
      setProfile(null);
      setSession(null);
      toast({ title: "Logout Berhasil", description: "Anda telah keluar." });
    }
  };
  
  const login = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) toast({ title: "Login Gagal", description: `Gagal login dengan ${provider}.`, variant: "destructive"});
  };

  const updateProfile = async (updates: ProfileUpdate) => {
    if (!user) {
      toast({ title: "Error", description: "Anda harus login untuk update profil.", variant: "destructive"});
      return;
    }
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) toast({ title: "Update Gagal", description: "Gagal memperbarui profil.", variant: "destructive" });
    else {
      // Manual refetch of profile data
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if(data) setProfile(data as Profile);
      toast({ title: "Profil Diperbarui", description: "Profil Anda berhasil diperbarui." });
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
    login,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
