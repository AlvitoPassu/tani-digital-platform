import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Validate API Key
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'API Key untuk OpenAI belum diatur oleh administrator.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Validate Request Body
    const { image } = await req.json();
    if (!image) {
      return new Response(JSON.stringify({ error: 'Tidak ada data gambar yang diberikan.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Prepare OpenAI Vision API request
    const prompt = `Gambar berikut adalah foto tanaman. Diagnosa penyakit utama pada tanaman ini (jika ada), lalu berikan hasil dalam format JSON persis seperti ini (gunakan tanda kutip ganda): {\n  \"nama_penyakit\": \"...\",\n  \"gejala\": \"...\",\n  \"saran_penanganan\": \"...\"\n}\nJika gambar bukan tanaman atau tidak ada penyakit, jawab hanya dengan: \"Maaf, Vision AI hanya mendiagnosis penyakit pada tanaman.\"`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Anda adalah Vision AI untuk mendiagnosis penyakit tanaman berdasarkan gambar. Jawab dalam bahasa Indonesia."
          },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ],
        max_tokens: 800
      })
    });

    if (!openaiRes.ok) {
      const errorBody = await openaiRes.text();
      return new Response(JSON.stringify({ error: errorBody }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openaiData = await openaiRes.json();
    const content = openaiData.choices?.[0]?.message?.content?.trim();
    console.log('OpenAI raw response:', content);

    // 4. Parse response: if JSON, return as object; if feedback, return as error/info
    let result;
    try {
      result = JSON.parse(content);
      // If result is an object with nama_penyakit, gejala, saran_penanganan
      return new Response(JSON.stringify({ result }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (e) {
      // Not JSON, probably feedback string
      return new Response(JSON.stringify({ info: content }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: `Terjadi error internal di server: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}); 