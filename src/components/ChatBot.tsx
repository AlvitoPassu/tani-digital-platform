import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, MessageCircle, TrendingUp, Sparkles } from "lucide-react";
import VisionAI from "./VisionAI";
import GeminiAssistant from "./GeminiAssistant";
import CropPlanner from "./CropPlanner";

const ChatBot = () => {
  const [activeTab, setActiveTab] = useState("gemini");

  return (
    <Card className="h-[600px] shadow-xl border-gray-200 pb-12">
      <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-green-600" />
          AI Agricultural Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
            <TabsTrigger value="vision" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Vision AI
            </TabsTrigger>
            <TabsTrigger value="gemini" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Gemini Chat
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Crop Planner
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="vision" className="h-full m-0">
              <VisionAI />
            </TabsContent>
            
            <TabsContent value="gemini" className="h-full m-0">
              <GeminiAssistant />
            </TabsContent>
            
            <TabsContent value="planner" className="h-full m-0">
              <CropPlanner />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
