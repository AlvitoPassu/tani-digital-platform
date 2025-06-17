import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Initialize Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Types
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  seller_id: string;
  category_id: string;
  image_url?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'admin' | 'farmer' | 'buyer';
  created_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

// Cart Service
export const cartService = {
  async addToCart(userId: string, productId: string, quantity: number = 1): Promise<CartItem> {
    try {
      // Validate input
      if (!userId || !productId) {
        throw new Error('User ID and Product ID are required');
      }

      if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
      }

      const { data, error } = await supabase
        .from('cart')
        .insert([{ 
          user_id: userId, 
          product_id: productId, 
          quantity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select(`
          *,
          product:products(*)
        `)
        .single();

      if (error) {
        throw new Error(`Failed to add item to cart: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned after adding item to cart');
      }

      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const { data, error } = await supabase
        .from('cart')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch cart items: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  },

  async updateQuantity(cartId: string, quantity: number): Promise<CartItem> {
    try {
      // Validate input
      if (!cartId) {
        throw new Error('Cart ID is required');
      }

      if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
      }

      const { data, error } = await supabase
        .from('cart')
        .update({ 
          quantity, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', cartId)
        .select(`
          *,
          product:products(*)
        `)
        .single();

      if (error) {
        throw new Error(`Failed to update cart quantity: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned after updating cart quantity');
      }

      return data;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  },

  async removeFromCart(cartId: string): Promise<void> {
    try {
      if (!cartId) {
        throw new Error('Cart ID is required');
      }

      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartId);

      if (error) {
        throw new Error(`Failed to remove item from cart: ${error.message}`);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }
};