
import { useState } from "react";
import Navigation from "@/components/Navigation";
import ChatBot from "@/components/ChatBot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, MessageCircle, Calendar, TrendingUp } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Agricultural Assistant</h1>
            <p className="text-gray-600">Asisten cerdas untuk membantu aktivitas pertanian Anda</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Feature Cards */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="hover:shadow-lg transition-all duration-300 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Camera className="h-5 w-5 text-green-600" />
                    Vision AI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Analisis penyakit tanaman dan hama melalui foto
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Deteksi penyakit otomatis</li>
                    <li>• Diagnosis dan saran penanganan</li>
                    <li>• Analisis kesuburan tanaman</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    Agri Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Chatbot untuk konsultasi pertanian
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Tips budidaya tanaman</li>
                    <li>• Rekomendasi pupuk</li>
                    <li>• Manajemen kebun</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-yellow-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-yellow-600" />
                    Crop Planner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Rekomendasi penanaman berbasis AI
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Analisis tren pasar</li>
                    <li>• Prediksi cuaca</li>
                    <li>• Rekomendasi komoditas</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <ChatBot />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
