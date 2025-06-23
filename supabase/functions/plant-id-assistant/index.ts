import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const plantIdApiKey = Deno.env.get('PLANT_ID_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    // Check if API key is available
    if (!plantIdApiKey) {
      console.error('PLANT_ID_API_KEY is not set in Supabase secrets.');
      return new Response(JSON.stringify({ 
        error: 'API key not configured. Please contact administrator.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { image } = body;

    if (!image || typeof image !== 'string') {
      return new Response(JSON.stringify({ 
        error: 'No valid image data provided' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Defensive check: ensure the image is a base64 string, not a data URL
    if (image.startsWith('data:')) {
      return new Response(JSON.stringify({
        error: 'Invalid image format: received data URL instead of base64 string.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call Plant.id API
    const response = await fetch('https://plant.id/api/v3/health_assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': plantIdApiKey,
      },
      body: JSON.stringify({
        images: [image],
        details: "common_names,description,treatment,url",
      }),
    });

    if (!response.ok) {
      let errorMessage = `Plant.id API error: ${response.status}`;
      try {
        const errorData = await response.json();
        console.error('Plant.id API error details:', errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        console.error('Failed to parse Plant.id error response:', jsonError);
      }
      
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error in plant-id-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error. Please try again later.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}); 