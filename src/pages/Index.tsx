import { useState, useRef } from "react";
import { Search, ShoppingCart, User, Bell, Menu, Leaf, Truck, Shield, Star, MapPin, BadgeDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import StatsSection from "@/components/StatsSection";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const locations = [
    "Semua", "Jakarta Barat", "Bandung", "Surabaya", "Yogyakarta", "Malang", "Semarang"
  ];
  const searchInputRef = useRef<HTMLInputElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const resetFilter = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceRange([0, 2000000]);
    setSelectedLocation(null);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const scrollToProducts = () => {
    setTimeout(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      productsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <main className="pt-16">
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchInputRef={searchInputRef}
          onSubmit={handleSearchSubmit}
        />
        <StatsSection />

        {/* Filter Bar */}
        <div className="max-w-6xl mx-auto mb-8 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-end gap-6 border border-gray-200">
            {/* Filter Harga */}
            <div className="flex flex-col w-full md:w-1/3">
              <label className="text-xs font-bold text-gray-600 mb-1" htmlFor="min-price">Harga</label>
              <div className="flex items-center gap-2 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <BadgeDollarSign className="h-4 w-4" />
                </span>
                <input
                  id="min-price"
                  type="number"
                  min={0}
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-28 pl-9 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 text-base"
                  placeholder="Min"
                />
                <span className="text-gray-400 font-bold">-</span>
                <input
                  id="max-price"
                  type="number"
                  min={priceRange[0]}
                  max={2000000}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-28 pl-9 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 text-base"
                  placeholder="Maks"
                />
              </div>
            </div>
            {/* Filter Lokasi */}
            <div className="flex flex-col w-full md:w-1/3">
              <label className="text-xs font-bold text-gray-600 mb-1" htmlFor="location">Lokasi</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <MapPin className="h-4 w-4" />
                </span>
                <select
                  id="location"
                  value={selectedLocation || "Semua"}
                  onChange={e => setSelectedLocation(e.target.value === "Semua" ? null : e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 text-base appearance-none"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Reset Filter Button */}
            <div className="flex-1 flex md:justify-end items-end mt-4 md:mt-0">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-bold shadow transition text-base"
                onClick={resetFilter}
                type="button"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* Produk Section dengan ref */}
        <div ref={productsRef}>
          <FeaturedProducts
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            priceRange={priceRange}
            selectedLocation={selectedLocation}
          />
        </div>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Mengapa Memilih AgroMart?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-all duration-300 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Produk Berkualitas</h3>
                  <p className="text-gray-600">Semua produk telah melalui quality control dan berasal dari supplier terpercaya</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Pengiriman Cepat</h3>
                  <p className="text-gray-600">Jaringan distribusi luas dengan pengiriman ke seluruh Indonesia</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Transaksi Aman</h3>
                  <p className="text-gray-600">Sistem pembayaran yang aman dengan berbagai metode pembayaran</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-green-800 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Leaf className="h-8 w-8 text-green-400" />
                  <span className="text-2xl font-bold">AgroMart</span>
                </div>
                <p className="text-green-200">Platform digital untuk memajukan sektor pertanian Indonesia</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Kategori</h3>
                <ul className="space-y-2 text-green-200">
                  <li>Bibit & Benih</li>
                  <li>Pupuk & Pestisida</li>
                  <li>Alat Pertanian</li>
                  <li>Hasil Panen</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Layanan</h3>
                <ul className="space-y-2 text-green-200">
                  <li>Konsultasi Gratis</li>
                  <li>Pengiriman Express</li>
                  <li>Garansi Produk</li>
                  <li>Customer Support</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Kontak</h3>
                <ul className="space-y-2 text-green-200">
                  <li>📞 0800-1234-5678</li>
                  <li>📧 info@agromart.id</li>
                  <li>📍 Jakarta, Indonesia</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-300">
              <p>&copy; 2024 AgroMart. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
