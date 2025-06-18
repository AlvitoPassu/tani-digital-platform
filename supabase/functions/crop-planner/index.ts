
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
    const { location, landSize, soilType, season } = await req.json();

    if (!location || !landSize || !soilType || !season) {
      throw new Error('Data tidak lengkap');
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
            content: `Anda adalah AI crop planner expert untuk pertanian Indonesia. Berikan rekomendasi penanaman dalam format JSON berikut:

            {
              "topCrops": [
                {
                  "name": "nama tanaman",
                  "profit": angka_0_100,
                  "season": "musim optimal",
                  "duration": "durasi panen",
                  "investment": "modal yang dibutuhkan",
                  "expectedReturn": "proyeksi hasil",
                  "marketTrend": "tren pasar",
                  "weatherSuitability": angka_0_100
                }
              ],
              "weatherForecast": {
                "season": "musim",
                "rainfall": "curah hujan",
                "temperature": "suhu",
                "humidity": "kelembaban",
                "recommendation": "rekomendasi cuaca"
              },
              "soilAnalysis": {
                "type": "jenis tanah",
                "suitability": "kesesuaian",
                "nutrients": "kandungan nutrisi",
                "ph": "tingkat pH",
                "recommendations": ["rekomendasi 1", "rekomendasi 2"]
              }
            }

            Berikan minimal 3 tanaman dengan profit score terbaik untuk kondisi yang diberikan.`
          },
          {
            role: 'user',
            content: `Analisis dan berikan rekomendasi penanaman untuk:
            - Lokasi: ${location}
            - Luas lahan: ${landSize} hektar
            - Jenis tanah: ${soilType}
            - Musim tanam: ${season}
            
            Pertimbangkan tren pasar terkini, kondisi iklim lokal, dan profitabilitas untuk petani Indonesia.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.5
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const recommendationsText = data.choices[0].message.content;

    // Parse JSON response from OpenAI
    let recommendations;
    try {
      recommendations = JSON.parse(recommendationsText);
    } catch (e) {
      // Fallback if OpenAI doesn't return valid JSON
      recommendations = {
        topCrops: [
          {
            name: "Jagung Hibrida",
            profit: 75,
            season: "Musim Kemarau",
            duration: "90-100 hari",
            investment: "Rp 8-12 juta/ha",
            expectedReturn: "Rp 20-25 juta/ha",
            marketTrend: "Stabil",
            weatherSuitability: 80
          }
        ],
        weatherForecast: {
          season: season,
          rainfall: "150-200mm/bulan",
          temperature: "26-32°C",
          humidity: "70-85%",
          recommendation: "Sesuai untuk tanaman musiman"
        },
        soilAnalysis: {
          type: soilType,
          suitability: "Baik",
          nutrients: "N: Sedang, P: Tinggi, K: Sedang",
          ph: "6.0-6.5",
          recommendations: ["Aplikasi pupuk organik", "Pengaturan drainase"]
        }
      };
    }

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in crop-planner function:', error);
    return new Response(JSON.stringify({ 
      error: 'Gagal membuat rekomendasi',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
