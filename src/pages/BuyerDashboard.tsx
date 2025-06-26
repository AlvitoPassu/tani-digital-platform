import React from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ShoppingCart, Package, MessageCircle, Heart, Star, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const BuyerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <Navigation />
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Pembeli</h1>
            <p className="text-gray-600">Belanja produk pertanian dan pantau pesanan Anda</p>
          </div>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                    Belanja Produk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Cari dan beli produk pertanian segar
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Mulai Belanja
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                    Status Pengiriman
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Order #12345</span>
                      <Badge variant="outline">Dalam Pengiriman</Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      Estimasi: 2-3 hari lagi
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5 text-purple-600" />
                    Bantuan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Tanya tentang produk atau layanan
                  </p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Hubungi Support
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="h-5 w-5 text-red-600" />
                    Wishlist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Produk Tersimpan:</span>
                      <Badge variant="secondary">8</Badge>
                    </div>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Lihat Wishlist
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-yellow-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Riwayat Belanja
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Order:</span>
                      <Badge variant="secondary">15</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Belanja:</span>
                      <Badge variant="outline">Rp 1.2M</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    Rekomendasi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Produk yang mungkin Anda suka
                  </p>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Lihat Rekomendasi
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders Section */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Pesanan Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Order #12345</h4>
                      <p className="text-sm text-gray-600">Sayuran Organik Pack</p>
                      <p className="text-xs text-gray-500">2 Desember 2024</p>
                    </div>
                    <Badge variant="outline">Selesai</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Order #12344</h4>
                      <p className="text-sm text-gray-600">Buah-buahan Segar</p>
                      <p className="text-xs text-gray-500">1 Desember 2024</p>
                    </div>
                    <Badge variant="secondary">Dalam Pengiriman</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Order #12343</h4>
                      <p className="text-sm text-gray-600">Beras Organik</p>
                      <p className="text-xs text-gray-500">30 November 2024</p>
                    </div>
                    <Badge variant="outline">Selesai</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyerDashboard; 