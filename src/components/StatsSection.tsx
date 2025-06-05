
import { TrendingUp, Users, Package, Truck } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: "50K+",
      label: "Petani Aktif",
      description: "Bergabung dengan komunitas kami"
    },
    {
      icon: Package,
      number: "10K+",
      label: "Produk Tersedia",
      description: "Berbagai kategori pertanian"
    },
    {
      icon: Truck,
      number: "500+",
      label: "Kota Terjangkau",
      description: "Jaringan distribusi luas"
    },
    {
      icon: TrendingUp,
      number: "98%",
      label: "Kepuasan Pelanggan",
      description: "Rating positif dari pengguna"
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                  <IconComponent className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
