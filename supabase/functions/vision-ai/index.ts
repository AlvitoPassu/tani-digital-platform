
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
    const { image } = await req.json();

    if (!image) {
      throw new Error('No image data provided');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Anda adalah ahli diagnosis penyakit tanaman. Analisis gambar tanaman dan berikan respons dalam format JSON berikut:
            {
              "disease": "nama penyakit",
              "confidence": angka_kepercayaan_0_100,
              "severity": "Ringan|Sedang|Berat",
              "description": "deskripsi detail penyakit",
              "treatment": ["langkah pengobatan 1", "langkah pengobatan 2"],
              "prevention": ["langkah pencegahan 1", "langkah pencegahan 2"]
            }
            
            Jika tidak terdeteksi penyakit, gunakan "Sehat" untuk disease dan berikan tips perawatan.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analisis gambar tanaman ini dan identifikasi penyakit atau masalah yang ada.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;

    // Parse JSON response from OpenAI
    let analysisResult;
    try {
      analysisResult = JSON.parse(analysisText);
    } catch (e) {
      // Fallback if OpenAI doesn't return valid JSON
      analysisResult = {
        disease: "Tidak dapat diidentifikasi",
        confidence: 0,
        severity: "Tidak diketahui",
        description: analysisText,
        treatment: ["Konsultasi dengan ahli pertanian"],
        prevention: ["Perawatan rutin tanaman"]
      };
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in vision-ai function:', error);
    return new Response(JSON.stringify({ 
      error: 'Gagal menganalisis gambar',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
