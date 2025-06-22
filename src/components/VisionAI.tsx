import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, AlertCircle, CheckCircle, Loader, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DiseaseDetail {
  common_names?: string[];
  description: string;
  treatment?: {
    prevention?: string[];
    chemical?: string[];
    biological?: string[];
  };
}

interface Disease {
  name: string;
  probability: number;
  disease_details: DiseaseDetail;
}

interface PlantIdResponse {
  health_assessment?: {
    is_healthy: boolean;
    diseases: Disease[];
  };
}

const VisionAI = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [plantIdResult, setPlantIdResult] = useState<PlantIdResponse | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setPlantIdResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setPlantIdResult(null);

    try {
      // The Plant.id API expects a pure base64 string, not a data URL.
      // We need to strip the metadata from the beginning of the string.
      const base64Image = selectedImage.split(',')[1];

      const { data, error } = await supabase.functions.invoke('plant-id-assistant', {
        body: { image: base64Image }
      });

      if (error) {
        console.error('Error analyzing image with Plant.id:', { error, data });
        
        // Check for rate-limiting error (429)
        if (data?.error && /429/.test(data.error)) {
           toast({
            title: "Batas Penggunaan API Tercapai",
            description: "Anda telah mencapai batas penggunaan gratis Plant.id. Coba lagi besok.",
            variant: "destructive",
          });
        } else {
          // Display other errors returned from the function
          toast({
            title: "Error",
            description: data?.error || error.message || "Gagal menganalisis gambar.",
            variant: "destructive"
          });
        }
        return;
      }

      setPlantIdResult(data as PlantIdResponse);
      
      toast({
        title: "Analisis Selesai",
        description: "Hasil diagnosa dari Plant.id telah tersedia",
      });
    } catch (error) {
      console.error('Error analyzing image with Plant.id:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan tak terduga saat mencoba menganalisis gambar.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold mb-2">Diagnosa Penyakit Tanaman dengan AI</h3>
        <p className="text-sm text-gray-600">Upload foto tanaman untuk dianalisis oleh Plant.id API</p>
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
                      Analisis dengan Plant.id
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
        {plantIdResult && (
           <div className="space-y-4 mt-4">
            {plantIdResult.health_assessment?.is_healthy ? (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Tanaman Terlihat Sehat (Plant.id)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Menurut analisis Plant.id, tanaman ini dalam kondisi baik.</p>
                </CardContent>
              </Card>
            ) : (
              plantIdResult.health_assessment?.diseases.map((disease) => (
                <Card key={disease.name} className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-orange-700">
                      <Leaf className="h-5 w-5" />
                      Hasil Diagnosa (Plant.id)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{disease.disease_details.common_names?.join(', ') || disease.name}</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                        {(disease.probability * 100).toFixed(0)}% yakin
                      </span>
                    </div>
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
                      {disease.disease_details.treatment?.biological && (
                      <div>
                        <h4 className="font-medium text-sm">Penanganan Biologis:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {disease.disease_details.treatment.biological.map((t: string) => <li key={t}>{t}</li>)}
                        </ul>
                      </div>
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
