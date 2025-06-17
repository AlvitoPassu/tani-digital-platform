
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const CartSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    cartItems,
    isLoading,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    isUpdating,
    isRemoving,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!user) {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5 text-orange-600" />
            Keranjang Belanja
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Silakan login untuk melihat keranjang belanja Anda
          </p>
          <Button 
            onClick={() => navigate("/auth")}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            Login Sekarang
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5 text-orange-600" />
            Keranjang Belanja
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-orange-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-orange-600" />
            Keranjang Belanja
          </div>
          {totalItems > 0 && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {totalItems} item
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cartItems.length === 0 ? (
          <div className="text-center py-4">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-3">Keranjang kosong</p>
            <Button 
              onClick={() => navigate("/")}
              variant="outline"
              size="sm"
            >
              Mulai Belanja
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Cart Items */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {cartItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  {/* Product Image */}
                  <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xs text-gray-500">No</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatPrice(item.product.price)} / {item.product.unit}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={isUpdating || item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="text-xs font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={isUpdating}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeFromCart(item.id)}
                      disabled={isRemoving}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {cartItems.length > 3 && (
                <div className="text-center py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/cart")}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    Lihat {cartItems.length - 3} item lainnya
                  </Button>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">Total:</span>
                <span className="text-sm font-bold text-orange-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              
              <div className="space-y-2">
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  size="sm"
                  onClick={() => navigate("/cart")}
                >
                  Lihat Keranjang
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CartSection;
