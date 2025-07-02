import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const AddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Anda harus login untuk menambah produk.");
      return;
    }
    if (!name || !price || !stock) {
      setError("Nama, harga, dan stok wajib diisi.");
      return;
    }
    setError("");
    setLoading(true);

    const { error: insertError } = await supabase.from("products").insert({
      name,
      price: Number(price),
      stock_quantity: Number(stock),
      image_url: image,
      description,
      seller_id: user.id, // Menggunakan ID user yang login
      category_id: 1, // Kategori default (misal: Hasil Panen)
      unit: 'kg' // Unit default
    });

    setLoading(false);

    if (insertError) {
      setError("Gagal menyimpan produk: " + insertError.message);
    } else {
      toast({
        title: "Sukses!",
        description: "Produk berhasil ditambahkan.",
      });
      navigate("/my-store");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24 max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Tambah Produk Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Nama Produk</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Harga (Rp)</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={price} onChange={e => setPrice(e.target.value)} min="0" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Stok</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={stock} onChange={e => setStock(e.target.value)} min="0" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Deskripsi Produk</label>
                <textarea className="w-full border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} rows={3}></textarea>
              </div>
              <div>
                <label className="block mb-1 font-medium">URL Gambar Produk</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Produk"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct; 