
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Camera, AlertCircle, CheckCircle, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VisionAI = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulasi analisis AI
    setTimeout(() => {
      const mockAnalysis = {
        disease: "Bercak Daun (Leaf Spot)",
        confidence: 89,
        severity: "Sedang",
        description: "Terdeteksi gejala bercak daun pada tanaman. Penyakit ini disebabkan oleh jamur Cercospora.",
        treatment: [
          "Semprot dengan fungisida berbahan aktif mankozeb",
          "Tingkatkan sirkulasi udara di sekitar tanaman",
          "Kurangi kelembaban dengan mengatur jarak tanam",
          "Buang daun yang terinfeksi dan musnahkan"
        ],
        prevention: [
          "Gunakan benih berkualitas dan tahan penyakit",
          "Rotasi tanaman setiap musim",
          "Jaga kebersihan lahan dari gulma",
          "Aplikasi pupuk berimbang untuk meningkatkan daya tahan"
        ]
      };
      
      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);
      
      toast({
        title: "Analisis Selesai",
        description: "Hasil diagnosa penyakit tanaman telah tersedia",
      });
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold mb-2">Diagnosa Penyakit Tanaman</h3>
        <p className="text-sm text-gray-600">Upload foto daun, batang, atau buah untuk analisis AI</p>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {/* Upload Area */}
        <Card className="border-dashed border-2 border-gray-300 hover:border-green-500 transition-colors">
          <CardContent className="p-6 text-center">
            {selectedImage ? (
              <div className="space-y-4">
                <img 
                  src={selectedImage} 
                  alt="Uploaded plant" 
                  className="max-h-48 mx-auto rounded-lg shadow-md"
                />
                <Button 
                  onClick={analyzeImage} 
                  disabled={isAnalyzing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menganalisis...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Analisis Gambar
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Pilih foto tanaman untuk dianalisis</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Foto
                    </span>
                  </Button>
                </label>
              </>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-4">
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  Diagnosa Penyakit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{analysisResult.disease}</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                    {analysisResult.confidence}% yakin
                  </span>
                </div>
                <p className="text-sm text-gray-700">{analysisResult.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Tingkat Keparahan:</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                    {analysisResult.severity}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Rekomendasi Penanganan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Pengobatan:</h4>
                  <ul className="space-y-1">
                    {analysisResult.treatment.map((item: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Pencegahan:</h4>
                  <ul className="space-y-1">
                    {analysisResult.prevention.map((item: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        {item}
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

export default VisionAI;
