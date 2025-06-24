import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Filter, X, Star, MapPin, ShoppingCart, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock_quantity: number;
  unit: string;
  category_id: number;
  seller_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  // Additional fields for display
  rating?: number;
  reviews?: number;
  seller?: string;
  location?: string;
  badge?: string;
  isDiscount?: boolean;
  originalPrice?: number;
}

interface SearchFilters {
  category: string | null;
  priceRange: [number, number];
  location: string | null;
  rating: number | null;
  inStock: boolean;
  sortBy: string;
}

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: null,
    priceRange: [0, 2000000],
    location: null,
    rating: null,
    inStock: false,
    sortBy: 'relevance'
  });

  const categories = [
    { id: 1, name: "Bibit & Benih", icon: "🌱" },
    { id: 2, name: "Pupuk & Pestisida", icon: "🧪" },
    { id: 3, name: "Alat Pertanian", icon: "🔧" },
    { id: 4, name: "Hasil Panen", icon: "🍎" },
    { id: 5, name: "Pakan Ternak", icon: "🌾" },
    { id: 6, name: "Tanaman Hias", icon: "🌿" }
  ];

  const locations = [
    "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur", "Jakarta Utara", "Jakarta Pusat",
    "Bandung", "Surabaya", "Yogyakarta", "Malang", "Semarang", "Medan", "Palembang"
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevansi' },
    { value: 'price_low', label: 'Harga Terendah' },
    { value: 'price_high', label: 'Harga Tertinggi' },
    { value: 'rating', label: 'Rating Tertinggi' },
    { value: 'newest', label: 'Terbaru' }
  ];

  // Mock data for demonstration (replace with real Supabase query)
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Bibit Jagung Hibrida NK212",
      description: "Bibit jagung hibrida berkualitas tinggi untuk hasil panen maksimal",
      price: 85000,
      originalPrice: 95000,
      image_url: "https://images.unsplash.com/photo-1551801841-ecad875a5142?w=400",
      stock_quantity: 100,
      unit: "pack",
      category_id: 1,
      seller_id: 1,
      status: "active",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      rating: 4.8,
      reviews: 234,
      seller: "Toko Bibit Unggul",
      location: "Jakarta Barat",
      badge: "Terlaris",
      isDiscount: true
    },
    {
      id: 2,
      name: "Pupuk NPK 16-16-16 (25kg)",
      description: "Pupuk NPK seimbang untuk pertumbuhan tanaman optimal",
      price: 275000,
      image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      stock_quantity: 50,
      unit: "sack",
      category_id: 2,
      seller_id: 2,
      status: "active",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      rating: 4.6,
      reviews: 156,
      seller: "AgriSupply Center",
      location: "Bandung",
      badge: "Recommended",
      isDiscount: false
    },
    {
      id: 3,
      name: "Cangkul Stainless Steel Professional",
      description: "Cangkul berkualitas tinggi dengan bahan stainless steel",
      price: 145000,
      originalPrice: 160000,
      image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      stock_quantity: 25,
      unit: "pcs",
      category_id: 3,
      seller_id: 3,
      status: "active",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      rating: 4.9,
      reviews: 89,
      seller: "Tools Agriculture",
      location: "Surabaya",
      badge: "Premium",
      isDiscount: true
    },
    {
      id: 4,
      name: "Bibit Cabai Keriting Super Hot",
      description: "Bibit cabai keriting dengan tingkat kepedasan tinggi",
      price: 45000,
      image_url: "https://images.unsplash.com/photo-1583200310002-372c7c9c0d62?w=400",
      stock_quantity: 200,
      unit: "pack",
      category_id: 1,
      seller_id: 4,
      status: "active",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      rating: 4.7,
      reviews: 312,
      seller: "Bibit Nusantara",
      location: "Yogyakarta",
      badge: "New",
      isDiscount: false
    },
    {
      id: 5,
      name: "Pestisida Organik Nabati 1L",
      description: "Pestisida organik ramah lingkungan dari bahan nabati",
      price: 65000,
      originalPrice: 75000,
      image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      stock_quantity: 75,
      unit: "bottle",
      category_id: 2,
      seller_id: 5,
      status: "active",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      rating: 4.5,
      reviews: 78,
      seller: "Organic Farm Supply",
      location: "Malang",
      badge: "Organic",
      isDiscount: true
    },
    {
      id: 6,
      name: "Sprayer Electric 16L",
      description: "Sprayer elektrik kapasitas besar untuk efisiensi kerja",
      price: 1250000,
      image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      stock_quantity: 10,
      unit: "pcs",
      category_id: 3,
      seller_id: 6,
      status: "active",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      rating: 4.8,
      reviews: 45,
      seller: "Modern Farm Tools",
      location: "Semarang",
      badge: "Electric",
      isDiscount: false
    }
  ];

  const searchProducts = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would query Supabase here
      // const { data, error } = await supabase
      //   .from('products')
      //   .select('*')
      //   .ilike('name', `%${searchQuery}%`)
      //   .gte('price', filters.priceRange[0])
      //   .lte('price', filters.priceRange[1]);

      // For now, use mock data with filtering
      let filteredProducts = mockProducts.filter(product => {
        const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = !filters.category || product.category_id === parseInt(filters.category);
        const matchPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
        const matchLocation = !filters.location || product.location === filters.location;
        const matchRating = !filters.rating || (product.rating && product.rating >= filters.rating);
        const matchStock = !filters.inStock || product.stock_quantity > 0;
        
        return matchSearch && matchCategory && matchPrice && matchLocation && matchRating && matchStock;
      });

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
          filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        default:
          // Relevance sorting (keep original order for now)
          break;
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      searchProducts();
    }
  }, [query, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const clearFilters = () => {
    setFilters({
      category: null,
      priceRange: [0, 2000000],
      location: null,
      rating: null,
      inStock: false,
      sortBy: 'relevance'
    });
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <span key={i} className="bg-yellow-200 text-green-900 font-bold rounded px-1">{part}</span> : part
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-16">
        {/* Search Header */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Cari produk pertanian..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Cari
              </Button>
            </form>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Filter</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>

                <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Category Filter */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Kategori</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={filters.category === category.id.toString()}
                            onCheckedChange={(checked) => {
                              setFilters(prev => ({
                                ...prev,
                                category: checked ? category.id.toString() : null
                              }));
                            }}
                          />
                          <label htmlFor={`category-${category.id}`} className="text-sm text-gray-600 cursor-pointer">
                            {category.icon} {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Rentang Harga</h4>
                    <div className="px-2">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                        max={2000000}
                        step={10000}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatPrice(filters.priceRange[0])}</span>
                        <span>{formatPrice(filters.priceRange[1])}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Lokasi</h4>
                    <Select
                      value={filters.location || "all"}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, location: value === "all" ? null : value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih lokasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Lokasi</SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Rating Minimum</h4>
                    <Select
                      value={filters.rating?.toString() || "all"}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value === "all" ? null : parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Rating</SelectItem>
                        <SelectItem value="4">4+ Bintang</SelectItem>
                        <SelectItem value="3">3+ Bintang</SelectItem>
                        <SelectItem value="2">2+ Bintang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stock Filter */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inStock"
                        checked={filters.inStock}
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, inStock: checked as boolean }))}
                      />
                      <label htmlFor="inStock" className="text-sm text-gray-600 cursor-pointer">
                        Stok tersedia
                      </label>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Bersihkan Filter
                  </Button>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Hasil Pencarian: "{query}"
                    </h2>
                    <p className="text-sm text-gray-600">
                      {products.length} produk ditemukan
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Urutkan:</span>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-t-lg" />
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2" />
                        <div className="h-3 bg-gray-200 rounded mb-4" />
                        <div className="h-6 bg-gray-200 rounded" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        name: highlightText(product.name, query),
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image_url || "https://via.placeholder.com/400x300?text=No+Image",
                        rating: product.rating || 0,
                        reviews: product.reviews || 0,
                        seller: product.seller || "Unknown Seller",
                        location: product.location || "Unknown Location",
                        badge: product.badge || "New",
                        isDiscount: product.isDiscount || false
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Tidak ada produk ditemukan
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Coba ubah kata kunci pencarian atau filter Anda
                  </p>
                  <Button
                    onClick={() => navigate('/')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Kembali ke Beranda
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchResults; 