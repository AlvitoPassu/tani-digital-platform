import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const OrderManagement = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [notif, setNotif] = useState<string | null>(null);
  const [editOrder, setEditOrder] = useState<any>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [detailOrder, setDetailOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterBuyer, setFilterBuyer] = useState<string>("");

  // Fetch orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, buyer_id, status, total, created_at, updated_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch buyers (for display name)
  const { data: buyers } = useQuery({
    queryKey: ["buyers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, name, email");
      if (error) throw error;
      return data;
    },
  });

  // Fetch order items for detail modal
  const { data: orderItems } = useQuery({
    queryKey: ["order-items", detailOrder?.id],
    queryFn: async () => {
      if (!detailOrder?.id) return [];
      const { data, error } = await supabase
        .from("order_items")
        .select("product_id, quantity, price, products(name, image_url, category, description, unit)")
        .eq("order_id", detailOrder.id);
      if (error) throw error;
      return data;
    },
    enabled: !!detailOrder?.id,
  });

  // Update status
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setNotif("Status order berhasil diupdate.");
      setEditOrder(null);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setTimeout(() => setNotif(null), 2000);
    },
    onError: (err: any) => {
      setNotif("Gagal update status: " + err.message);
      setTimeout(() => setNotif(null), 2000);
    },
  });

  // Hapus order
  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setNotif("Order berhasil dihapus.");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setTimeout(() => setNotif(null), 2000);
    },
    onError: (err: any) => {
      setNotif("Gagal hapus order: " + err.message);
      setTimeout(() => setNotif(null), 2000);
    },
  });

  // Filter orders lanjutan
  const filteredOrders = useMemo(() => {
    let data = orders || [];
    if (filterStatus) data = data.filter((o: any) => o.status === filterStatus);
    if (filterBuyer) data = data.filter((o: any) => o.buyer_id === filterBuyer);
    if (search) {
      data = data.filter((order: any) =>
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        (buyers?.find((b: any) => b.id === order.buyer_id)?.name || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    return data;
  }, [orders, buyers, search, filterStatus, filterBuyer]);

  // Export data ke Excel
  const handleExportExcel = () => {
    if (!filteredOrders || filteredOrders.length === 0) return;
    // Siapkan data untuk export
    const exportData = filteredOrders.map((order: any) => ({
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Manajemen Order</h2>
      {/* Filter lanjutan */}
      <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
        <input
          type="text"
          className="border rounded px-3 py-1 w-full max-w-xs"
          placeholder="Cari ID order atau nama pembeli..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-2 py-1"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">Semua Status</option>
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1"
          value={filterBuyer}
          onChange={e => setFilterBuyer(e.target.value)}
        >
          <option value="">Semua Pembeli</option>
          {buyers?.filter((b: any) => b.role === 'buyer').map((b: any) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <Button variant="outline" onClick={handleExportExcel}>
          Export Data
        </Button>
      </div>
      {notif && <div className="mb-4 text-center text-sm text-green-600">{notif}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Pembeli</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Tanggal</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders && filteredOrders.length > 0 ? (
                filteredOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{order.id.slice(0, 8)}...</td>
                    <td className="p-2 border">{buyers?.find((b: any) => b.id === order.buyer_id)?.name || '-'}</td>
                    <td className="p-2 border">{order.status}</td>
                    <td className="p-2 border">Rp {order.total_amount?.toLocaleString() || '-'}</td>
                    <td className="p-2 border">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</td>
                    <td className="p-2 border space-x-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditOrder(order); setEditStatus(order.status); }}>Ubah Status</Button>
                      <Button size="sm" variant="outline" onClick={() => setDetailOrder(order)}>Lihat Detail</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteOrder.mutate(order.id)}>Hapus</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4">Tidak ada order ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal Ubah Status */}
      {editOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setEditOrder(null)}
              aria-label="Tutup"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Ubah Status Order</h3>
            <div className="mb-3">
              <label className="block text-sm mb-1">Status</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={editStatus}
                onChange={e => setEditStatus(e.target.value)}
                disabled={loading}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => updateStatus.mutate({ id: editOrder.id, status: editStatus })} disabled={updateStatus.isPending}>
                {updateStatus.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button variant="outline" onClick={() => setEditOrder(null)} disabled={updateStatus.isPending}>
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Detail Order */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setDetailOrder(null)}
              aria-label="Tutup"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Detail Order</h3>
            <div className="mb-2"><b>ID:</b> {detailOrder.id}</div>
            <div className="mb-2"><b>Pembeli:</b> {buyers?.find((b: any) => b.id === detailOrder.buyer_id)?.name || '-'}</div>
            <div className="mb-2"><b>Status:</b> {detailOrder.status}</div>
            <div className="mb-2"><b>Alamat:</b> {detailOrder.shipping_address || '-'}</div>
            <div className="mb-2"><b>Metode Bayar:</b> {detailOrder.payment_method || '-'}</div>
            <div className="mb-2"><b>Catatan:</b> {detailOrder.notes || '-'}</div>
            <div className="mb-2"><b>Tanggal:</b> {detailOrder.created_at ? new Date(detailOrder.created_at).toLocaleString() : '-'}</div>
            <div className="mb-2"><b>Item:</b></div>
            <table className="min-w-full border text-xs mb-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-1 border">Produk</th>
                  <th className="p-1 border">Gambar</th>
                  <th className="p-1 border">Kategori</th>
                  <th className="p-1 border">Deskripsi</th>
                  <th className="p-1 border">Satuan</th>
                  <th className="p-1 border">Qty</th>
                  <th className="p-1 border">Harga</th>
                  <th className="p-1 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderItems && orderItems.length > 0 ? (
                  orderItems.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-1 border">{item.products?.name || item.product_id}</td>
                      <td className="p-1 border">
                        {item.products?.image_url ? (
                          <img src={item.products.image_url} alt={item.products.name} className="w-10 h-10 object-cover rounded" />
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td className="p-1 border">{item.products?.category || '-'}</td>
                      <td className="p-1 border">{item.products?.description || '-'}</td>
                      <td className="p-1 border">{item.products?.unit || '-'}</td>
                      <td className="p-1 border">{item.quantity}</td>
                      <td className="p-1 border">Rp {item.price?.toLocaleString()}</td>
                      <td className="p-1 border">Rp {(item.price * item.quantity)?.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={8} className="text-center p-2">Tidak ada item</td></tr>
                )}
              </tbody>
            </table>
            <div className="mt-2 text-right font-bold">Total: Rp {detailOrder.total_amount?.toLocaleString() || '-'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement; 