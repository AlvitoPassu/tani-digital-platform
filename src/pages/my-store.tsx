import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Trash, Pencil, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  description: string | null;
};

const MyStore = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ name: '', price: '', stock: '', image: '', description: '' });
  
  const [error, setError] = useState('');
  
  // Store Profile State
  const [storeProfile, setStoreProfile] = useState({ store_name: '', store_description: '', store_image_url: '' });
  const [storeEdit, setStoreEdit] = useState(false);
  const [storeLoading, setStoreLoading] = useState(false);
  const [storeMsg, setStoreMsg] = useState('');

  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    setProductsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, stock_quantity, image_url, description')
      .eq('seller_id', user.id);
    if (data) setProducts(data);
    setProductsLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user, fetchProducts]);
  
  const handleDelete = async (id: number) => {
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
    toast({ title: "Produk dihapus!" });
  };

  const handleEdit = (product: Product) => {
    setEditId(product.id);
    setEditData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock_quantity.toString(),
      image: product.image_url || '',
      description: product.description || ''
    });
    setError('');
  };

  const handleEditSave = async (id: number) => {
    if (!editData.name || !editData.price || !editData.stock) {
      setError('Nama, harga, dan stok wajib diisi.');
      return;
    }
    const { error: updateError } = await supabase
      .from('products')
      .update({
        name: editData.name,
        price: Number(editData.price),
        stock_quantity: Number(editData.stock),
        image_url: editData.image,
        description: editData.description
      })
      .eq('id', id);

    if (updateError) {
      setError("Gagal menyimpan produk: " + updateError.message);
    } else {
      setEditId(null);
      toast({ title: "Produk berhasil diupdate!" });
      fetchProducts();
    }
  };

  useEffect(() => {
    if (!user) return;
    const fetchStoreProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('store_name, store_description, store_image_url')
        .eq('id', user.id)
        .single();
      if (data) {
        setStoreProfile({
          store_name: data.store_name || '',
          store_description: data.store_description || '',
          store_image_url: data.store_image_url || ''
        });
      }
    };
    fetchStoreProfile();
  }, [user]);

  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setStoreProfile({ ...storeProfile, [e.target.name]: e.target.value });
  };

  const handleStoreSave = async () => {
    if (!user) return;
    if (!storeProfile.store_name) {
      setStoreMsg('Nama toko wajib diisi.');
      return;
    }
    setStoreLoading(true);
    setStoreMsg('');
    const { error } = await supabase
      .from('profiles')
      .update({
        store_name: storeProfile.store_name,
        store_description: storeProfile.store_description,
        store_image_url: storeProfile.store_image_url
      })
      .eq('id', user.id);
    setStoreLoading(false);
    if (error) {
      setStoreMsg('Gagal menyimpan profil toko.');
    } else {
      setStoreMsg('Profil toko berhasil disimpan!');
      setStoreEdit(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat data Anda...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Gagal memuat data. Silakan coba login kembali.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Toko Saya</h1>
            <p className="text-gray-600">Kelola produk hasil panen Anda di sini</p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => navigate('/add-product')}>
            <Plus className="h-4 w-4 mr-2" />Tambah Produk
          </Button>
        </div>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ImageIcon className="h-5 w-5 text-orange-600" />
              Profil Toko
            </CardTitle>
          </CardHeader>
          <CardContent>
            {storeEdit ? (
              <div className="space-y-3">
                <div>
                  <label className="block mb-1 font-medium">Nama Toko <span className="text-red-500">*</span></label>
                  <input type="text" name="store_name" className="w-full border rounded px-3 py-2" value={storeProfile.store_name} onChange={handleStoreChange} />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Deskripsi Toko</label>
                  <textarea name="store_description" className="w-full border rounded px-3 py-2" value={storeProfile.store_description} onChange={handleStoreChange} rows={3} />
                </div>
                <div>
                  <label className="block mb-1 font-medium">URL Foto Toko</label>
                  <input type="text" name="store_image_url" className="w-full border rounded px-3 py-2" value={storeProfile.store_image_url} onChange={handleStoreChange} placeholder="https://..." />
                </div>
                {storeMsg && <div className="text-sm text-orange-600">{storeMsg}</div>}
                <div className="flex gap-2">
                  <Button className="bg-orange-600 hover:bg-orange-700 w-full" onClick={handleStoreSave} disabled={storeLoading}>{storeLoading ? 'Menyimpan...' : 'Simpan'}</Button>
                  <Button variant="outline" className="w-full" onClick={() => { setStoreEdit(false); setStoreMsg(''); }}>Batal</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <img src={storeProfile.store_image_url || 'https://placehold.co/120x120?text=Toko'} alt="Foto Toko" className="w-28 h-28 object-cover rounded border" />
                <div className="flex-1">
                  <div className="text-xl font-bold mb-1">{storeProfile.store_name || <span className="text-gray-400">(Belum diatur)</span>}</div>
                  <div className="text-gray-600 mb-2 whitespace-pre-line">{storeProfile.store_description || <span className="text-gray-400">(Belum ada deskripsi)</span>}</div>
                  <Button variant="outline" onClick={() => setStoreEdit(true)}>Edit Profil Toko</Button>
                  {storeMsg && <div className="text-sm text-orange-600 mt-2">{storeMsg}</div>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsLoading ? (
            <p>Memuat produk...</p>
          ) : products.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-gray-500">Belum ada produk.</CardContent></Card>
          ) : (
            products.map(product => (
              <Card key={product.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-orange-600" />
                    {editId === product.id ? 'Edit Produk' : product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editId === product.id ? (
                    <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); handleEditSave(product.id); }}>
                      <input type="text" name="name" className="w-full border rounded px-2 py-1" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} placeholder="Nama Produk" />
                      <input type="number" name="price" className="w-full border rounded px-2 py-1" value={editData.price} onChange={(e) => setEditData({ ...editData, price: e.target.value })} placeholder="Harga" min="0" />
                      <input type="number" name="stock" className="w-full border rounded px-2 py-1" value={editData.stock} onChange={(e) => setEditData({ ...editData, stock: e.target.value })} placeholder="Stok" min="0" />
                      <input type="text" name="image" className="w-full border rounded px-2 py-1" value={editData.image} onChange={(e) => setEditData({ ...editData, image: e.target.value })} placeholder="URL Gambar" />
                      <textarea name="description" className="w-full border rounded px-2 py-1" value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} placeholder="Deskripsi"></textarea>
                      {error && <div className="text-red-600 text-sm">{error}</div>}
                      <div className="flex gap-2">
                        <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full">Simpan</Button>
                        <Button type="button" variant="outline" className="w-full" onClick={() => setEditId(null)}>Batal</Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <img src={product.image_url || 'https://placehold.co/400x300?text=Produk'} alt={product.name} className="w-full h-32 object-cover rounded mb-3" />
                      <div className="text-lg font-bold text-gray-800">Rp {product.price.toLocaleString()}</div>
                      <div className="text-sm text-gray-500 mb-2">Stok: {product.stock_quantity}</div>
                      <p className="text-sm text-gray-600 mb-4 h-10 overflow-hidden">{product.description}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" className="w-full mt-2 flex items-center justify-center gap-1" onClick={() => handleEdit(product)}><Pencil className="h-4 w-4" />Edit</Button>
                        <Button variant="destructive" className="w-full mt-2 flex items-center justify-center gap-1" onClick={() => handleDelete(product.id)}><Trash className="h-4 w-4" />Hapus</Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyStore; 