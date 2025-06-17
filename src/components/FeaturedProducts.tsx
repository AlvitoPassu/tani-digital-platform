
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Bibit Jagung Hibrida NK212",
      price: 85000,
      originalPrice: 95000,
      image: "https://images.unsplash.com/photo-1551801841-ecad875a5142?w=400",
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
      price: 275000,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
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
      price: 145000,
      originalPrice: 160000,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
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
      price: 45000,
      image: "https://images.unsplash.com/photo-1583200310002-372c7c9c0d62?w=400",
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
      price: 65000,
      originalPrice: 75000,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
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
      price: 1250000,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      rating: 4.8,
      reviews: 45,
      seller: "Modern Farm Tools",
      location: "Semarang",
      badge: "Electric",
      isDiscount: false
    }
  ];

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
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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
