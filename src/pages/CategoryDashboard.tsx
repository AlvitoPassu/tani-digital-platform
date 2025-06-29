import CategoryList from "@/components/CategoryList";
import { useState } from "react";

const CategoryDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Kategori</h1>
        <p className="text-gray-600 mb-8">Lihat dan pilih kategori produk pertanian secara lengkap.</p>
        <CategoryList selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
    </div>
  );
};

export default CategoryDashboard; 