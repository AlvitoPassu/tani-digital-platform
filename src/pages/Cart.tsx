import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    isLoading,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
    isUpdating,
    isRemoving,
    isClearing,
  } = useCart();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Diperlukan</h2>
          <p className="text-gray-600 mb-6">Silakan login untuk melihat keranjang belanja Anda</p>
          <Button onClick={() => navigate("/auth")}>
            Login Sekarang
          </Button>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">Keranjang Belanja</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
            <p className="text-gray-600 mb-8">Belum ada produk di keranjang Anda</p>
            <Button 
              onClick={() => navigate("/")}
              className="bg-green-600 hover:bg-green-700"
            >
              Mulai Belanja
            </Button>
          </div>
        ) : (
          // Cart with Items
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Item di Keranjang ({totalItems} item)
                </h2>
              </div>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    isUpdating={isUpdating}
                    isRemoving={isRemoving}
                  />
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary
                totalItems={totalItems}
                totalPrice={totalPrice}
                onClearCart={clearCart}
                onCheckout={handleCheckout}
                isClearing={isClearing}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
