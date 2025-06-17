import { supabase } from '../supabase';
import { CartItem } from '../supabase';

export const cartService = {
  async addToCart(userId: string, productId: string, quantity: number = 1): Promise<CartItem> {
    const { data, error } = await supabase
      .from('cart')
      .insert([{ user_id: userId, product_id: productId, quantity }])
      .select('*, product:products(*)')
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('No data returned after adding item to cart');
    return data;
  },

  async getCartItems(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async updateQuantity(cartId: string, quantity: number): Promise<CartItem> {
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('id', cartId)
      .select('*, product:products(*)')
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('No data returned after updating cart quantity');
    return data;
  },

  async removeFromCart(cartId: string): Promise<void> {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', cartId);

    if (error) throw new Error(error.message);
  }
};