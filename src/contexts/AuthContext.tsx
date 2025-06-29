import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseAvailable } from '@/integrations/supabase/client';
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

// Local storage auth management
const AUTH_STORAGE_KEY = 'tani_digital_auth';

const getLocalAuth = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading auth from localStorage:', error);
    return null;
  }
};

const setLocalAuth = (authData: any) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Error saving auth to localStorage:', error);
  }
};

const clearLocalAuth = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing auth from localStorage:', error);
  }
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
      if (isSupabaseAvailable() && supabase) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setProfile(null);
      setSession(null);
      lastFetchedUserId.current = null;
      clearSupabaseSession();
      clearLocalAuth();
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
    
    // If Supabase is not available, use local auth
    if (!isSupabaseAvailable() || !supabase) {
      const localAuth = getLocalAuth();
      if (localAuth && localAuth.user && localAuth.profile) {
        setUser(localAuth.user);
        setProfile(localAuth.profile);
        setSession(localAuth.session);
        lastFetchedUserId.current = userId;
      }
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
      if (!isSupabaseAvailable() || !supabase) {
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

    // If Supabase is not available, use local auth
    if (!isSupabaseAvailable() || !supabase) {
      const localAuth = getLocalAuth();
      if (localAuth) {
        setUser(localAuth.user);
        setProfile(localAuth.profile);
        setSession(localAuth.session);
        lastFetchedUserId.current = localAuth.user?.id || null;
      }
      setLoading(false);
      return;
    }

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
      if (!isSupabaseAvailable() || !supabase) {
        // Create local user for demo purposes
        const demoUser: User = {
          id: `local_${Date.now()}`,
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          aud: 'authenticated',
          role: 'authenticated',
          app_metadata: {},
          user_metadata: { name, role },
          identities: [],
          factors: []
        };
        
        const demoProfile: Profile = {
          id: demoUser.id,
          name,
          role,
          address: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const demoSession: Session = {
          access_token: 'demo_token',
          refresh_token: 'demo_refresh',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'bearer',
          user: demoUser
        };

        setUser(demoUser);
        setProfile(demoProfile);
        setSession(demoSession);
        
        setLocalAuth({ user: demoUser, profile: demoProfile, session: demoSession });
        
        toast({
          title: "Registrasi Berhasil",
          description: "Akun demo berhasil dibuat (mode offline)",
        });
        
        return { error: null };
      }

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
          variant: "destructive",
        });
        return { error };
      }
      toast({
        title: "Registrasi Berhasil",
        description: "Silakan cek email Anda untuk verifikasi.",
      });
      return { error: null };
    } catch (error) {
      toast({
        title: "Error Registrasi",
        description: "Terjadi kesalahan saat registrasi.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!isSupabaseAvailable() || !supabase) {
        // For demo purposes, allow any email/password combination
        const demoUser: User = {
          id: `local_${Date.now()}`,
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          aud: 'authenticated',
          role: 'authenticated',
          app_metadata: {},
          user_metadata: { name: 'Demo User', role: 'buyer' },
          identities: [],
          factors: []
        };
        
        const demoProfile: Profile = {
          id: demoUser.id,
          name: 'Demo User',
          role: 'buyer',
          address: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const demoSession: Session = {
          access_token: 'demo_token',
          refresh_token: 'demo_refresh',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'bearer',
          user: demoUser
        };

        setUser(demoUser);
        setProfile(demoProfile);
        setSession(demoSession);
        
        setLocalAuth({ user: demoUser, profile: demoProfile, session: demoSession });
        
        toast({
          title: "Login Berhasil",
          description: "Selamat datang di Tani Digital Platform (mode demo)",
        });
        
        return { error: null };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast({
          title: "Error Login",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali!",
      });
      return { error: null };
    } catch (error) {
      toast({
        title: "Error Login",
        description: "Terjadi kesalahan saat login.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      if (isSupabaseAvailable() && supabase) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setProfile(null);
      setSession(null);
      lastFetchedUserId.current = null;
      clearLocalAuth();
      toast({
        title: "Logout Berhasil",
        description: "Anda telah keluar dari aplikasi.",
      });
    } catch (error) {
      toast({
        title: "Error Logout",
        description: "Terjadi kesalahan saat logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      clearInvalidSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
};