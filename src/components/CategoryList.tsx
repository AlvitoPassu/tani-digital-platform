import { useState } from 'react';
import { Sprout, FlaskConical, Wrench, ShoppingBag, Leaf, Apple, Carrot, Flower2, Wheat, Tractor, MapPin } from 'lucide-react';

const categories = [
  { key: 'Bibit', name: 'Bibit & Benih', icon: <Sprout className="h-7 w-7 text-green-600" /> },
  { key: 'Pupuk', name: 'Pupuk', icon: <FlaskConical className="h-7 w-7 text-yellow-600" /> },
  { key: 'Pestisida', name: 'Pestisida', icon: <FlaskConical className="h-7 w-7 text-red-600" /> },
  { key: 'Alat', name: 'Alat Pertanian', icon: <Wrench className="h-7 w-7 text-blue-600" /> },
  { key: 'Panen', name: 'Hasil Panen', icon: <ShoppingBag className="h-7 w-7 text-orange-600" /> },
  { key: 'Buah', name: 'Buah', icon: <Apple className="h-7 w-7 text-pink-600" /> },
  { key: 'Sayur', name: 'Sayuran', icon: <Carrot className="h-7 w-7 text-emerald-600" /> },
  { key: 'Tanaman', name: 'Tanaman Hias', icon: <Flower2 className="h-7 w-7 text-purple-600" /> },
  { key: 'Gandum', name: 'Gandum', icon: <Wheat className="h-7 w-7 text-yellow-700" /> },
  { key: 'Traktor', name: 'Traktor', icon: <Tractor className="h-7 w-7 text-gray-600" /> },
];

interface CategoryListProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
}

const CategoryList = ({ selectedCategory, setSelectedCategory }: CategoryListProps) => {
  return (
    <section className="max-w-6xl mx-auto px-4 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Kategori Produk</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <button
          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition shadow-sm hover:shadow-lg hover:border-green-500 ${!selectedCategory ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white'}`}
          onClick={() => setSelectedCategory(null)}
        >
          <Leaf className="h-7 w-7 text-green-700 mb-1" />
          <span className="text-sm font-semibold text-gray-700">Semua</span>
        </button>
        {categories.map(cat => (
          <button
            key={cat.key}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition shadow-sm hover:shadow-lg hover:border-green-500 ${selectedCategory === cat.key ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white'}`}
            onClick={() => setSelectedCategory(cat.key)}
          >
            {cat.icon}
            <span className="text-sm font-semibold text-gray-700 mt-1">{cat.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryList; 