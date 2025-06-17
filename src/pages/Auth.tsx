
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

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Form Tidak Lengkap",
        description: "Mohon isi email dan password",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Email Tidak Valid",
        description: "Mohon masukkan alamat email yang valid",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    console.log('Starting sign in process for:', email);
    
    try {
      const { error } = await signIn(email, password);
      
      if (!error) {
        console.log('Sign in successful, navigating to home');
        navigate("/");
      } else {
        console.log('Sign in failed:', error);
      }
    } catch (err) {
      console.error("Sign in error:", err);
      toast({
        title: "Error",
        description: "Terjadi kesalahan yang tidak terduga",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast({
        title: "Form Tidak Lengkap",
        description: "Mohon isi semua field yang diperlukan",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Email Tidak Valid",
        description: "Mohon masukkan alamat email yang valid",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Password Terlalu Pendek",
        description: "Password harus minimal 6 karakter",
        variant: "destructive"
      });
      return;
    }

    if (name.trim().length < 2) {
      toast({
        title: "Nama Terlalu Pendek",
        description: "Nama harus minimal 2 karakter",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    console.log('Starting sign up process for:', email);
    
    try {
      const { error } = await signUp(email, password, name.trim(), role);
      
      if (!error) {
        console.log('Sign up successful');
        // Reset form
        setEmail("");
        setPassword("");
        setName("");
        setRole("buyer");
      } else {
        console.log('Sign up failed:', error);
      }
    } catch (err) {
      console.error("Sign up error:", err);
      toast({
        title: "Error",
        description: "Terjadi kesalahan yang tidak terduga",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">AgroMart</span>
          </div>
          <CardTitle className="text-xl">Masuk ke Akun Anda</CardTitle>
          <p className="text-sm text-muted-foreground">
            Masuk atau daftar untuk mengakses platform AgroMart
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Masuk</TabsTrigger>
              <TabsTrigger value="signup">Daftar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    required
                    placeholder="contoh@email.com"
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Masuk"}
                </Button>
                
                <p className="text-sm text-gray-600 text-center">
                  Belum punya akun? Klik tab "Daftar" di atas.
                </p>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nama Lengkap</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Nama lengkap Anda"
                    autoComplete="name"
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    required
                    placeholder="contoh@email.com"
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <Select value={role} onValueChange={(value) => setRole(value as UserRole)} disabled={loading}>
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
                
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Daftar"}
                </Button>
                
                <p className="text-sm text-gray-600 text-center">
                  Sudah punya akun? Klik tab "Masuk" di atas.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
