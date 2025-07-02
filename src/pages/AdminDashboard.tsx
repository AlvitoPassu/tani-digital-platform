import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, TrendingUp, BarChart3, Settings, Shield, AlertTriangle, Package, DollarSign, Activity, Database, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
fitur-cari-produk
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import UserManagement from "@/components/UserManagement";
import OrderManagement from "@/components/OrderManagement";
import * as XLSX from "xlsx";

const roles = [
  { value: "admin", label: "Admin" },
  { value: "farmer", label: "Petani" },
  { value: "buyer", label: "Pembeli" },
];

const AdminDashboard = () => {
  const { profile } = useAuth();

  // Fetch user statistics from Supabase
  const { data: userStats, isLoading: isUserStatsLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      // Fetch all profiles
      const { data, error } = await supabase.from("profiles").select("role");
      if (error) throw error;
      const totalUsers = data.length;
      const totalPetani = data.filter((u: any) => u.role === "farmer").length;
      const totalPembeli = data.filter((u: any) => u.role === "buyer").length;
      return { totalUsers, totalPetani, totalPembeli };
    },
  });

const AdminDashboard = () => {
  const { profile } = useAuth();
main
  const [stats] = useState({
    totalUsers: 1247,
    totalOrders: 892,
    totalRevenue: 125000000,
    activeProducts: 156,
    pendingOrders: 23,
    lowStockProducts: 8
  });

  const [recentActivities] = useState([
    { type: "user", action: "User baru mendaftar", time: "2 menit yang lalu", user: "john.doe@email.com" },
    { type: "order", action: "Order baru dibuat", time: "5 menit yang lalu", order: "ORD-0893" },
    { type: "product", action: "Produk baru ditambahkan", time: "10 menit yang lalu", product: "Cabai Merah Premium" },
    { type: "system", action: "Backup database selesai", time: "15 menit yang lalu" }
  ]);

fitur-cari-produk
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserForm, setAddUserForm] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserNotif, setAddUserNotif] = useState<string | null>(null);
  const [showOrderManagement, setShowOrderManagement] = useState(false);

  // Fungsi tambah user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserLoading(true);
    setAddUserNotif(null);

    // Validasi sederhana
    if (!addUserForm.name || !addUserForm.email || !addUserForm.password || !addUserForm.role) {
      setAddUserNotif('Semua field wajib diisi.');
      setAddUserLoading(false);
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addUserForm.email)) {
      setAddUserNotif('Format email tidak valid.');
      setAddUserLoading(false);
      return;
    }
    if (addUserForm.password.length < 6) {
      setAddUserNotif('Password minimal 6 karakter.');
      setAddUserLoading(false);
      return;
    }

    const res = await fetch('https://kkxhaedaekxosbyzmjit.functions.supabase.co/add-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addUserForm),
    });
    let result: any = {};
    try {
      result = await res.json();
    } catch (err) {
      setAddUserNotif('Gagal menambah user: Response tidak valid.');
      setAddUserLoading(false);
      return;
    }
    if (!res.ok) {
      setAddUserNotif('Gagal menambah user: ' + (result.error || 'Unknown error.')); 
      setAddUserLoading(false);
      return;
    }
    setAddUserNotif('User berhasil ditambahkan!');
    setAddUserLoading(false);
    setAddUserForm({ name: '', email: '', password: '', role: 'buyer' });
    setTimeout(() => {
      setShowAddUser(false);
      setAddUserNotif(null);
      window.location.reload();
    }, 1200);
  };

  // Export data ke Excel (ambil data order dari Supabase langsung)
  const handleExportExcel = async () => {
    // Fetch all orders
    const { data: orders, error } = await supabase
      .from("orders")
      .select("id, buyer_id, status, total_amount, created_at, shipping_address, payment_method, notes");
    if (error || !orders) return;
    // Fetch buyers
    const { data: buyers } = await supabase.from("profiles").select("id, name");
    // Siapkan data untuk export
    const exportData = orders.map((order: any) => ({
      ID: order.id,
      Pembeli: buyers?.find((b: any) => b.id === order.buyer_id)?.name || order.buyer_id,
      Status: order.status,
      Total: order.total_amount,
      Tanggal: order.created_at ? new Date(order.created_at).toLocaleString() : "",
      Alamat: order.shipping_address || "",
      MetodeBayar: order.payment_method || "",
      Catatan: order.notes || ""
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

main
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Dashboard - {profile?.name || 'Administrator'} 👨‍💼
          </h1>
          <p className="text-gray-600 mt-24">
            Kelola sistem Tani Digital Platform
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Users</p>
fitur-cari-produk
                  <p className="text-2xl font-bold">
                    {isUserStatsLoading ? '...' : userStats?.totalUsers?.toLocaleString()}
                  </p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
main
                </div>
                <Users className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</p>
                </div>
                <ShoppingCart className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Revenue</p>
                  <p className="text-2xl font-bold">Rp {(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
                <DollarSign className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Active Products</p>
                  <p className="text-2xl font-bold">{stats.activeProducts}</p>
                </div>
                <Package className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* User Management */}
          <Card className="hover:shadow-lg transition-all duration-300 border-blue-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-blue-600" />
                Manajemen User
              </CardTitle>
            </CardHeader>
            <CardContent>
fitur-cari-produk
              {profile?.role === 'admin' ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Users:</span>
                    <Badge variant="outline">{isUserStatsLoading ? '...' : userStats?.totalUsers}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Petani:</span>
                    <Badge variant="secondary">{isUserStatsLoading ? '...' : userStats?.totalPetani}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pembeli:</span>
                    <Badge variant="secondary">{isUserStatsLoading ? '...' : userStats?.totalPembeli}</Badge>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setShowUserManagement(true)}>
                      Kelola Users
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setShowAddUser(true)}>
                      Tambah User
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-red-500 font-semibold py-8">
                  Akses ditolak. Hanya admin yang dapat mengakses fitur ini.
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Users:</span>
                  <Badge variant="outline">{stats.totalUsers}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Petani:</span>
                  <Badge variant="secondary">847</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pembeli:</span>
                  <Badge variant="secondary">400</Badge>
                </div>
                <div className="space-y-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Kelola Users
                  </Button>
                  <Button variant="outline" className="w-full">
                    Tambah User
                  </Button>
                </div>
              </div>
main
            </CardContent>
          </Card>

          {/* Order Management */}
          <Card className="hover:shadow-lg transition-all duration-300 border-green-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                Manajemen Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending Orders:</span>
                  <Badge variant="destructive">{stats.pendingOrders}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed Today:</span>
                  <Badge variant="outline">45</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Revenue Today:</span>
                  <Badge variant="outline">Rp 8.5M</Badge>
                </div>
                <div className="space-y-2">
fitur-cari-produk
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setShowOrderManagement(true)}>
                    Lihat Semua Order
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleExportExcel}>

                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Lihat Semua Order
                  </Button>
                  <Button variant="outline" className="w-full">
main
                    Export Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Management */}
          <Card className="hover:shadow-lg transition-all duration-300 border-purple-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-purple-600" />
                Manajemen Produk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Products:</span>
                  <Badge variant="outline">{stats.activeProducts}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Low Stock:</span>
                  <Badge variant="destructive">{stats.lowStockProducts}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Categories:</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="space-y-2">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Kelola Produk
                  </Button>
                  <Button variant="outline" className="w-full">
                    Tambah Produk
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="hover:shadow-lg transition-all duration-300 border-indigo-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Sales Growth:</span>
                    <span>+15%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>User Growth:</span>
                    <span>+8%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Order Completion:</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <Button variant="outline" className="w-full">
                  Lihat Detail Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="hover:shadow-lg transition-all duration-300 border-yellow-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-yellow-600" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Database: Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">API Services: Healthy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Storage: 78% Used</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Uptime: 99.9%</span>
                </div>
                <Button variant="outline" className="w-full">
                  System Monitor
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings & Configuration */}
          <Card className="hover:shadow-lg transition-all duration-300 border-gray-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5 text-gray-600" />
                Settings & Config
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Database Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Backup & Restore
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  System Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities & Alerts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Activity className="h-5 w-5" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'order' ? 'bg-green-500' :
                      activity.type === 'product' ? 'bg-purple-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                      {activity.user && <p className="text-xs text-blue-600">{activity.user}</p>}
                      {activity.order && <p className="text-xs text-green-600">{activity.order}</p>}
                      {activity.product && <p className="text-xs text-purple-600">{activity.product}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Low Stock Alert</p>
                    <p className="text-xs text-red-600">8 produk perlu restock</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Pending Orders</p>
                    <p className="text-xs text-yellow-600">23 order menunggu konfirmasi</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">System Update</p>
                    <p className="text-xs text-blue-600">Update tersedia untuk diinstall</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Lihat Semua Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
fitur-cari-produk

        {/* User Management Modal/Section */}
        {showUserManagement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setShowUserManagement(false)}
                aria-label="Tutup"
              >
                &times;
              </button>
              <UserManagement />
            </div>
          </div>
        )}
        {/* Modal Tambah User */}
        {showAddUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setShowAddUser(false)}
                aria-label="Tutup"
              >
                &times;
              </button>
              <h3 className="text-lg font-bold mb-4">Tambah User</h3>
              <form onSubmit={handleAddUser} className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Nama</label>
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={addUserForm.name}
                    onChange={e => setAddUserForm(f => ({ ...f, name: e.target.value }))}
                    required
                    disabled={addUserLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded px-2 py-1"
                    value={addUserForm.email}
                    onChange={e => setAddUserForm(f => ({ ...f, email: e.target.value }))}
                    required
                    disabled={addUserLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full border rounded px-2 py-1"
                    value={addUserForm.password}
                    onChange={e => setAddUserForm(f => ({ ...f, password: e.target.value }))}
                    required
                    minLength={6}
                    disabled={addUserLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Role</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={addUserForm.role}
                    onChange={e => setAddUserForm(f => ({ ...f, role: e.target.value }))}
                    required
                    disabled={addUserLoading}
                  >
                    {roles.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-60"
                    disabled={addUserLoading}
                  >
                    {addUserLoading ? "Menyimpan..." : "Tambah"}
                  </button>
                  <button
                    type="button"
                    className="border px-4 py-1 rounded"
                    onClick={() => setShowAddUser(false)}
                    disabled={addUserLoading}
                  >
                    Batal
                  </button>
                </div>
                {addUserNotif && <div className="text-center text-sm text-green-600 mt-2">{addUserNotif}</div>}
              </form>
            </div>
          </div>
        )}
        {/* Modal Order Management */}
        {showOrderManagement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setShowOrderManagement(false)}
                aria-label="Tutup"
              >
                &times;
              </button>
              <OrderManagement />
            </div>
          </div>
        )}
main
      </div>
    </div>
  );
};

export default AdminDashboard; 