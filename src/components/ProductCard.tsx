import { Star, MapPin, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  name: React.ReactNode;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  seller: string;
  location: string;
  badge: string;
  isDiscount: boolean;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { user } = useAuth();
  const { addToCart, isAddingToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'terlaris': return 'bg-red-500';
      case 'recommended': return 'bg-blue-500';
      case 'premium': return 'bg-purple-500';
      case 'new': return 'bg-green-500';
      case 'organic': return 'bg-emerald-500';
      case 'electric': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk menambahkan produk ke keranjang");
      return;
    }
    
    // Convert product data to match the expected format
    const productData = {
      id: product.id,
      name: typeof product.name === 'string' ? product.name : product.name.toString(),
      price: product.price,
      image_url: product.image,
      unit: 'pcs'
    };
    
    addToCart({ productId: product.id, quantity: 1, product: productData });
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name.toString()}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badge */}
        <div className={`absolute top-3 left-3 ${getBadgeColor(product.badge)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
          {product.badge}
        </div>
        
        {/* Discount Badge */}
        {product.isDiscount && discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-700">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Seller Info */}
        <div className="text-sm text-gray-600 mb-4">
          <div className="font-medium">{product.seller}</div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{product.location}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button 
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isAddingToCart ? "Menambahkan..." : "Tambah ke Keranjang"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
