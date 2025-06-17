
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemWithProduct extends CartItem {
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string | null;
    unit: string;
  };
}

export const useCart = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // First get cart items
      const { data: cartData, error: cartError } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id);

      if (cartError) {
        console.error('Error fetching cart:', cartError);
        throw cartError;
      }

      if (!cartData || cartData.length === 0) {
        return [];
      }

      // Then get products for these cart items
      const productIds = cartData.map(item => item.product_id);
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, price, image_url, unit')
        .in('id', productIds);

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw productsError;
      }

      // Combine cart items with product data
      const cartWithProducts = cartData.map(cartItem => {
        const product = productsData?.find(p => p.id === cartItem.product_id);
        return {
          ...cartItem,
          product: product || {
            id: cartItem.product_id,
            name: 'Product not found',
            price: 0,
            image_url: null,
            unit: 'pcs'
          }
        };
      });

      return cartWithProducts as CartItemWithProduct[];
    },
    enabled: !!user,
  });

  // Add item to cart
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: number; quantity?: number }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.rpc('upsert_cart_item', {
        p_user_id: user.id,
        p_product_id: productId,
        p_quantity: quantity,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: "Berhasil",
        description: "Produk berhasil ditambahkan ke keranjang",
      });
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan produk ke keranjang",
        variant: "destructive",
      });
    },
  });

  // Update cart item quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (quantity <= 0) {
        // If quantity is 0 or less, remove the item
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('id', itemId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart')
          .update({ quantity, updated_at: new Date().toISOString() })
          .eq('id', itemId);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
    },
    onError: (error) => {
      console.error('Error updating cart:', error);
      toast({
        title: "Error",
        description: "Gagal mengupdate jumlah produk",
        variant: "destructive",
      });
    },
  });

  // Remove item from cart
  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: "Berhasil",
        description: "Produk berhasil dihapus dari keranjang",
      });
    },
    onError: (error) => {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus produk dari keranjang",
        variant: "destructive",
      });
    },
  });

  // Clear entire cart
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: "Berhasil",
        description: "Keranjang berhasil dikosongkan",
      });
    },
    onError: (error) => {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Gagal mengosongkan keranjang",
        variant: "destructive",
      });
    },
  });

  // Calculate totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return {
    cartItems,
    isLoading,
    totalItems,
    totalPrice,
    addToCart: addToCartMutation.mutate,
    updateQuantity: (itemId: string, quantity: number) => updateQuantityMutation.mutate({ itemId, quantity }),
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
};
