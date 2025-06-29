import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const paymentMethods = [
  { value: 'bank', label: 'Transfer Bank' },
  { value: 'cod', label: 'Cash on Delivery (COD)' },
  { value: 'ewallet', label: 'E-Wallet' },
];

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('bank');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !payment) {
      toast({
        title: 'Lengkapi Data',
        description: 'Semua field wajib diisi',
        variant: 'destructive',
      });
      return;
    }
    if (cartItems.length === 0) {
      toast({
        title: 'Keranjang Kosong',
        description: 'Tidak ada produk di keranjang',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      clearCart(true);
      toast({
        title: 'Pembayaran Berhasil',
        description: 'Terima kasih! Pesanan Anda sedang diproses.',
      });
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-green-700">Checkout & Pembayaran</h1>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-semibold mb-4">Data Pengiriman</h2>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Nama Penerima</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nama lengkap" required />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Alamat Pengiriman</label>
              <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Alamat lengkap" required />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Metode Pembayaran</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={payment}
                onChange={e => setPayment(e.target.value)}
                required
              >
                {paymentMethods.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? 'Memproses Pembayaran...' : 'Bayar Sekarang'}
            </Button>
          </div>
          <div>
            <h2 className="font-semibold mb-4">Ringkasan Pesanan</h2>
            <div className="space-y-4 mb-4">
              {cartItems.length === 0 ? (
                <div className="text-gray-500">Keranjang kosong</div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-xs text-gray-500">x{item.quantity} {item.product.unit}</div>
                    </div>
                    <div className="text-green-700 font-semibold">
                      Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between items-center border-t pt-4 mt-4">
              <div className="font-bold text-lg">Total</div>
              <div className="text-xl font-bold text-green-700">Rp{totalPrice.toLocaleString('id-ID')}</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout; 