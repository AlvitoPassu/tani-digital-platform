import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, AlertCircle, CheckCircle, Loader, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface DiagnosisResult {
  nama_penyakit: string;
  gejala: string;
  saran_penanganan: string;
}

const VisionAI = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState(false);
  const [deploymentError, setDeploymentError] = useState(false);
  const { toast } = useToast();
  const { clearInvalidSession } = useAuth();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setDiagnosis(null);
        setInfo(null);
        setSessionError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSessionRefresh = async () => {
    setSessionError(false);
    await clearInvalidSession();
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setDiagnosis(null);
    setInfo(null);
    try {
      // Get current session for authorization
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setSessionError(true);
        toast({
          title: "Error Session",
          description: "Session tidak valid. Silakan login kembali.",
          variant: "destructive"
        });
        await clearInvalidSession();
        return;
      }

      const base64Image = selectedImage.split(',')[1];
      
      if (!base64Image) {
        toast({ title: "Error", description: "Gambar tidak valid atau gagal dibaca." });
        setIsAnalyzing(false);
        return;
      }
      
      console.log('Base64 image:', base64Image);
      
      // Prepare headers with authorization
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtreGhhZWRhZWt4b3NieXptaXQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc0OTcxNjYxMSwiZXhwIjoyMDY1MjkyNjExfQ.zwPlGGB-_lODoO_SbubdZezWFTrBGAcGi6BiFFydG28',
        'x-client-info': 'supabase-js/2.38.0'
      };

      const response = await fetch('https://kkxhaedaekxosbyzmjit.supabase.co/functions/v1/openai-vision-assistant', {
        method: 'POST',
        headers,
        body: JSON.stringify({ image: `data:image/jpeg;base64,${base64Image}` })
      });
      
      if (response.status === 401) {
        // Try alternative method using supabase client
        console.log('Trying alternative method with supabase client...');
        const { data: functionData, error: functionError } = await supabase.functions.invoke('openai-vision-assistant', {
          body: { image: `data:image/jpeg;base64,${base64Image}` }
        });
        
        if (functionError) {
          console.error('Function error:', functionError);
          setSessionError(true);
          toast({
            title: "Error Autentikasi",
            description: "Session Anda telah berakhir. Silakan login kembali.",
            variant: "destructive"
          });
          await clearInvalidSession();
          return;
        }
        
        if (functionData?.result) {
          setDiagnosis(functionData.result);
          toast({ title: "Analisis Selesai", description: "Diagnosis dari Vision AI telah tersedia." });
        } else if (functionData?.info) {
          setInfo(functionData.info);
          toast({ title: "Info", description: functionData.info });
        } else {
          setInfo('Tidak ada hasil yang dapat ditampilkan.');
        }
        return;
      }
      
      const data = await response.json();
      if (data?.result) {
        setDiagnosis(data.result);
        toast({ title: "Analisis Selesai", description: "Diagnosis dari Vision AI telah tersedia." });
      } else if (data?.info) {
        setInfo(data.info);
        toast({ title: "Info", description: data.info });
      } else {
        setInfo('Tidak ada hasil yang dapat ditampilkan.');
      }
    } catch (error) {
      console.error('Vision AI error:', error);
      
      // Handle deployment errors
      if (error instanceof Error && error.message.includes('Missing authorization header')) {
        setDeploymentError(true);
        toast({
          title: "Function Belum Deploy",
          description: "Vision AI function belum di-deploy ke Supabase. Silakan deploy terlebih dahulu.",
          variant: "destructive"
        });
        return;
      }
      
      // Handle refresh token errors
      if (error instanceof Error && (
        error.message.includes('Invalid Refresh Token') || 
        error.message.includes('Refresh Token Not Found')
      )) {
        setSessionError(true);
        toast({
          title: "Error Session",
          description: "Session Anda telah berakhir. Silakan login kembali.",
          variant: "destructive"
        });
        await clearInvalidSession();
        return;
      }
      
      toast({
        title: "Error Analisis",
        description: (error as Error).message || "Gagal menganalisis gambar dengan Vision AI.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold mb-2">Diagnosa Penyakit Tanaman (Vision AI OpenAI)</h3>
        <p className="text-sm text-gray-600">Upload foto tanaman untuk didiagnosis oleh AI berbasis OpenAI Vision.</p>
        {sessionError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 mb-2">
              ⚠️ Ada masalah dengan session Anda. Klik tombol di bawah untuk memperbaiki:
            </p>
            <Button 
              onClick={handleSessionRefresh}
              size="sm"
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Perbaiki Session
            </Button>
          </div>
        )}
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
                      Analisis dengan Vision AI
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
        {diagnosis && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                Diagnosis Penyakit Tanaman
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-semibold">Nama Penyakit:</span>
                <span className="ml-2">{diagnosis.nama_penyakit}</span>
              </div>
              <div>
                <span className="font-semibold">Gejala:</span>
                <span className="ml-2">{diagnosis.gejala}</span>
              </div>
              <div>
                <span className="font-semibold">Saran Penanganan:</span>
                <span className="ml-2">{diagnosis.saran_penanganan}</span>
              </div>
            </CardContent>
          </Card>
        )}
        {info && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertCircle className="h-5 w-5" />
                Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{info}</p>
            </CardContent>
          </Card>
        )}
        {sessionError && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                Error Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-red-700">
                Session Anda telah berakhir. Silakan login kembali untuk menggunakan Vision AI.
              </p>
              <Button 
                onClick={handleSessionRefresh}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Refresh Session
              </Button>
            </CardContent>
          </Card>
        )}
        {deploymentError && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <AlertCircle className="h-5 w-5" />
                Function Belum Deploy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-yellow-700">
                Vision AI function belum di-deploy ke Supabase. Untuk menggunakan fitur ini, Anda perlu:
              </p>
              <div className="text-sm text-yellow-600 space-y-1">
                <p>1. Install Supabase CLI</p>
                <p>2. Login ke Supabase</p>
                <p>3. Deploy function dengan perintah:</p>
                <code className="bg-yellow-100 px-2 py-1 rounded text-xs">
                  supabase functions deploy openai-vision-assistant
                </code>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VisionAI;
