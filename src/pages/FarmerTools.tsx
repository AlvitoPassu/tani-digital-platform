import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Calendar, TrendingUp, Leaf, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const FarmerTools = () => {
  const { profile } = useAuth();
  const [selectedTab, setSelectedTab] = useState("analysis");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      // Simulate analysis
      setTimeout(() => {
        setAnalysisResult({
          disease: "Bercak Daun",
          confidence: 85,
          treatment: "Gunakan fungisida organik dan pastikan sirkulasi udara yang baik",
          severity: "Sedang"
        });
      }, 2000);
    }
  };

  const cropRecommendations = [
    {
      name: "Cabai Merah",
      reason: "Harga tinggi, permintaan stabil",
      plantingTime: "Januari - Maret",
      expectedYield: "2-3 ton/ha",
      profit: "Rp 15-20 juta/ha"
    },
    {
      name: "Tomat",
      reason: "Cuaca mendukung, pasar terbuka",
      plantingTime: "Februari - April",
      expectedYield: "25-30 ton/ha",
      profit: "Rp 8-12 juta/ha"
    },
    {
      name: "Kangkung",
      reason: "Pertumbuhan cepat, modal rendah",
      plantingTime: "Maret - Mei",
      expectedYield: "10-15 ton/ha",
      profit: "Rp 3-5 juta/ha"
    }
  ];

  const farmStats = [
    { label: "Luas Lahan", value: "2.5 Ha", icon: Leaf },
    { label: "Tanaman Aktif", value: "8 Jenis", icon: CheckCircle },
    { label: "Panen Bulan Ini", value: "3 Kali", icon: Calendar },
    { label: "Pendapatan", value: "Rp 2.5M", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Alat Petani</h1>
            <p className="text-gray-600">Kelola kebun dan dapatkan bantuan AI untuk pertanian Anda</p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {farmStats.map((stat, index) => (
              <Card key={index} className="border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-green-600">{stat.value}</p>
                    </div>
                    <stat.icon className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-6">
            <Button
              variant={selectedTab === "analysis" ? "default" : "outline"}
              onClick={() => setSelectedTab("analysis")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Camera className="h-4 w-4 mr-2" />
              Analisis Tanaman
            </Button>
            <Button
              variant={selectedTab === "planning" ? "default" : "outline"}
              onClick={() => setSelectedTab("planning")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Perencanaan Tanam
            </Button>
            <Button
              variant={selectedTab === "management" ? "default" : "outline"}
              onClick={() => setSelectedTab("management")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Leaf className="h-4 w-4 mr-2" />
              Manajemen Kebun
            </Button>
          </div>

          {/* Tab Content */}
          {selectedTab === "analysis" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-green-600" />
                    Upload Foto Tanaman
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <div className="text-sm text-gray-600 mb-2">
                        Klik untuk upload foto daun atau tanaman
                      </div>
                      <Button variant="outline">Pilih File</Button>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  
                  {uploadedImage && (
                    <div className="text-sm text-gray-600">
                      File terpilih: {uploadedImage.name}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                    Hasil Analisis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysisResult ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Penyakit:</span>
                        <Badge variant="destructive">{analysisResult.disease}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Tingkat Keparahan:</span>
                        <Badge variant="outline">{analysisResult.severity}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Akurasi:</span>
                        <Badge variant="secondary">{analysisResult.confidence}%</Badge>
                      </div>
                      <div>
                        <span className="font-medium">Saran Penanganan:</span>
                        <p className="text-sm text-gray-600 mt-1">{analysisResult.treatment}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Upload foto untuk memulai analisis</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === "planning" && (
            <div className="space-y-6">
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Rekomendasi Tanaman
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {cropRecommendations.map((crop, index) => (
                      <Card key={index} className="border-purple-100">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-purple-800 mb-2">{crop.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{crop.reason}</p>
                          <div className="space-y-1 text-xs">
                            <p><strong>Waktu Tanam:</strong> {crop.plantingTime}</p>
                            <p><strong>Hasil:</strong> {crop.expectedYield}</p>
                            <p><strong>Keuntungan:</strong> {crop.profit}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Jadwal Tanam
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium">Cabai Merah</p>
                        <p className="text-sm text-gray-600">Siap untuk ditanam</p>
                      </div>
                      <Badge variant="outline" className="bg-orange-100">Minggu Depan</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Tomat</p>
                        <p className="text-sm text-gray-600">Perlu persiapan lahan</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100">2 Minggu</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === "management" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-emerald-600" />
                    Status Kebun
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Cabai Merah</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Sehat</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tomat</span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Perlu Perhatian</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Kangkung</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Sehat</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Aktivitas Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Pemupukan Cabai Merah</p>
                        <p className="text-xs text-gray-500">2 jam yang lalu</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Penyiraman Otomatis</p>
                        <p className="text-xs text-gray-500">4 jam yang lalu</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Analisis Tanaman</p>
                        <p className="text-xs text-gray-500">1 hari yang lalu</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FarmerTools; 