import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { shippingService } from "@/services/shipping/shipping-service";
import { ShippingCost } from "@/services/shipping/types";
import { useEffect, useState } from "react";

export default function Checkout() {
  const { cartItems, totalPrice } = useCart();
  const [shippingCosts, setShippingCosts] = useState<ShippingCost[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingCost | null>(null);

  useEffect(() => {
    const fetchShippingRates = async () => {
      // Hardcoded for now, should be dynamic based on user address/profile
      const params = {
        origin: "501", // Jakarta
        destination: "114", // Bandung
        weight: 1000, // 1kg
      };
      try {
        const rates = await shippingService.getAllAvailableRates(params);
        setShippingCosts(rates);
        if (rates.length > 0) {
          setSelectedShipping(rates[0]);
        }
      } catch (error) {
        console.error("Failed to fetch shipping rates:", error);
      }
    };

    fetchShippingRates();
  }, []);

  const handleShippingChange = (value: string) => {
    const selected = shippingCosts.find(
      (cost) => `${cost.courier}-${cost.service}` === value
    ) || null;
    setSelectedShipping(selected);
  };

  const grandTotal = totalPrice + (selectedShipping?.cost || 0);

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Alamat Pengiriman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">Nama Depan</Label>
                  <Input id="first-name" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Nama Belakang</Label>
                  <Input id="last-name" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" placeholder="123 Main St" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Kota</Label>
                  <Input id="city" placeholder="Bandung" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">Kode Pos</Label>
                  <Input id="zip" placeholder="40111" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Pilihan Pengiriman</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedShipping ? `${selectedShipping.courier}-${selectedShipping.service}` : ''}
                onValueChange={handleShippingChange}
                className="space-y-2"
              >
                {shippingCosts.map((cost) => (
                  <Label
                    key={`${cost.courier}-${cost.service}`}
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted"
                  >
                    <div>
                      <span className="font-semibold uppercase">{cost.courier}</span> - {cost.service} ({cost.description})
                      <p className="text-sm text-muted-foreground">Estimasi {cost.etd} hari</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(cost.cost)}
                      </p>
                    </div>
                     <RadioGroupItem value={`${cost.courier}-${cost.service}`} className="sr-only" />
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(item.product.price)}
                    </p>
                  </div>
                  <p>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(totalPrice)}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Pengiriman</p>
                <p>
                  {selectedShipping
                    ? new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(selectedShipping.cost)
                    : "Pilih kurir"}
                </p>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(grandTotal)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-8">
              <CardHeader>
                  <CardTitle>Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                  {/* Placeholder for payment gateway integration */}
                  <div className="p-4 border-dashed border-2 rounded-lg text-center text-muted-foreground">
                      Integrasi Midtrans akan ditambahkan di sini
                  </div>
              </CardContent>
          </Card>
          <Button className="w-full mt-6">Selesaikan Pesanan</Button>
        </div>
      </div>
    </div>
  );
} 