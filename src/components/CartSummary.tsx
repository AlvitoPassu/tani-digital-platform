import { ShoppingBag, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
  onClearCart: () => void;
  isClearing: boolean;
}

const CartSummary = ({ totalItems, totalPrice, onClearCart, isClearing }: CartSummaryProps) => {
  const navigate = useNavigate();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ShoppingBag className="h-5 w-5" />
          <span>Ringkasan Pesanan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Item:</span>
          <span className="font-medium">{totalItems} item</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between text-lg font-semibold">
          <span>Total Harga:</span>
          <span className="text-green-600">{formatPrice(totalPrice)}</span>
        </div>
        
        <div className="space-y-2">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleCheckout}
            disabled={totalItems === 0}
          >
            Lanjut ke Pembayaran
          </Button>
          
          <Button 
            variant="outline"
            className="w-full text-red-600 border-red-600 hover:bg-red-50"
            onClick={onClearCart}
            disabled={totalItems === 0 || isClearing}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Kosongkan Keranjang
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
