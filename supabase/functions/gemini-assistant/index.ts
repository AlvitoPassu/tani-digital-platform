import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('JMDqwQIv5fk6T0BxXZEKDbcWMXieyZpzXdbb5k7oZWZ6XPBBfx');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define interfaces for better type safety
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  conversationHistory: ChatMessage[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] }: RequestBody = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required and must be a string.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!Array.isArray(conversationHistory)) {
      return new Response(JSON.stringify({ error: 'conversationHistory must be an array.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!geminiApiKey) {
      console.error('Gemini API key not found');
      return new Response(JSON.stringify({ 
        error: 'API key Gemini belum dikonfigurasi. Silakan hubungi administrator.',
        details: 'Missing Gemini API key' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Sending request to Gemini with message:', message.substring(0, 100));

    // Build conversation context for Gemini
    let conversationText = `Anda adalah AI Agri Assistant yang ahli dalam bidang pertanian Indonesia. Berikan jawaban yang praktis, spesifik untuk kondisi iklim dan tanah Indonesia.

Fokus pada:
- Budidaya tanaman lokal dan internasional
- Manajemen hama dan penyakit
- Pemupukan dan nutrisi tanaman
- Teknik irigasi dan pengairan
- Rotasi tanaman
- Analisis ekonomi pertanian
- Tips praktis untuk petani Indonesia

Gunakan bahasa Indonesia yang mudah dipahami dan berikan contoh konkret.

`;

    // Add conversation history
    conversationHistory.forEach((msg: ChatMessage) => {
      const sanitizedContent = msg.content.replace(/(\r\n|\n|\r)/gm, " ");
      if (msg.role === 'user') {
        conversationText += `Pengguna: ${sanitizedContent}\n`;
      } else {
        conversationText += `Assistant: ${sanitizedContent}\n`;
      }
    });

    conversationText += `Pengguna: ${message}\nAssistant: `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: conversationText
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error details:', errorData);
      
      let errorMessage = 'Terjadi kesalahan saat menghubungi AI assistant Gemini.';
      
      if (response.status === 429) {
        errorMessage = 'API Gemini sedang sibuk atau quota habis. Silakan coba lagi dalam beberapa menit.';
      } else if (response.status === 401) {
        errorMessage = 'API key Gemini tidak valid. Silakan hubungi administrator.';
      } else if (response.status === 400) {
        errorMessage = 'Format permintaan tidak valid. Silakan coba dengan pesan yang lebih sederhana.';
      } else if (response.status >= 500) {
        errorMessage = 'Server Gemini sedang mengalami masalah. Silakan coba lagi nanti.';
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage,
        details: `Gemini API error: ${response.status}`,
        status: response.status 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!botResponse) {
      console.error('Invalid response structure from Gemini API:', data);
      throw new Error('Invalid response format from Gemini API');
    }

    console.log('Successfully generated response from Gemini, length:', botResponse.length);

    return new Response(JSON.stringify({ 
      response: botResponse,
      usage: data.usageMetadata || {} 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-assistant function:', error);
    
    let errorMessage = 'Gagal memproses pesan Anda dengan Gemini AI.';
    
    if (error.message.includes('fetch')) {
      errorMessage = 'Tidak dapat terhubung ke server Gemini. Periksa koneksi internet.';
    } else if (error.message.includes('JSON')) {
      errorMessage = 'Format data tidak valid. Silakan coba lagi.';
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
