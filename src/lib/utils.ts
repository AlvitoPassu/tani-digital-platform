import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to clear Supabase session
export const clearSupabaseSession = () => {
  if (typeof window !== 'undefined') {
    // Clear all Supabase related localStorage items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('supabase') || key.includes('sb-'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('Supabase session cleared from localStorage');
  }
};

// Utility function to check if session is valid
export const isSessionValid = () => {
  if (typeof window !== 'undefined') {
    const sessionKey = 'sb-kkxhaedaekxosbyzmjit-auth-token';
    const session = localStorage.getItem(sessionKey);
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        const expiresAt = sessionData.expires_at;
        return expiresAt && Date.now() < expiresAt * 1000;
      } catch (error) {
        console.error('Error parsing session:', error);
        return false;
      }
    }
  }
  return false;
};
