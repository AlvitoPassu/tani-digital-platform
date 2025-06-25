import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, User, Users, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const Auth = () => {
  const [identifier, setIdentifier] = useState(""); // email only
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin'|'signup'>("signin");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(identifier) || !password) {
      toast({ title: "Form Tidak Lengkap", description: "Mohon isi email dan password", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await signIn(identifier, password);
      if (!error) navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(identifier) || !password || !name) {
      toast({ title: "Form Tidak Lengkap", description: "Mohon isi semua field yang diperlukan", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await signUp(identifier, password, name.trim(), role);
      if (!error) {
        setIdentifier(""); setPassword(""); setName(""); setRole("buyer");
      }
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">AgroMart</span>
          </div>
          <CardTitle className="text-xl">Masuk ke Akun Anda</CardTitle>
          <p className="text-sm text-muted-foreground">Masuk atau daftar untuk mengakses platform AgroMart</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full" onValueChange={v => { setMode(v as 'signin'|'signup'); }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Masuk</TabsTrigger>
              <TabsTrigger value="signup">Daftar</TabsTrigger>
            </TabsList>
            {/* SIGN IN */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-identifier">Email</Label>
                  <Input
                    id="signin-identifier"
                    type="email"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value.trim())}
                    required
                    placeholder="contoh@email.com"
                    autoComplete="username"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                  {loading ? "Memproses..." : "Masuk"}
                </Button>
                <p className="text-sm text-gray-600 text-center">Belum punya akun? Klik tab "Daftar" di atas.</p>
              </form>
            </TabsContent>
            {/* SIGN UP */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nama Lengkap</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Nama lengkap Anda"
                    autoComplete="name"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-identifier">Email</Label>
                  <Input
                    id="signup-identifier"
                    type="email"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value.trim())}
                    required
                    placeholder="contoh@email.com"
                    autoComplete="username"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    minLength={6}
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500">Minimal 6 karakter</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-select">Pilih Role Anda</Label>
                  <Select value={role} onValueChange={value => setRole(value as UserRole)} disabled={loading}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih role..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Pembeli - Membeli produk pertanian</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="farmer">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>Petani - Menjual produk pertanian</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="h-4 w-4" />
                          <span>Admin - Mengelola platform</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                  {loading ? "Memproses..." : "Daftar"}
                </Button>
                <p className="text-sm text-gray-600 text-center">Sudah punya akun? Klik tab "Masuk" di atas.</p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
