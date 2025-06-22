import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openWeatherApiKey = Deno.env.get('OPENWEATHER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simplified logic for crop recommendations
const getCropRecommendations = (avgTemp: number, totalRainfall: number, season: string) => {
  const recommendations = [];
  if (avgTemp > 25 && totalRainfall > 50 && (season === 'musim-hujan' || season === 'peralihan')) {
    recommendations.push({ name: 'Padi', suitability: 'Sangat Cocok', reason: 'Suhu hangat dan curah hujan tinggi.' });
  }
  if (avgTemp > 20 && totalRainfall < 50 && (season === 'musim-kemarau' || season === 'peralihan')) {
    recommendations.push({ name: 'Jagung', suitability: 'Cocok', reason: 'Tahan di suhu hangat dengan sedikit hujan.' });
  }
  if (avgTemp > 22 && totalRainfall > 30) {
    recommendations.push({ name: 'Kedelai', suitability: 'Cukup Cocok', reason: 'Membutuhkan kehangatan dan kelembapan sedang.' });
  }
  if (season === 'musim-kemarau' && totalRainfall < 40) {
     recommendations.push({ name: 'Bawang Merah', suitability: 'Cocok', reason: 'Membutuhkan sinar matahari penuh dan tidak tergenang air.' });
  }
   if (avgTemp < 25 && season !== 'musim-kemarau') {
    recommendations.push({ name: 'Cabai', suitability: 'Cukup Cocok', reason: 'Suhu tidak terlalu panas dan cukup air.' });
  }

  return recommendations.length > 0 ? recommendations : [{ name: 'Belum ada rekomendasi', suitability: 'Kurang Cocok', reason: 'Kondisi cuaca saat ini kurang ideal untuk tanaman umum.' }];
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
          throw new Error(`Lokasi "${location}" tidak dapat ditemukan. Mohon coba dengan nama kota atau daerah yang lebih umum.`);
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
    weatherData.list.forEach((item: any) => {
      if (item.rain && item.rain['3h']) {
        totalRainfall += item.rain['3h'];
      }
      totalTemp += item.main.temp;
    });
    const avgTemp = totalTemp / weatherData.list.length;
    const avgHumidity = weatherData.list.reduce((acc: number, item: any) => acc + item.main.humidity, 0) / weatherData.list.length;

    const weatherForecast = {
      rainfall: `${totalRainfall.toFixed(2)} mm (5 hari)`,
      temperature: `${avgTemp.toFixed(2)} °C`,
      humidity: `${avgHumidity.toFixed(2)} %`,
      recommendation: avgTemp > 25 ? "Kondisi hangat, cocok untuk tanaman tropis." : "Suhu sedang, perhatikan kebutuhan air.",
    };
    
    const cropRecommendations = getCropRecommendations(avgTemp, totalRainfall, season);
    const soilAnalysis = getSoilAnalysis(soilType);

    const responsePayload = {
      topCrops: cropRecommendations,
      weatherForecast,
      soilAnalysis
    };
    
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
