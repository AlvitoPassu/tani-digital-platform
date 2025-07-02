import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseAvailable } from '@/integrations/supabase/client';
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

// Local storage cart management
const CART_STORAGE_KEY = 'tani_digital_cart';

const getLocalCart = (): CartItemWithProduct[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

const setLocalCart = (cart: CartItemWithProduct[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const useCart = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUsingLocalStorage, setIsUsingLocalStorage] = useState(false);

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id, isUsingLocalStorage],
    queryFn: async () => {
      if (!user) return [];
      
      // Check if Supabase is available
      if (!isSupabaseAvailable()) {
        setIsUsingLocalStorage(true);
        return getLocalCart();
      }

      try {
        // First get cart items
        const { data: cartData, error: cartError } = await supabase!
          .from('cart')
          .select('*')
          .eq('user_id', user.id);

        if (cartError) {
          console.error('Error fetching cart:', cartError);
          // Fallback to localStorage
          setIsUsingLocalStorage(true);
          return getLocalCart();
        }

        if (!cartData || cartData.length === 0) {
          return [];
        }

        // Then get products for these cart items
        const productIds = cartData.map(item => item.product_id);
        const { data: productsData, error: productsError } = await supabase!
          .from('products')
          .select('id, name, price, image_url, unit')
          .in('id', productIds);

        if (productsError) {
          console.error('Error fetching products:', productsError);
          // Fallback to localStorage
          setIsUsingLocalStorage(true);
          return getLocalCart();
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
      } catch (error) {
        console.error('Supabase connection error, using localStorage:', error);
        setIsUsingLocalStorage(true);
        return getLocalCart();
      }
    },
    enabled: !!user,
  });

  // Add item to cart
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1, product }: { productId: number; quantity?: number; product?: any }) => {
      if (!user) throw new Error('User not authenticated');

      if (isUsingLocalStorage || !isSupabaseAvailable()) {
        // Use localStorage
        const currentCart = getLocalCart();
        const existingItem = currentCart.find(item => item.product_id === productId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
          existingItem.updated_at = new Date().toISOString();
        } else {
          const newItem: CartItemWithProduct = {
            id: `local_${Date.now()}_${productId}`,
            product_id: productId,
            quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            product: product || {
              id: productId,
              name: 'Product',
              price: 0,
              image_url: null,
              unit: 'pcs'
            }
          };
          currentCart.push(newItem);
        }
        
        setLocalCart(currentCart);
        return;
      }

      try {
        const { error } = await supabase!.rpc('upsert_cart_item', {
          p_user_id: user.id,
          p_product_id: productId,
          p_quantity: quantity,
        });

        if (error) throw error;
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error);
        setIsUsingLocalStorage(true);
        // Retry with localStorage
        const currentCart = getLocalCart();
        const existingItem = currentCart.find(item => item.product_id === productId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
          existingItem.updated_at = new Date().toISOString();
        } else {
          const newItem: CartItemWithProduct = {
            id: `local_${Date.now()}_${productId}`,
            product_id: productId,
            quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            product: product || {
              id: productId,
              name: 'Product',
              price: 0,
              image_url: null,
              unit: 'pcs'
            }
          };
          currentCart.push(newItem);
        }
        
        setLocalCart(currentCart);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id, isUsingLocalStorage] });
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
      if (isUsingLocalStorage || !isSupabaseAvailable()) {
        const currentCart = getLocalCart();
        const itemIndex = currentCart.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
          if (quantity <= 0) {
            currentCart.splice(itemIndex, 1);
          } else {
            currentCart[itemIndex].quantity = quantity;
            currentCart[itemIndex].updated_at = new Date().toISOString();
          }
          setLocalCart(currentCart);
        }
        return;
      }

      try {
        if (quantity <= 0) {
          const { error } = await supabase!
            .from('cart')
            .delete()
            .eq('id', itemId);
          
          if (error) throw error;
        } else {
          const { error } = await supabase!
            .from('cart')
            .update({ quantity, updated_at: new Date().toISOString() })
            .eq('id', itemId);
          
          if (error) throw error;
        }
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error);
        setIsUsingLocalStorage(true);
        // Retry with localStorage
        const currentCart = getLocalCart();
        const itemIndex = currentCart.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
          if (quantity <= 0) {
            currentCart.splice(itemIndex, 1);
          } else {
            currentCart[itemIndex].quantity = quantity;
            currentCart[itemIndex].updated_at = new Date().toISOString();
          }
          setLocalCart(currentCart);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id, isUsingLocalStorage] });
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
      if (isUsingLocalStorage || !isSupabaseAvailable()) {
        const currentCart = getLocalCart();
        const filteredCart = currentCart.filter(item => item.id !== itemId);
        setLocalCart(filteredCart);
        return;
      }

      try {
        const { error } = await supabase!
          .from('cart')
          .delete()
          .eq('id', itemId);
        
        if (error) throw error;
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error);
        setIsUsingLocalStorage(true);
        // Retry with localStorage
        const currentCart = getLocalCart();
        const filteredCart = currentCart.filter(item => item.id !== itemId);
        setLocalCart(filteredCart);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id, isUsingLocalStorage] });
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
    mutationFn: async (suppressToast?: boolean) => {
      if (!user) throw new Error('User not authenticated');
      
      if (isUsingLocalStorage || !isSupabaseAvailable()) {
        setLocalCart([]);
        return;
      }

      try {
        const { error } = await supabase!
          .from('cart')
          .delete()
          .eq('user_id', user.id);
        
        if (error) throw error;
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error);
        setIsUsingLocalStorage(true);
        setLocalCart([]);
      }
    },
    onSuccess: (data, variables) => {
      if (!variables) {
        toast({
          title: "Berhasil",
          description: "Keranjang berhasil dikosongkan",
        });
      }
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
    addToCart: ({ productId, quantity = 1, product }: { productId: number; quantity?: number; product?: any }) => 
      addToCartMutation.mutate({ productId, quantity, product }),
    updateQuantity: (itemId: string, quantity: number) => updateQuantityMutation.mutate({ itemId, quantity }),
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: (suppressToast?: boolean) => clearCartMutation.mutate(suppressToast),
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending,
    isUsingLocalStorage,
  };
};
