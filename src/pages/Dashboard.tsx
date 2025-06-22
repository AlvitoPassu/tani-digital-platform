import { useState } from "react";
import Navigation from "@/components/Navigation";
import ChatBot from "@/components/ChatBot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, MessageCircle, Calendar, TrendingUp, Sparkles, ShoppingCart, Package, Users, BarChart3, Shield, AlertTriangle, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Farmer Dashboard Component
const FarmerDashboard = () => {
  return (
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
  );
};

// Buyer Dashboard Component
const BuyerDashboard = () => {
  return (
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
              Cari dan beli produk pertanian
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
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-gray-600" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Lihat dan kelola user
            </p>
            <Button className="w-full bg-gray-800 hover:bg-gray-900">
              Kelola User
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Statistik platform
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Lihat Statistik
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Laporan & Keluhan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Tinjau laporan user
            </p>
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
              Tinjau Laporan
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5 text-green-600" />
              Pengaturan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Atur preferensi platform
            </p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Pengaturan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Main Dashboard
const Dashboard = () => {
  const { profile, loading } = useAuth();

  const renderDashboard = () => {
    // Show loading state while profile is being fetched
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat dashboard...</p>
          </div>
        </div>
      );
    }

    // Show default dashboard if no profile
    if (!profile) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">Memuat profil pengguna...</p>
        </div>
      );
    }

    // Render role-specific dashboard
    if (profile.role === "farmer") return <FarmerDashboard />;
    if (profile.role === "buyer") return <BuyerDashboard />;
    if (profile.role === "admin") return <AdminDashboard />;
    
    // Fallback to buyer dashboard
    return <BuyerDashboard />;
  };

  const getDashboardTitle = () => {
    if (!profile) return "Dashboard";
    if (profile.role === "farmer") return "Dashboard Petani";
    if (profile.role === "buyer") return "Dashboard Pembeli";
    if (profile.role === "admin") return "Dashboard Admin";
    return "Dashboard";
  };

  const getDashboardDescription = () => {
    if (!profile) return "Selamat datang di platform Tani Digital";
    if (profile.role === "farmer") return "Kelola kebun, analisis tanaman, dan dapatkan rekomendasi AI";
    if (profile.role === "buyer") return "Belanja produk pertanian dan pantau pesanan Anda";
    if (profile.role === "admin") return "Kelola platform, user, dan laporan";
    return "Selamat datang di platform Tani Digital";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{getDashboardTitle()}</h1>
            <p className="text-gray-600">{getDashboardDescription()}</p>
          </div>
          {renderDashboard()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 