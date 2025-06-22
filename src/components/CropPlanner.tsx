import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Cloud, MapPin, Loader, Sprout, Info, CloudRain, Thermometer, Wind, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CropRecommendation {
  name: string;
  suitability: string;
  reason: string;
}

interface SoilAnalysis {
  type: string;
  ph: number;
  suitability: number;
  nutrients: {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
  };
  recommendations: string[];
}

interface AnalysisRecommendation {
  topCrops: CropRecommendation[];
  weatherForecast: {
    rainfall: string;
    temperature: string;
    humidity: string;
    recommendation: string;
  };
  soilAnalysis: SoilAnalysis;
}

const CropPlanner = () => {
  const [formData, setFormData] = useState({
    location: '',
    landSize: '',
    soilType: '',
    season: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<AnalysisRecommendation | null>(null);
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

    try {
      const { data, error } = await supabase.functions.invoke('crop-planner', {
        body: formData
      });

      if (error) {
        throw new Error(error.message);
      }

      setRecommendations(data);

      toast({
        title: "Analisis Selesai",
        description: "Rekomendasi penanaman berdasarkan data cuaca telah dibuat.",
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Error",
        description: "Gagal membuat rekomendasi. Periksa kembali lokasi yang Anda masukkan.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold mb-2">AI Crop Planner (Weather-Based)</h3>
        <p className="text-sm text-gray-600">Rekomendasi penanaman berdasarkan analisis cuaca dari OpenWeatherMap</p>
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
                  disabled={isAnalyzing}
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
                  disabled={isAnalyzing}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jenis Tanah</Label>
                <Select onValueChange={(value) => handleInputChange('soilType', value)} disabled={isAnalyzing}>
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
                <Select onValueChange={(value) => handleInputChange('season', value)} disabled={isAnalyzing}>
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
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  AI sedang menganalisis data...
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
           <div className="space-y-6 pt-4">
            {/* 1. Main Recommendation Card */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <Sprout className="h-6 w-6" />
                  Rekomendasi Tanaman Unggulan
                </CardTitle>
                <p className="text-sm text-green-700 pt-1">Tanaman yang paling cocok berdasarkan analisis kondisi Anda.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.topCrops?.map((crop, index) => (
                  <div key={index} className="border bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-lg text-gray-800">{crop.name}</h4>
                      <Badge variant={crop.suitability.includes('Sangat') ? 'default' : 'secondary'} className="bg-green-600 text-white hover:bg-green-700">{crop.suitability}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 flex items-start gap-2">
                      <Info className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                      <span>{crop.reason}</span>
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 2. Detailed Analysis Cards (Weather and Soil) in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weather Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <Cloud className="h-6 w-6" />
                    Analisis Cuaca
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-600"><CloudRain className="h-4 w-4"/>Curah Hujan (5 hari)</span>
                    <span className="font-bold text-gray-800">{recommendations.weatherForecast.rainfall}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-600"><Thermometer className="h-4 w-4"/>Suhu Rata-rata</span>
                    <span className="font-bold text-gray-800">{recommendations.weatherForecast.temperature}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-600"><Wind className="h-4 w-4"/>Kelembaban</span>
                    <span className="font-bold text-gray-800">{recommendations.weatherForecast.humidity}</span>
                  </div>
                  <Separator className="my-3"/>
                  <p className="text-xs text-center text-gray-500 pt-1">{recommendations.weatherForecast.recommendation}</p>
                </CardContent>
              </Card>

              {/* Soil Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-orange-800">
                    <Layers className="h-6 w-6" />
                    Analisis Tanah
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                   <div className="flex items-center justify-between">
                    <span className="text-gray-600">Jenis Tanah</span>
                    <span className="font-bold text-gray-800">{recommendations.soilAnalysis.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">pH Tanah</span>
                    <span className="font-bold text-gray-800">{recommendations.soilAnalysis.ph}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Kesesuaian</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5">
                        <div className="bg-orange-500 h-2.5 rounded-full" style={{width: `${recommendations.soilAnalysis.suitability}%`}}></div>
                      </div>
                      <span className="font-bold text-gray-800">{recommendations.soilAnalysis.suitability}%</span>
                    </div>
                  </div>
                  <Separator className="my-3"/>
                   <div>
                    <h4 className="font-medium text-gray-700 mb-2">Rekomendasi Perawatan Tanah:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {recommendations.soilAnalysis.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPlanner;
