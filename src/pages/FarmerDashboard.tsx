import React from 'react';
import Navigation from '../components/Navigation';
import ChatBot from '../components/ChatBot';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Camera, MessageCircle, Calendar, TrendingUp, Sparkles, ShoppingCart, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const FarmerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Petani</h1>
            <p className="text-gray-600">Kelola kebun, analisis tanaman, dan dapatkan rekomendasi AI</p>
          </div>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Camera className="h-5 w-5 text-green-600" />
                    Analisis Tanaman
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload foto daun untuk deteksi penyakit
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Mulai Analisis
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    Konsultasi AI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Tanya tentang perawatan tanaman
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Mulai Chat
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Perencanaan Tanam
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Rekomendasi tanaman bulan depan
                  </p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Lihat Rekomendasi
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-yellow-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCart className="h-5 w-5 text-yellow-600" />
                    Belanja Alat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Pupuk dan alat berkebun
                  </p>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                    Belanja Sekarang
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    Statistik Kebun
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Tanaman Aktif:</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Panen Bulan Ini:</span>
                      <Badge variant="secondary">3</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pendapatan:</span>
                      <Badge variant="outline">Rp 2.5M</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Peringatan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-red-600">
                      • Cabai perlu penyiraman
                    </div>
                    <div className="text-sm text-orange-600">
                      • Pupuk habis dalam 3 hari
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  AI Assistant untuk Petani
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChatBot />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard; 