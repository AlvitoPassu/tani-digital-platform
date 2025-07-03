import ProductCard from "./ProductCard";
import { dummyProducts } from "@/data/products";

interface FeaturedProductsProps {
  searchQuery: string;
  selectedCategory: string | null;
  priceRange: [number, number];
  selectedLocation: string | null;
}

const categoryMap: Record<string, string[]> = {
  "Bibit & Benih": ["Bibit"],
  "Pupuk & Pestisida": ["Pupuk", "Pestisida"],
  "Alat Pertanian": ["Alat"],
  "Hasil Panen": ["Panen", "Jagung", "Cabai"],
  "Pakan Ternak": ["Pakan"],
  "Tanaman Hias": ["Tanaman"],
};

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.split(regex).map((part, i) =>
    regex.test(part) ? <span key={i} className="bg-yellow-200 text-green-900 font-bold rounded px-1">{part}</span> : part
  );
};

const FeaturedProducts = ({ searchQuery, selectedCategory, priceRange, selectedLocation }: FeaturedProductsProps) => {
  const filteredProducts = dummyProducts.filter(product => {
    // Filter search
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter kategori
    let matchCategory = true;
    if (selectedCategory) {
      matchCategory = product.category === selectedCategory;
    }
    
    // Filter harga
    const matchPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    // Filter lokasi
    const matchLocation = !selectedLocation || product.location.includes(selectedLocation);
    
    return matchSearch && matchCategory && matchPrice && matchLocation;
  });

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Produk Unggulan
          </h2>
          <p className="text-xl text-gray-600">
            Pilihan terbaik dari ribuan produk berkualitas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                name: highlightText(product.name, searchQuery)
              }}
            />
          )) : (
            <div className="col-span-3 text-center text-gray-500 py-12">
              <div className="text-2xl mb-2">🔍</div>
              <p>Produk tidak ditemukan.</p>
              <p className="text-sm text-gray-400 mt-1">Coba ubah filter pencarian Anda</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Lihat Semua Produk
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
