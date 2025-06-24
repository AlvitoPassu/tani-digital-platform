import { Search, MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  onSubmit?: () => void;
}

const HeroSection = ({ searchQuery, setSearchQuery, searchInputRef, onSubmit }: HeroSectionProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };
  return (
    <section className="relative py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 border border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white rounded-full"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
            🌱 Platform Pertanian Digital #1 di Indonesia
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Wujudkan Impian
          <span className="block text-yellow-300">Pertanian Modern</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
          Temukan bibit unggul, pupuk berkualitas, dan alat pertanian terbaik untuk meningkatkan hasil panen Anda
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 bg-white/10 backdrop-blur-sm p-2 rounded-xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-5 w-5" />
              <Input
                placeholder="Cari bibit, pupuk, alat pertanian..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white text-gray-800 border-0 focus:ring-2 focus:ring-yellow-400"
                ref={searchInputRef}
              />
            </div>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-semibold px-8"
              type="submit"
            >
              Cari Sekarang
            </Button>
          </form>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-yellow-300" />
            </div>
            <div className="text-2xl font-bold mb-1">50,000+</div>
            <div className="text-green-200">Petani Bergabung</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="h-8 w-8 text-yellow-300" />
            </div>
            <div className="text-2xl font-bold mb-1">500+</div>
            <div className="text-green-200">Kota Terjangkau</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center justify-center mb-2">
              <Search className="h-8 w-8 text-yellow-300" />
            </div>
            <div className="text-2xl font-bold mb-1">10,000+</div>
            <div className="text-green-200">Produk Tersedia</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
