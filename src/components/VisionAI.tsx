
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Camera, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    
    try {
      const { data, error } = await supabase.functions.invoke('vision-ai', {
        body: { image: selectedImage }
      });

      if (error) {
        throw new Error(error.message);
      }

      setAnalysisResult(data);
      
      toast({
        title: "Analisis Selesai",
        description: "Hasil diagnosa penyakit tanaman telah tersedia",
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Error",
        description: "Gagal menganalisis gambar. Pastikan API key OpenAI sudah dikonfigurasi.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
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
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Menganalisis dengan AI...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Analisis dengan OpenAI
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
            <Card className={`border-2 ${analysisResult.disease === 'Sehat' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`flex items-center gap-2 ${analysisResult.disease === 'Sehat' ? 'text-green-700' : 'text-red-700'}`}>
                  {analysisResult.disease === 'Sehat' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  Hasil Diagnosa AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{analysisResult.disease}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    analysisResult.disease === 'Sehat' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {analysisResult.confidence}% yakin
                  </span>
                </div>
                <p className="text-sm text-gray-700">{analysisResult.description}</p>
                {analysisResult.severity && analysisResult.disease !== 'Sehat' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Tingkat Keparahan:</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                      {analysisResult.severity}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {analysisResult.treatment && analysisResult.treatment.length > 0 && (
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
                  {analysisResult.prevention && analysisResult.prevention.length > 0 && (
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
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisionAI;
