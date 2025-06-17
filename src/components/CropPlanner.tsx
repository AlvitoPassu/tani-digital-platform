
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Cloud, MapPin, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CropPlanner = () => {
  const [formData, setFormData] = useState({
    location: '',
    landSize: '',
    soilType: '',
    season: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateRecommendations = async () => {
    if (!formData.location || !formData.landSize || !formData.soilType || !formData.season) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi semua data yang diperlukan",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulasi analisis AI
    setTimeout(() => {
      const mockRecommendations = {
        topCrops: [
          {
            name: "Jagung Hibrida",
            profit: 85,
            season: "Musim Kemarau",
            duration: "90-100 hari",
            investment: "Rp 8-12 juta/ha",
            expectedReturn: "Rp 20-25 juta/ha",
            marketTrend: "Naik 12% (5 tahun terakhir)",
            weatherSuitability: 92
          },
          {
            name: "Kedelai Edamame",
            profit: 78,
            season: "Musim Hujan",
            duration: "75-85 hari",
            investment: "Rp 6-9 juta/ha",
            expectedReturn: "Rp 15-20 juta/ha",
            marketTrend: "Naik 18% (ekspor meningkat)",
            weatherSuitability: 88
          },
          {
            name: "Cabai Rawit",
            profit: 72,
            season: "Sepanjang tahun",
            duration: "90-120 hari",
            investment: "Rp 15-20 juta/ha",
            expectedReturn: "Rp 35-45 juta/ha",
            marketTrend: "Stabil (permintaan tinggi)",
            weatherSuitability: 85
          }
        ],
        weatherForecast: {
          season: formData.season,
          rainfall: formData.season === 'musim-hujan' ? "250-300mm/bulan" : "50-100mm/bulan",
          temperature: "26-32°C",
          humidity: "70-85%",
          recommendation: formData.season === 'musim-hujan' 
            ? "Ideal untuk tanaman yang membutuhkan air tinggi"
            : "Cocok untuk tanaman tahan kering dengan irigasi"
        },
        soilAnalysis: {
          type: formData.soilType,
          suitability: formData.soilType === 'lempung' ? "Sangat baik" : "Baik",
          nutrients: "N: Sedang, P: Tinggi, K: Sedang",
          ph: "6.2 (optimal)",
          recommendations: [
            "Aplikasi pupuk organik 2 ton/ha",
            "Tambahkan kapur jika pH < 6.0",
            "Rotasi tanaman legum untuk nitrogen"
          ]
        }
      };

      setRecommendations(mockRecommendations);
      setIsAnalyzing(false);

      toast({
        title: "Analisis Selesai",
        description: "Rekomendasi penanaman telah dibuat berdasarkan data Anda",
      });
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold mb-2">AI Crop Planner</h3>
        <p className="text-sm text-gray-600">Rekomendasi penanaman berdasarkan cuaca, pasar, dan kondisi lahan</p>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Form Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Data Lahan & Lokasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  placeholder="e.g. Bogor, Jawa Barat"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landSize">Luas Lahan (ha)</Label>
                <Input
                  id="landSize"
                  type="number"
                  placeholder="e.g. 2"
                  value={formData.landSize}
                  onChange={(e) => handleInputChange('landSize', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jenis Tanah</Label>
                <Select onValueChange={(value) => handleInputChange('soilType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis tanah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lempung">Lempung</SelectItem>
                    <SelectItem value="liat">Liat</SelectItem>
                    <SelectItem value="pasir">Pasir</SelectItem>
                    <SelectItem value="gambut">Gambut</SelectItem>
                    <SelectItem value="humus">Humus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Musim Tanam</Label>
                <Select onValueChange={(value) => handleInputChange('season', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih musim tanam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="musim-hujan">Musim Hujan</SelectItem>
                    <SelectItem value="musim-kemarau">Musim Kemarau</SelectItem>
                    <SelectItem value="peralihan">Peralihan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={generateRecommendations}
              disabled={isAnalyzing}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menganalisis Data...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Buat Rekomendasi
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Recommendations */}
        {recommendations && (
          <div className="space-y-4">
            {/* Top Crop Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Rekomendasi Komoditas Terbaik
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.topCrops.map((crop: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-lg">{crop.name}</h4>
                      <div className="text-right">
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                          Profit Score: {crop.profit}/100
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Musim Optimal:</span> {crop.season}
                      </div>
                      <div>
                        <span className="font-medium">Durasi:</span> {crop.duration}
                      </div>
                      <div>
                        <span className="font-medium">Modal:</span> {crop.investment}
                      </div>
                      <div>
                        <span className="font-medium">Proyeksi Hasil:</span> {crop.expectedReturn}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Tren Pasar (5 tahun):</span>
                        <span className="text-green-600 font-medium">{crop.marketTrend}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Kesesuaian Cuaca:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{width: `${crop.weatherSuitability}%`}}
                            ></div>
                          </div>
                          <span className="text-green-600 font-medium">{crop.weatherSuitability}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weather Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-blue-600" />
                  Prediksi Cuaca & Iklim
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Curah Hujan:</span> {recommendations.weatherForecast.rainfall}</div>
                  <div><span className="font-medium">Suhu:</span> {recommendations.weatherForecast.temperature}</div>
                  <div><span className="font-medium">Kelembaban:</span> {recommendations.weatherForecast.humidity}</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">{recommendations.weatherForecast.recommendation}</p>
                </div>
              </CardContent>
            </Card>

            {/* Soil Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                  Analisis Tanah & Rekomendasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Jenis Tanah:</span> {recommendations.soilAnalysis.type}</div>
                  <div><span className="font-medium">Kesesuaian:</span> {recommendations.soilAnalysis.suitability}</div>
                  <div><span className="font-medium">Nutrisi:</span> {recommendations.soilAnalysis.nutrients}</div>
                  <div><span className="font-medium">pH:</span> {recommendations.soilAnalysis.ph}</div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Rekomendasi Perbaikan Tanah:</h4>
                  <ul className="space-y-1">
                    {recommendations.soilAnalysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPlanner;
