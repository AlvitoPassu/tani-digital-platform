
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!message) {
      throw new Error('No message provided');
    }

    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ 
        error: 'API key OpenAI belum dikonfigurasi. Silakan hubungi administrator.',
        details: 'Missing OpenAI API key' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Sending request to OpenAI with message:', message.substring(0, 100));

    const messages = [
      {
        role: 'system',
        content: `Anda adalah AI Agri Assistant yang ahli dalam bidang pertanian Indonesia. Berikan jawaban yang praktis, spesifik untuk kondisi iklim dan tanah Indonesia. 

        Fokus pada:
        - Budidaya tanaman lokal dan internasional
        - Manajemen hama dan penyakit
        - Pemupukan dan nutrisi tanaman
        - Teknik irigasi dan pengairan
        - Rotasi tanaman
        - Analisis ekonomi pertanian
        - Tips praktis untuk petani Indonesia

        Gunakan bahasa Indonesia yang mudah dipahami dan berikan contoh konkret.`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1500,
        temperature: 0.7,
        frequency_penalty: 0.3,
        presence_penalty: 0.3
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error details:', errorData);
      
      let errorMessage = 'Terjadi kesalahan saat menghubungi AI assistant.';
      
      if (response.status === 429) {
        errorMessage = 'API OpenAI sedang sibuk atau quota habis. Silakan coba lagi dalam beberapa menit.';
      } else if (response.status === 401) {
        errorMessage = 'API key OpenAI tidak valid. Silakan hubungi administrator.';
      } else if (response.status === 400) {
        errorMessage = 'Format permintaan tidak valid. Silakan coba dengan pesan yang lebih sederhana.';
      } else if (response.status >= 500) {
        errorMessage = 'Server OpenAI sedang mengalami masalah. Silakan coba lagi nanti.';
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage,
        details: `OpenAI API error: ${response.status}`,
        status: response.status 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    console.log('Successfully generated response, length:', botResponse.length);

    return new Response(JSON.stringify({ 
      response: botResponse,
      usage: data.usage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-assistant function:', error);
    
    let errorMessage = 'Gagal memproses pesan Anda.';
    
    if (error.message.includes('fetch')) {
      errorMessage = 'Tidak dapat terhubung ke server OpenAI. Periksa koneksi internet.';
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
