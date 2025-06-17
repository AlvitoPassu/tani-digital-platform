import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kkxhaedaekxosbyzmjit.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtreGhhZWRhZWt4b3NieXptaml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MTY2MTEsImV4cCI6MjA2NTI5MjYxMX0.zwPlGGB-_lODoO_SbubdZezWFTrBGAcGi6BiFFydG28';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for Supabase tables
export type Profile = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'admin' | 'farmer' | 'buyer';
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  seller_id: string;
  category_id: string;
  image_url?: string;
  created_at: string;
};

export type Order = {
  id: string;
  buyer_id: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}; 