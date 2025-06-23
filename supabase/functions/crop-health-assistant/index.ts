import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cropHealthApiKey = Deno.env.get('CROP_HEALTH_API_KEY');

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
    if (!cropHealthApiKey) {
      return new Response(JSON.stringify({ error: 'API Key untuk crop.health belum diatur oleh administrator.' }), {
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

    // 3. Fetch from crop.health API
    const response = await fetch('https://api.kindwise.com/v1/crop-health', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Api-Key': cropHealthApiKey },
      body: JSON.stringify({
        images: [image],
        details: "common_names,description,treatment,url,eppo_code,severity",
        language: "id"
      }),
    });

    // 4. Handle non-200 responses from crop.health
    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage = `API crop.health merespons dengan error ${response.status}.`;
      
      try {
        const jsonData = JSON.parse(errorBody);
        errorMessage = jsonData.message || errorMessage;
      } catch (e) {
        // The error body was not JSON, use the raw text.
        errorMessage = `Error: ${errorBody || response.statusText}`;
      }
      
      console.error(`crop.health API error: ${errorMessage}`);
      // Return a specific error message to the client, but with a 200 OK status
      // so the frontend can parse it easily. The error is in the payload.
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 200, // Important: We send 200 OK
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 5. Success
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // This catches catastrophic errors, like network failures or invalid JSON in the request.
    console.error('Catastrophic error in function:', error);
    return new Response(JSON.stringify({ error: `Terjadi error internal di server: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}); 