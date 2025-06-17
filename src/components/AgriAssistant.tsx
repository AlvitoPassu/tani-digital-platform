
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, Leaf } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const AgriAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Halo! Saya AI Agri Assistant. Saya siap membantu Anda dengan pertanyaan seputar pertanian. Anda bisa bertanya tentang budidaya, pupuk, hama, atau manajemen kebun.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    "Bagaimana cara menanam kelapa sawit di tanah gambut?",
    "Apa pupuk terbaik untuk durian musang king?",
    "Bagaimana mengelola kebun jagung 2 hektar?",
    "Tips mencegah hama pada tanaman padi"
  ];

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulasi respons AI
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const generateBotResponse = (question: string): string => {
    const lowercaseQuestion = question.toLowerCase();
    
    if (lowercaseQuestion.includes('kelapa sawit') && lowercaseQuestion.includes('gambut')) {
      return `Untuk menanam kelapa sawit di tanah gambut:

🌱 **Persiapan Lahan:**
- Buat drainase yang baik untuk mengontrol air
- Aplikasi kapur dolomit 2-3 ton/ha
- Campur bahan organik seperti kompos

🌿 **Penanaman:**
- Pilih bibit unggul yang tahan gambut
- Buat lubang tanam 60x60x60 cm
- Campurkan tanah mineral dengan gambut (1:1)

💧 **Pemeliharaan:**
- Atur sistem irigasi tetes
- Pupuk NPK sesuai umur tanaman
- Monitor pH tanah (target 5.5-6.5)

Apakah ada aspek tertentu yang ingin Anda tanyakan lebih detail?`;
    }
    
    if (lowercaseQuestion.includes('pupuk') && lowercaseQuestion.includes('durian')) {
      return `Rekomendasi pupuk untuk durian musang king:

🥥 **Pupuk Organik (Utama):**
- Kompos matang: 20-30 kg/pohon/tahun
- Pupuk kandang: 15-20 kg/pohon/tahun
- Aplikasi setiap 3-4 bulan

⚗️ **Pupuk Kimia:**
- NPK 15:15:15 = 2-3 kg/pohon/tahun
- Urea: 1 kg/pohon/tahun (2-3 kali aplikasi)
- KCl: 1.5 kg/pohon/tahun

🍃 **Pupuk Tambahan:**
- Kalsium: 500g/pohon (untuk kualitas buah)
- Magnesium: 300g/pohon (untuk fotosintesis)
- Mikronutrient chelate setiap 2 bulan

**Waktu aplikasi terbaik:** Awal musim hujan dan setelah panen.`;
    }

    if (lowercaseQuestion.includes('jagung') && lowercaseQuestion.includes('hektar')) {
      return `Manajemen kebun jagung 2 hektar:

📋 **Perencanaan:**
- Bagi lahan menjadi 4 blok (0.5 ha/blok)
- Rotasi penanaman untuk sustainabilitas
- Rencanakan sistem irigasi

🌾 **Budidaya:**
- Jarak tanam: 75 x 25 cm (53.000 tanaman/ha)
- Benih: 20-25 kg/ha (varietas hibrida)
- Kebutuhan pupuk: NPK 300kg + Urea 200kg/ha

🚜 **Manajemen Operasional:**
- 1 traktor kecil untuk pengolahan tanah
- 2-3 pekerja tetap untuk pemeliharaan
- Sistem penyimpanan hasil panen

💰 **Estimasi Biaya:**
- Modal awal: Rp 15-20 juta/ha
- Target produksi: 8-10 ton/ha
- ROI: 40-60% (kondisi normal)`;
    }

    // Default response
    return `Terima kasih atas pertanyaan Anda tentang "${question}".

Sebagai AI Agri Assistant, saya dapat membantu dengan:
- Tips budidaya tanaman
- Rekomendasi pupuk dan pestisida
- Manajemen hama dan penyakit
- Perencanaan kebun dan lahan
- Analisis komoditas pertanian

Untuk memberikan jawaban yang lebih spesifik, bisa Anda jelaskan:
- Jenis tanaman yang dimaksud?
- Kondisi lahan (luas, jenis tanah)?
- Lokasi geografis?
- Target yang ingin dicapai?

Silakan ajukan pertanyaan yang lebih detail!`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold mb-2">AI Agri Assistant</h3>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => sendMessage(question)}
            >
              {question.length > 30 ? question.substring(0, 30) + '...' : question}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`p-2 rounded-full ${
                message.type === 'user' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div className={`max-w-[80%] ${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}>
                <Card className={`${
                  message.type === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-white border-gray-200'
                }`}>
                  <CardContent className="p-3">
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </CardContent>
                </Card>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-700">
                <Bot className="h-4 w-4" />
              </div>
              <Card className="bg-white border-gray-200">
                <CardContent className="p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Tanyakan seputar pertanian..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
            className="flex-1"
          />
          <Button 
            onClick={() => sendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgriAssistant;
