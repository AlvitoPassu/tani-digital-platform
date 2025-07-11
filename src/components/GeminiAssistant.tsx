import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, Loader, AlertCircle, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  id: string;
  type: 'user' | 'bot' | 'error';
  content: string;
  timestamp: Date;
}

const GeminiAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Halo! Saya AI Agri Assistant powered by Google Gemini. Saya siap membantu Anda dengan pertanyaan seputar pertanian Indonesia. Anda bisa bertanya tentang budidaya, pupuk, hama, manajemen kebun, atau teknologi pertanian terbaru.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const quickQuestions = [
    "Bagaimana cara budidaya hidroponik untuk pemula?",
    "Tips mengatasi hama wereng pada padi?",
    "Rekomendasi pupuk organik untuk sayuran?",
    "Cara meningkatkan hasil panen jagung?"
  ];

  const sendMessage = async (message: string) => {
    if (!message.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      console.log('Sending message to gemini-assistant function:', message);

      const { data, error } = await supabase.functions.invoke('gemini-assistant', {
        body: { 
          message: message,
          conversationHistory: conversationHistory
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Function invocation failed');
      }

      if (data.error) {
        console.error('Gemini API error:', data);
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'error',
          content: data.error,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, errorMessage]);
        
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      
      let errorText = 'Maaf, terjadi kesalahan saat memproses pesan Anda.';
      
      if (error.message.includes('Failed to fetch')) {
        errorText = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else if (error.message.includes('429')) {
        errorText = 'API sedang sibuk. Silakan tunggu beberapa menit dan coba lagi.';
      } else if (error.message.includes('401')) {
        errorText = 'API key tidak valid. Hubungi administrator.';
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: errorText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: errorText,
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Agri Assistant (Gemini)
        </h3>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => sendMessage(question)}
              disabled={isTyping}
            >
              {question.length > 30 ? question.substring(0, 30) + '...' : question}
            </Button>
          ))}
        </div>
      </div>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4 overflow-x-hidden">
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
                    : message.type === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : message.type === 'error' ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </div>
                <div className={`max-w-full w-fit break-words ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {message.type === 'error' ? (
                    <Alert variant="destructive">
                      <AlertDescription className="text-sm">
                        {message.content}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Card className={`max-w-full w-fit break-words ${
                      message.type === 'user'
                        ? 'bg-green-500 text-white'
                        : 'bg-white border-purple-200'
                    }`}>
                      <CardContent className="p-3">
                        <p className="text-sm whitespace-pre-line break-words">{message.content}</p>
                      </CardContent>
                    </Card>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-purple-100 text-purple-700">
                  <Sparkles className="h-4 w-4" />
                </div>
                <Card className="bg-white border-purple-200 max-w-full w-fit">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Gemini sedang berpikir...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanyakan seputar pertanian..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              onClick={() => sendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isTyping ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeminiAssistant;
