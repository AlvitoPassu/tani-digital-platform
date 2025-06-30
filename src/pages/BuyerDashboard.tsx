import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, MessageCircle, Heart, Star, TrendingUp, CreditCard, Truck, Clock, MapPin, Filter, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const BuyerDashboard = () => {
  const { profile } = useAuth();
  const [recentOrders] = useState([
    {
      id: "ORD-001",
      status: "Dalam Pengiriman",
      items: ["Cabai Merah", "Tomat", "Kentang"],
      total: 150000,
      date: "2024-01-15",
      estimatedDelivery: "2024-01-18"
    },
    {
      id: "ORD-002", 
      status: "Selesai",
      items: ["Bawang Merah", "Cabai Hijau"],
      total: 75000,
      date: "2024-01-10",
      delivered: "2024-01-12"
    }
  ]);

  const [favoriteProducts] = useState([
    { name: "Cabai Merah Segar", price: 25000, rating: 4.8, image: "🌶️" },
    { name: "Tomat Organik", price: 18000, rating: 4.9, image: "🍅" },
    { name: "Kentang Premium", price: 22000, rating: 4.7, image: "🥔" }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Selamat Datang, {profile?.name || 'Pembeli'}! 🛒
          </h1>
          <p className="text-gray-600">
            Temukan produk pertanian berkualitas dari petani lokal
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Order</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <ShoppingCart className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Dalam Pengiriman</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <Truck className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Favorit</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Heart className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Belanja</p>
                  <p className="text-2xl font-bold">Rp 2.1M</p>
                </div>
                <CreditCard className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Belanja Produk */}
          <Card className="hover:shadow-lg transition-all duration-300 border-green-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                Belanja Produk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Cari dan beli produk pertanian segar dari petani lokal
              </p>
              <div className="space-y-2">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Mulai Belanja
                </Button>
                <Button variant="outline" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Cari Produk
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Pengiriman */}
          <Card className="hover:shadow-lg transition-all duration-300 border-blue-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-blue-600" />
                Status Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.slice(0, 2).map((order) => (
                  <div key={order.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{order.id}</span>
                      <Badge variant={order.status === "Dalam Pengiriman" ? "default" : "secondary"}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      {order.items.join(", ")}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Rp {order.total.toLocaleString()}
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Lihat Semua Order
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Produk Favorit */}
          <Card className="hover:shadow-lg transition-all duration-300 border-pink-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5 text-pink-600" />
                Produk Favorit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {favoriteProducts.map((product, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
                    <span className="text-2xl">{product.image}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-gray-600">Rp {product.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{product.rating}</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Lihat Semua Favorit
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Riwayat Belanja */}
          <Card className="hover:shadow-lg transition-all duration-300 border-purple-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Riwayat Belanja
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bulan Ini:</span>
                  <Badge variant="outline">Rp 450K</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bulan Lalu:</span>
                  <Badge variant="outline">Rp 380K</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Target Belanja:</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <Button variant="outline" className="w-full">
                  Lihat Detail
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bantuan & Support */}
          <Card className="hover:shadow-lg transition-all duration-300 border-indigo-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5 text-indigo-600" />
                Bantuan & Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat dengan CS
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Lacak Pengiriman
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Riwayat Order
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  Lokasi Toko
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rekomendasi Produk */}
          <Card className="hover:shadow-lg transition-all duration-300 border-yellow-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-yellow-600" />
                Rekomendasi untuk Anda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-800 mb-2">
                    Berdasarkan riwayat belanja Anda
                  </p>
                  <p className="text-xs text-gray-600">
                    Produk segar yang baru tiba dari petani terpercaya
                  </p>
                </div>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                  Lihat Rekomendasi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifikasi Terbaru */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Clock className="h-5 w-5" />
              Notifikasi Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-lg">
                <Truck className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Order ORD-001 sedang dalam pengiriman</p>
                  <p className="text-xs text-blue-600">Estimasi tiba: 2-3 hari lagi</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg">
                <Package className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Order ORD-002 telah diterima</p>
                  <p className="text-xs text-green-600">Terima kasih telah berbelanja!</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-100 rounded-lg">
                <Star className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Produk favorit Anda tersedia kembali</p>
                  <p className="text-xs text-purple-600">Cabai Merah Segar - Stok terbatas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuyerDashboard; 