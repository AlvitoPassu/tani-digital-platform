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
  clearInvalidSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      console.log('Clearing invalid session...');
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      lastFetchedUserId.current = null;
      
      // Clear localStorage using utility function
      clearSupabaseSession();
      
      toast({
        title: "Session Diperbarui",
        description: "Silakan login kembali untuk melanjutkan.",
      });
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  };

  const fetchProfile = async (userId: string) => {
    // Prevent multiple simultaneous fetches for the same user
    if (fetchingProfile.current || lastFetchedUserId.current === userId) {
      return;
    }

    try {
      fetchingProfile.current = true;
      lastFetchedUserId.current = userId;
      
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
        // Try to create profile from user metadata
        await createProfileFromUser(userId);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      fetchingProfile.current = false;
    }
  };

  const createProfileFromUser = async (userId: string) => {
    try {
      console.log('Attempting to create default profile for user:', userId);
      
      // Create a default profile with buyer role
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
        console.error('Error creating profile:', profileError);
        // If profile creation fails, set a default profile in state
        const defaultProfile: Profile = {
          id: userId,
          name: 'User',
          role: 'buyer',
          phone_number: null,
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
        console.log('Profile created successfully:', newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error in createProfileFromUser:', error);
      // Set default profile even if creation fails
      const defaultProfile: Profile = {
        id: userId,
        name: 'User',
        role: 'buyer',
        phone_number: null,
        address: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProfile(defaultProfile);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'no user');
        
        if (!isMounted) return;
        
        // Handle token refresh errors
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.log('Token refresh failed, clearing session...');
          await clearInvalidSession();
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Only fetch profile if user changed or profile is null
          if (lastFetchedUserId.current !== session.user.id || !profile) {
            await fetchProfile(session.user.id);
          }
        } else {
          setProfile(null);
          lastFetchedUserId.current = null;
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          
          // Handle refresh token errors
          if (error.message.includes('Invalid Refresh Token') || error.message.includes('Refresh Token Not Found')) {
            console.log('Invalid refresh token detected, clearing session...');
            await clearInvalidSession();
          }
        } else {
          console.log('Initial session check:', session?.user?.email || 'no session');
          
          if (isMounted) {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              await fetchProfile(session.user.id);
            }
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        
        // Handle refresh token errors in catch block
        if (error instanceof Error && (
          error.message.includes('Invalid Refresh Token') || 
          error.message.includes('Refresh Token Not Found')
        )) {
          console.log('Invalid refresh token detected in catch, clearing session...');
          await clearInvalidSession();
        }
      } finally {
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

      if (!error && data.user) {
        // Insert profile ke tabel profiles
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          role
        });
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      if (error) {
        console.error('Sign up error:', error);
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
      console.error('Sign up catch error:', error);
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
      console.log('Attempting to sign in with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Login Gagal",
          description: "Email atau password salah.",
          variant: "destructive"
        });
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
        description: "Terjadi kesalahan saat login.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
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
        clearSupabaseSession();
        toast({
          title: "Logout Berhasil",
          description: "Anda telah keluar dari akun",
        });
      }
    } catch (error: any) {
      console.error('Sign out catch error:', error);
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