import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, AlertCircle, CheckCircle, Loader, Leaf, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface DiseaseDetail {
  common_names?: string[];
  description: string;
  treatment?: {
    prevention?: string[];
    chemical?: string[];
    biological?: string[];
  };
  url?: string;
  severity?: string;
}

interface Disease {
  name: string;
  probability: number;
  disease_details: DiseaseDetail;
}

interface CropHealthResponse {
  result: {
    is_healthy: {
      probability: number;
    };
    disease: {
      suggestions: Disease[];
    };
  };
}

const VisionAI = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cropHealthResult, setCropHealthResult] = useState<CropHealthResponse | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setCropHealthResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setCropHealthResult(null);

    try {
      const base64Image = selectedImage.split(',')[1];

      const { data, error } = await supabase.functions.invoke('crop-health-assistant', {
        body: { image: base64Image }
      });

      if (error || data.error) {
        throw new Error(data?.error?.message || error?.message || "Function invocation failed");
      }

      setCropHealthResult(data as CropHealthResponse);
      
      toast({
        title: "Analisis Selesai",
        description: "Hasil diagnosa dari crop.health telah tersedia.",
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Error Analisis",
        description: (error as Error).message || "Gagal menganalisis gambar dengan crop.health.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold mb-2">Diagnosa Penyakit Tanaman (crop.health)</h3>
        <p className="text-sm text-gray-600">Upload foto tanaman untuk dianalisis oleh crop.health API.</p>
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
                      <span>AI sedang menganalisis...</span>
                    </>
                  ) : (
                    <>
                      <Leaf className="h-4 w-4 mr-2" />
                      Analisis dengan crop.health
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
        {cropHealthResult && (
           <div className="space-y-4 mt-4">
            {(cropHealthResult.result.is_healthy.probability > 0.6) ? (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Tanaman Terlihat Sehat (crop.health)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Menurut analisis crop.health, tanaman ini dalam kondisi baik (keyakinan: {(cropHealthResult.result.is_healthy.probability * 100).toFixed(0)}%).</p>
                </CardContent>
              </Card>
            ) : (
              cropHealthResult.result.disease.suggestions.map((disease) => (
                <Card key={disease.name} className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-orange-700">
                      <Leaf className="h-5 w-5" />
                      Hasil Diagnosa (crop.health)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{disease.disease_details.common_names?.join(', ') || disease.name}</span>
                      <Badge variant="destructive">{(disease.probability * 100).toFixed(0)}% yakin</Badge>
                    </div>
                    {disease.disease_details.severity && <p className="text-sm text-yellow-700">Tingkat Keparahan: {disease.disease_details.severity}</p>}
                    <p className="text-sm text-gray-700">{disease.disease_details.description}</p>
                    
                    {disease.disease_details.treatment?.prevention && (
                      <div>
                        <h4 className="font-medium text-sm">Pencegahan:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {disease.disease_details.treatment.prevention.map((t: string) => <li key={t}>{t}</li>)}
                        </ul>
                      </div>
                    )}
                    {disease.disease_details.treatment?.chemical && (
                      <div>
                        <h4 className="font-medium text-sm">Penanganan Kimia:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {disease.disease_details.treatment.chemical.map((t: string) => <li key={t}>{t}</li>)}
                        </ul>
                      </div>
                    )}
                    {disease.disease_details.url && (
                        <a href={disease.disease_details.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                            <Info className="h-4 w-4"/> Selengkapnya
                        </a>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
           </div>
        )}
      </div>
    </div>
  );
};

export default VisionAI;
