import React, { useState, useContext, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, MapPin, Filter, ShoppingCart, Eye } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  location: {
    province: string;
    city: string;
    district?: string;
  };
  seller: {
    name: string;
    rating: number;
  };
  stock: number;
  unit: string;
  isOrganic: boolean;
  isFresh: boolean;
}

const Products: React.FC<{ onFavoriteAdded?: () => void }> = ({ onFavoriteAdded }) => {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Sample data - in real app this would come from API
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Beras Organik Premium',
      description: 'Beras organik berkualitas tinggi dari petani lokal',
      price: 15000,
      image: '/placeholder.svg',
      category: 'Beras',
      location: { province: 'Jawa Barat', city: 'Bandung', district: 'Cimahi' },
      seller: { name: 'Tani Maju', rating: 4.8 },
      stock: 50,
      unit: 'kg',
      isOrganic: true,
      isFresh: true
    },
    {
      id: '2',
      name: 'Sayuran Organik Pack',
      description: 'Paket sayuran organik segar langsung dari kebun',
      price: 25000,
      image: '/placeholder.svg',
      category: 'Sayuran',
      location: { province: 'Jawa Barat', city: 'Bandung', district: 'Lembang' },
      seller: { name: 'Kebun Organik', rating: 4.9 },
      stock: 30,
      unit: 'pack',
      isOrganic: true,
      isFresh: true
    },
    {
      id: '3',
      name: 'Buah Apel Malang',
      description: 'Apel segar dari Malang, manis dan renyah',
      price: 35000,
      image: '/placeholder.svg',
      category: 'Buah',
      location: { province: 'Jawa Timur', city: 'Malang', district: 'Batu' },
      seller: { name: 'Kebun Apel', rating: 4.7 },
      stock: 25,
      unit: 'kg',
      isOrganic: false,
      isFresh: true
    },
    {
      id: '4',
      name: 'Cabai Merah',
      description: 'Cabai merah segar pedas',
      price: 45000,
      image: '/placeholder.svg',
      category: 'Bumbu',
      location: { province: 'Jawa Tengah', city: 'Semarang', district: 'Ungaran' },
      seller: { name: 'Tani Cabai', rating: 4.6 },
      stock: 40,
      unit: 'kg',
      isOrganic: false,
      isFresh: true
    },
    {
      id: '5',
      name: 'Kentang Organik',
      description: 'Kentang organik ukuran besar',
      price: 18000,
      image: '/placeholder.svg',
      category: 'Umbi-umbian',
      location: { province: 'Jawa Barat', city: 'Bandung', district: 'Cimahi' },
      seller: { name: 'Tani Maju', rating: 4.8 },
      stock: 60,
      unit: 'kg',
      isOrganic: true,
      isFresh: true
    }
  ];

  const provinces = ['Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'DKI Jakarta', 'Banten'];
  const cities = {
    'Jawa Barat': ['Bandung', 'Bekasi', 'Bogor', 'Cimahi', 'Cirebon'],
    'Jawa Tengah': ['Semarang', 'Solo', 'Magelang', 'Salatiga', 'Pekalongan'],
    'Jawa Timur': ['Surabaya', 'Malang', 'Sidoarjo', 'Gresik', 'Pasuruan'],
    'DKI Jakarta': ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur'],
    'Banten': ['Serang', 'Tangerang', 'Cilegon', 'Lebak', 'Pandeglang']
  };
  
  const categories = ['Semua', 'Beras', 'Sayuran', 'Buah', 'Bumbu', 'Umbi-umbian', 'Kacang-kacangan'];

  useEffect(() => {
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by province
    if (selectedProvince) {
      filtered = filtered.filter(product => product.location.province === selectedProvince);
    }

    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter(product => product.location.city === selectedCity);
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'Semua') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        }
        return product.price >= min;
      });
    }

    // Sort products
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.seller.rating - a.seller.rating;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedProvince, selectedCity, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (product: Product) => {
    if (user?.role !== 'buyer') {
      toast({
        title: "Akses Ditolak",
        description: "Hanya pembeli yang dapat membeli produk",
        variant: "destructive"
      });
      return;
    }

    // Add to cart logic here
    toast({
      title: "Berhasil",
      description: `${product.name} ditambahkan ke keranjang`,
    });
  };

  const handleViewProduct = (product: Product) => {
    // Navigate to product detail page
    console.log('View product:', product.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Produk Pertanian</h1>
            <p className="text-gray-600">Temukan produk pertanian segar dari petani lokal</p>
          </div>

          {/* Filters Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter & Pencarian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Province Filter */}
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Provinsi</SelectItem>
                    {provinces.map(province => (
                      <SelectItem key={province} value={province}>{province}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* City Filter */}
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kota</SelectItem>
                    {selectedProvince && cities[selectedProvince as keyof typeof cities]?.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Price Range */}
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rentang Harga" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Harga</SelectItem>
                    <SelectItem value="0-20000">Dibawah Rp 20.000</SelectItem>
                    <SelectItem value="20000-50000">Rp 20.000 - Rp 50.000</SelectItem>
                    <SelectItem value="50000-100000">Rp 50.000 - Rp 100.000</SelectItem>
                    <SelectItem value="100000-">Diatas Rp 100.000</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort By */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Urutan Default</SelectItem>
                    <SelectItem value="price-low">Harga Terendah</SelectItem>
                    <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                    <SelectItem value="rating">Rating Tertinggi</SelectItem>
                    <SelectItem value="name">Nama A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-600">
              Menampilkan {filteredProducts.length} dari {products.length} produk
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Price and Stock */}
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-green-600">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Stok: {product.stock} {product.unit}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{product.location.city}, {product.location.province}</span>
                    </div>

                    {/* Seller Info */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{product.seller.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">⭐</span>
                        <span className="text-sm">{product.seller.rating}</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex gap-2">
                      {product.isOrganic && (
                        <Badge variant="secondary" className="text-xs">Organik</Badge>
                      )}
                      {product.isFresh && (
                        <Badge variant="outline" className="text-xs">Segar</Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewProduct(product)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                      
                      {user?.role === 'buyer' ? (
                        <Button
                          onClick={() => handleAddToCart(product)}
                          size="sm"
                          className="flex-1"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Beli
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleAddToCart(product)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          disabled
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {user?.role === 'farmer' ? 'Hanya Pembeli' : 'Login Dulu'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">Tidak ada produk yang ditemukan</p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedProvince('');
                  setSelectedCity('');
                  setSelectedCategory('');
                  setPriceRange('');
                  setSortBy('');
                }}
                variant="outline"
                className="mt-4"
              >
                Reset Filter
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Products; 