import React from 'react';
import { useCart } from '../lib/context/CartContext';
import { CartItem } from '../lib/supabase';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const { cartItems, loading, updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = async (cartId: string, newQuantity: number) => {
    try {
      if (newQuantity < 1) {
        toast.error('Quantity must be at least 1');
        return;
      }
      await updateQuantity(cartId, newQuantity);
      toast.success('Cart updated successfully');
    } catch (error) {
      toast.error('Failed to update cart');
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemove = async (cartId: string) => {
    try {
      await removeFromCart(cartId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const total = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item: CartItem) => (
            <div
              key={item.id}
              className="flex items-center justify-between border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                {item.product?.image_url && (
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{item.product?.name}</h3>
                  <p className="text-gray-600">${item.product?.price}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold">${total.toFixed(2)}</span>
            </div>
            <button
              className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
              onClick={() => toast.success('Checkout functionality coming soon!')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 