import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openWeatherApiKey = Deno.env.get('OPENWEATHER_API_KEY');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabaseUrl = 'https://kkxhaedaekxosbyzmjit.supabase.co';
const KINDWISE_API_KEY = '3V7h4q3u32IEUpCVOxNrcFkfIwW4yMZze6qHpmCG0rzk6rDMUn';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getSoilAnalysis = (soilType: string) => {
    switch (soilType) {
        case 'lempung': return { type: 'Lempung', ph: 6.5, suitability: 80, nutrients: { nitrogen: 'Sedang', phosphorus: 'Tinggi', potassium: 'Tinggi' }, recommendations: ['Baik untuk padi dan kedelai', 'Perhatikan drainase.'] };
        case 'liat': return { type: 'Liat', ph: 7.0, suitability: 70, nutrients: { nitrogen: 'Rendah', phosphorus: 'Sedang', potassium: 'Sangat Tinggi' }, recommendations: ['Struktur tanah kuat', 'Sulit diolah saat kering.'] };
        case 'pasir': return { type: 'Pasir', ph: 6.0, suitability: 50, nutrients: { nitrogen: 'Rendah', phosphorus: 'Rendah', potassium: 'Rendah' }, recommendations: ['Drainase sangat baik', 'Membutuhkan banyak pupuk organik.'] };
        case 'gambut': return { type: 'Gambut', ph: 4.5, suitability: 40, nutrients: { nitrogen: 'Sangat Tinggi', phosphorus: 'Rendah', potassium: 'Sedang' }, recommendations: ['Sangat asam', 'Perlu pengapuran (dolomit).'] };
        case 'humus': return { type: 'Humus', ph: 6.8, suitability: 95, nutrients: { nitrogen: 'Tinggi', phosphorus: 'Tinggi', potassium: 'Tinggi' }, recommendations: ['Tanah paling subur', 'Cocok untuk hampir semua tanaman.'] };
        default: return { type: 'Tidak Diketahui', ph: 0, suitability: 0, nutrients: { nitrogen: 'N/A', phosphorus: 'N/A', potassium: 'N/A' }, recommendations: ['Pilih jenis tanah.'] };
    }
};

async function getCropRecommendationsFromDB(avgTemp, totalRainfall, season, soilType) {
  const response = await fetch(`${supabaseUrl}/rest/v1/crops`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });
  const crops = await response.json();

  // Filter crops sesuai kondisi cuaca, musim, dan tanah
  return crops.filter(crop => {
    const seasonMatch = crop.suitable_season?.split(',').map(s => s.trim()).includes(season);
    const soilMatch = crop.soil_type?.split(',').map(s => s.trim()).includes(soilType);
    const tempMatch = (!crop.min_temp || avgTemp >= crop.min_temp) && (!crop.max_temp || avgTemp <= crop.max_temp);
    const rainMatch = (!crop.min_rainfall || totalRainfall >= crop.min_rainfall) && (!crop.max_rainfall || totalRainfall <= crop.max_rainfall);
    return seasonMatch && soilMatch && tempMatch && rainMatch;
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, season, soilType } = await req.json();
    if (!location || !season || !soilType) {
      throw new Error("Lokasi, musim, dan jenis tanah diperlukan.");
    }
    
    if (!openWeatherApiKey) {
      throw new Error("OpenWeather API key tidak diatur.");
    }

    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${openWeatherApiKey}&units=metric`);
    
    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json();
      const errorMessage = errorData.message || `Gagal mengambil data cuaca: ${weatherResponse.statusText}`;
      console.error('OpenWeather API Error:', errorMessage, 'Status:', weatherResponse.status);
      
      if (weatherResponse.status === 404) {
          throw new Error(`Lokasi \"${location}\" tidak dapat ditemukan. Mohon coba dengan nama kota atau daerah yang lebih umum.`);
      }
      if (weatherResponse.status === 401) {
          throw new Error('API Key OpenWeather tidak valid atau belum aktif. Silakan periksa kembali atau tunggu beberapa saat.');
      }
      throw new Error(errorMessage);
    }

    const weatherData = await weatherResponse.json();

    // Process weather data
    let totalRainfall = 0;
    let totalTemp = 0;
    weatherData.list.forEach((item) => {
      if (item.rain && item.rain['3h']) {
        totalRainfall += item.rain['3h'];
      }
      totalTemp += item.main.temp;
    });
    const avgTemp = totalTemp / weatherData.list.length;
    const avgHumidity = weatherData.list.reduce((acc, item) => acc + item.main.humidity, 0) / weatherData.list.length;

    const weatherForecast = {
      rainfall: `${totalRainfall.toFixed(2)} mm (5 hari)`,
      temperature: `${avgTemp.toFixed(2)} °C`,
      humidity: `${avgHumidity.toFixed(2)} %`,
      recommendation: avgTemp > 25 ? "Kondisi hangat, cocok untuk tanaman tropis." : "Suhu sedang, perhatikan kebutuhan air.",
    };
    
    // Ambil rekomendasi tanaman dari database
    const cropRecommendations = await getCropRecommendationsFromDB(avgTemp, totalRainfall, season, soilType);
    const soilAnalysis = getSoilAnalysis(soilType);

    const responsePayload = {
      topCrops: cropRecommendations,
      weatherForecast,
      soilAnalysis,
      kindwise: kindwiseData
    };
    
    const kindwiseResponse = await fetch('https://api.kindwise.com/v1/crop-health', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KINDWISE_API_KEY}`,
      },
      body: JSON.stringify({
        image_url: "https://example.com/image.jpg"
      }),
    });

    if (!kindwiseResponse.ok) {
      const errorText = await kindwiseResponse.text();
      throw new Error(`Kindwise API error: ${kindwiseResponse.status} - ${errorText}`);
    }

    const kindwiseData = await kindwiseResponse.json();

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
