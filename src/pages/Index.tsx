import { useState, useRef } from "react";
import { Search, ShoppingCart, User, Bell, Menu, Leaf, Truck, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
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
        <CategorySection selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        {/* Filter Bar */}
        <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row gap-4 items-center px-4">
          {/* Filter Harga */}
          <div className="flex items-center gap-2">
            <span className="font-medium">Harga:</span>
            <input
              type="number"
              min={0}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-20 px-2 py-1 border rounded"
              placeholder="Min"
            />
            <span>-</span>
            <input
              type="number"
              min={priceRange[0]}
              max={2000000}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-20 px-2 py-1 border rounded"
              placeholder="Max"
            />
          </div>
          {/* Filter Lokasi */}
          <div className="flex items-center gap-2">
            <span className="font-medium">Lokasi:</span>
            <select
              value={selectedLocation || "Semua"}
              onChange={e => setSelectedLocation(e.target.value === "Semua" ? null : e.target.value)}
              className="px-2 py-1 border rounded"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          {/* Reset Filter Button */}
          <button
            className="ml-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold"
            onClick={resetFilter}
            type="button"
          >
            Reset Filter
          </button>
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
