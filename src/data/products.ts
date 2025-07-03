export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  seller: string;
  location: string;
  badge: string;
  isDiscount: boolean;
  category: string;
  description: string;
  unit: string;
}

export const dummyProducts: Product[] = [
  {
    id: 1,
    name: "Bibit Cabai Merah Premium",
    price: 25000,
    originalPrice: 30000,
    image: "https://images.unsplash.com/photo-1603049405392-74dc211f0137?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 156,
    seller: "Tani Sejahtera",
    location: "Bandung, Jawa Barat",
    badge: "Terlaris",
    isDiscount: true,
    category: "Bibit",
    description: "Bibit cabai merah berkualitas tinggi dengan hasil panen melimpah",
    unit: "pack"
  },
  {
    id: 2,
    name: "Pupuk Organik Cair",
    price: 45000,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 89,
    seller: "Green Farm",
    location: "Solo, Jawa Tengah",
    badge: "Organic",
    isDiscount: false,
    category: "Pupuk",
    description: "Pupuk organik cair untuk pertumbuhan tanaman yang optimal",
    unit: "liter"
  },
  {
    id: 3,
    name: "Alat Semprot Pertanian",
    price: 85000,
    originalPrice: 100000,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 234,
    seller: "Toko Tani",
    location: "Malang, Jawa Timur",
    badge: "Recommended",
    isDiscount: true,
    category: "Alat",
    description: "Alat semprot pertanian berkualitas tinggi untuk hasil maksimal",
    unit: "pcs"
  },
  {
    id: 4,
    name: "Bibit Tomat Cherry",
    price: 18000,
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop",
    rating: 4.5,
    reviews: 67,
    seller: "Bibit Unggul",
    location: "Yogyakarta",
    badge: "New",
    isDiscount: false,
    category: "Bibit",
    description: "Bibit tomat cherry manis dengan hasil panen yang melimpah",
    unit: "pack"
  },
  {
    id: 5,
    name: "Pestisida Organik",
    price: 35000,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    rating: 4.4,
    reviews: 123,
    seller: "Organic Plus",
    location: "Bogor, Jawa Barat",
    badge: "Organic",
    isDiscount: false,
    category: "Pestisida",
    description: "Pestisida organik aman untuk tanaman dan lingkungan",
    unit: "liter"
  },
  {
    id: 6,
    name: "Cangkul Premium",
    price: 120000,
    originalPrice: 150000,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    rating: 4.9,
    reviews: 89,
    seller: "Toko Alat Tani",
    location: "Semarang, Jawa Tengah",
    badge: "Premium",
    isDiscount: true,
    category: "Alat",
    description: "Cangkul premium dengan bahan berkualitas tinggi",
    unit: "pcs"
  },
  {
    id: 7,
    name: "Bibit Kangkung",
    price: 12000,
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop",
    rating: 4.3,
    reviews: 45,
    seller: "Tani Muda",
    location: "Surabaya, Jawa Timur",
    badge: "Electric",
    isDiscount: false,
    category: "Bibit",
    description: "Bibit kangkung segar untuk budidaya yang mudah",
    unit: "pack"
  },
  {
    id: 8,
    name: "Timbangan Digital",
    price: 95000,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 78,
    seller: "Digital Farm",
    location: "Jakarta",
    badge: "Electric",
    isDiscount: false,
    category: "Alat",
    description: "Timbangan digital akurat untuk hasil panen",
    unit: "pcs"
  }
];

export const getProductsByCategory = (category: string) => {
  return dummyProducts.filter(product => product.category === category);
};

export const getProductById = (id: number) => {
  return dummyProducts.find(product => product.id === id);
}; 