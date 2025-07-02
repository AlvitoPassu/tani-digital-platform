import { useState } from "react";
fitur-cari-produk
import { useNavigate } from "react-router-dom";
main
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Calendar, TrendingUp, ShoppingCart, Package, AlertTriangle, Leaf, Droplets, Sun, Thermometer, BarChart3, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const FarmerDashboard = () => {
  const { profile } = useAuth();
fitur-cari-produk
  const navigate = useNavigate();

main
  const [weatherData] = useState({
    temperature: 28,
    humidity: 75,
    rainfall: 0,
    uvIndex: 6
  });

  const [cropStats] = useState({
    activeCrops: 12,
    harvestThisMonth: 3,
    income: 2500000,
    healthScore: 85
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Selamat Datang, {profile?.name || 'Petani'}! 🌾
          </h1>
          <p className="text-gray-600">
            Kelola kebun Anda dengan teknologi AI terdepan
          </p>
        </div>

        {/* Weather & Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Suhu</p>
                  <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
                </div>
                <Thermometer className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Kelembaban</p>
                  <p className="text-2xl font-bold">{weatherData.humidity}%</p>
                </div>
                <Droplets className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Curah Hujan</p>
                  <p className="text-2xl font-bold">{weatherData.rainfall}mm</p>
                </div>
                <Sun className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">UV Index</p>
                  <p className="text-2xl font-bold">{weatherData.uvIndex}</p>
                </div>
                <Sun className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Analisis Tanaman */}
          <Card className="hover:shadow-lg transition-all duration-300 border-green-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Camera className="h-5 w-5 text-green-600" />
                Analisis Tanaman
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Upload foto daun untuk deteksi penyakit dan hama
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Mulai Analisis
              </Button>
            </CardContent>
          </Card>

          {/* Perencanaan Tanam */}
          <Card className="hover:shadow-lg transition-all duration-300 border-blue-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                Perencanaan Tanam
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
fitur-cari-produk
                Dapatkan rekomendasi tanaman yang cocok ditanam bulan depan berdasarkan musim dan cuaca.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Lihat Rekomendasi Bulan Depan

                Rekomendasi tanaman berdasarkan musim dan cuaca
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Lihat Rekomendasi
main
              </Button>
            </CardContent>
          </Card>

fitur-cari-produk
          {/* Belanja Pupuk & Alat */}

          {/* Belanja Alat */}
main
          <Card className="hover:shadow-lg transition-all duration-300 border-yellow-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5 text-yellow-600" />
fitur-cari-produk
                Belanja Pupuk & Alat
                Belanja Alat
main
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
fitur-cari-produk
                Cari dan beli pupuk, pestisida, serta alat berkebun sederhana untuk merawat tanaman Anda.
              </p>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700" onClick={() => window.location.href = '/search?category=pupuk-alat'}>

                Pupuk, pestisida, dan alat berkebun berkualitas
              </p>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
main
                Belanja Sekarang
              </Button>
            </CardContent>
          </Card>

fitur-cari-produk
          {/* Toko Saya - Fitur Jual Produk */}
          <Card className="hover:shadow-lg transition-all duration-300 border-orange-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-orange-600" />
                Toko Saya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Buka toko Anda dan tambahkan produk hasil panen untuk dijual di platform ini.
              </p>
              <div className="space-y-2">
                <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => navigate('/my-store')}>
                  Kelola Toko & Produk
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/add-product')}>
                  Tambah Produk Baru
                </Button>
              </div>
            </CardContent>
          </Card>


main
          {/* Statistik Kebun */}
          <Card className="hover:shadow-lg transition-all duration-300 border-indigo-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Statistik Kebun
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tanaman Aktif:</span>
                  <Badge variant="secondary">{cropStats.activeCrops}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Panen Bulan Ini:</span>
                  <Badge variant="secondary">{cropStats.harvestThisMonth}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pendapatan:</span>
                  <Badge variant="outline">Rp {(cropStats.income / 1000000).toFixed(1)}M</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Kesehatan Tanaman:</span>
                    <span>{cropStats.healthScore}%</span>
                  </div>
                  <Progress value={cropStats.healthScore} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monitoring Tanaman */}
          <Card className="hover:shadow-lg transition-all duration-300 border-emerald-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="h-5 w-5 text-emerald-600" />
                Monitoring Tanaman
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Cabai - Sehat</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Tomat - Perlu Perhatian</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Jagung - Sehat</span>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  Lihat Semua
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lokasi Kebun */}
          <Card className="hover:shadow-lg transition-all duration-300 border-red-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-red-600" />
                Lokasi Kebun
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>Kebun Utama: Desa Sukamaju</p>
                  <p>Luas: 2.5 Hektar</p>
                  <p>Jenis Tanah: Lempung Berpasir</p>
                </div>
                <Button variant="outline" className="w-full">
                  Lihat Peta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Peringatan dan Notifikasi */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Peringatan & Notifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">Cabai perlu penyiraman</p>
                  <p className="text-xs text-red-600">Terakhir disiram: 2 hari yang lalu</p>
                </div>
              </div>
fitur-cari-produk
              <div className="flex items-center gap-3 p-3 bg-orange-100 rounded-lg">
                <Package className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Pupuk NPK habis dalam 3 hari</p>
                  <p className="text-xs text-orange-600">Stok tersisa: 2 kg</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Jadwal panen tomat minggu depan</p>
                  <p className="text-xs text-blue-600">Estimasi hasil: 500 kg</p>
                </div>
              </div>

main
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmerDashboard; 