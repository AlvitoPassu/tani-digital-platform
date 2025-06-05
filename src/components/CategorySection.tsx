
import { Sprout, Zap, Wrench, Apple, Wheat, TreePine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CategorySection = () => {
  const categories = [
    {
      icon: Sprout,
      name: "Bibit & Benih",
      count: "2,500+ produk",
      color: "bg-green-100 text-green-700",
      description: "Bibit unggul untuk hasil panen maksimal"
    },
    {
      icon: Zap,
      name: "Pupuk & Pestisida",
      count: "1,800+ produk",
      color: "bg-blue-100 text-blue-700",
      description: "Nutrisi terbaik untuk tanaman Anda"
    },
    {
      icon: Wrench,
      name: "Alat Pertanian",
      count: "3,200+ produk",
      color: "bg-orange-100 text-orange-700",
      description: "Peralatan modern untuk efisiensi kerja"
    },
    {
      icon: Apple,
      name: "Hasil Panen",
      count: "1,500+ produk",
      color: "bg-red-100 text-red-700",
      description: "Jual hasil panen langsung ke pasar"
    },
    {
      icon: Wheat,
      name: "Pakan Ternak",
      count: "900+ produk",
      color: "bg-yellow-100 text-yellow-700",
      description: "Nutrisi berkualitas untuk hewan ternak"
    },
    {
      icon: TreePine,
      name: "Tanaman Hias",
      count: "750+ produk",
      color: "bg-purple-100 text-purple-700",
      description: "Koleksi tanaman hias pilihan"
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Kategori Produk Pertanian
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Temukan semua kebutuhan pertanian Anda dalam satu platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                      <div className="text-sm font-medium text-green-600">{category.count}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
