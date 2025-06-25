import { useState } from "react";
import Navigation from "@/components/Navigation";
import ChatBot from "@/components/ChatBot";
import GeminiAssistant from "@/components/GeminiAssistant";
import VisionAI from "@/components/VisionAI";
import CropPlanner from "@/components/CropPlanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Camera, Calendar, Sparkles, Brain, Bot, Zap, Lightbulb, TrendingUp, Settings, FileText, Users, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { clearSupabaseSession } from '@/lib/utils';

const AIAssistantDashboard = () => {
  const { user, profile, clearInvalidSession } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("chat");
  const [aiStats] = useState({
    totalConversations: 1247,
    questionsAnswered: 8920,
    accuracy: 94.5,
    userSatisfaction: 4.8
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [aiFeatures] = useState([
    {
      name: "Chat Assistant",
      description: "Tanya jawab tentang pertanian",
      icon: MessageCircle,
      color: "blue",
      status: "active"
    },
    {
      name: "Vision AI",
      description: "Deteksi penyakit tanaman dari foto",
      icon: Camera,
      color: "green",
      status: "active"
    },
    {
      name: "Crop Planner",
      description: "Perencanaan tanam berdasarkan musim",
      icon: Calendar,
      color: "purple",
      status: "active"
    },
    {
      name: "Gemini Assistant",
      description: "AI canggih untuk analisis mendalam",
      icon: Brain,
      color: "orange",
      status: "beta"
    }
  ]);

  const handleSessionRefresh = async () => {
    setIsRefreshing(true);
    try {
      await clearInvalidSession();
      toast({
        title: "Session Diperbarui",
        description: "Silakan login kembali untuk melanjutkan.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui session.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleManualClear = () => {
    clearSupabaseSession();
    toast({
      title: "Session Dibersihkan",
      description: "Local storage telah dibersihkan. Silakan refresh halaman.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-16">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Halo, {profile?.name || 'User'}! 👋
              </h1>
              <p className="text-gray-600">Selamat datang di AI Assistant Hub - Pusat Kecerdasan Buatan untuk Pertanian</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Bot className="h-3 w-3 mr-1" />
                AI Assistant
              </Badge>
            </div>
          </div>
        </div>

        {/* Penjelasan Fitur AI Assistant */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Chat Assistant */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 flex flex-col gap-2 h-full">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-blue-800 text-lg">Chat Assistant</span>
              </div>
              <p className="text-sm text-blue-700">
                Konsultasi pertanian secara langsung dengan AI. Dapatkan jawaban cepat, akurat, dan relevan untuk semua pertanyaan seputar budidaya, hama, pupuk, dan teknologi pertanian.
              </p>
            </CardContent>
          </Card>
          {/* Vision AI */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 flex flex-col gap-2 h-full">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="h-6 w-6 text-green-600" />
                <span className="font-semibold text-green-800 text-lg">Vision AI</span>
              </div>
              <p className="text-sm text-green-700">
                Upload foto daun atau tanaman untuk deteksi otomatis penyakit, hama, dan masalah kesehatan tanaman. AI akan memberikan diagnosis dan rekomendasi penanganan.
              </p>
            </CardContent>
          </Card>
          {/* Crop Planner */}
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6 flex flex-col gap-2 h-full">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-6 w-6 text-purple-600" />
                <span className="font-semibold text-purple-800 text-lg">Crop Planner</span>
              </div>
              <p className="text-sm text-purple-700">
                Rencanakan jadwal tanam dan panen optimal berdasarkan musim, cuaca, dan kondisi lahan. Dapatkan rekomendasi tanaman terbaik untuk hasil maksimal.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Fitur AI Assistant */}
        <div className="space-y-8">
          {/* Chat Assistant */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Chat Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChatBot />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantDashboard; 