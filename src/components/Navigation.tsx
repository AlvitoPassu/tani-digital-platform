
import { useState } from "react";
import { Search, ShoppingCart, User, Bell, Menu, Leaf, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'farmer': return 'Petani';
      case 'buyer': return 'Pembeli';
      default: return 'User';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-50 border-b border-green-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">AgroMart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">Beranda</Link>
            <button type="button" className="text-gray-700 hover:text-green-600 transition-colors">Kategori</button>
            <button type="button" className="text-gray-700 hover:text-green-600 transition-colors">Promo</button>
            {user && (
              <Link to="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors">AI Assistant</Link>
            )}
            <button type="button" className="text-gray-700 hover:text-green-600 transition-colors">Bantuan</button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Bell className="h-5 w-5" />
                </Button>
                
                {/* Cart Button - Available for all users */}
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">{profile?.name || 'User'}</div>
                      <div className="text-muted-foreground">{user.email}</div>
                      <div className="text-xs text-green-600">{profile ? getRoleLabel(profile.role) : ''}</div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Cart Button for non-logged in users - redirects to auth */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  onClick={() => navigate("/auth")}
                >
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                
                <Link to="/auth">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Masuk / Daftar
                  </Button>
                </Link>
              </>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-green-200">
          <div className="px-4 py-2 space-y-2">
            <Link to="/" className="block py-2 text-gray-700 hover:text-green-600">Beranda</Link>
            <button type="button" className="block py-2 text-gray-700 hover:text-green-600 w-full text-left">Kategori</button>
            <button type="button" className="block py-2 text-gray-700 hover:text-green-600 w-full text-left">Promo</button>
            {user && (
              <>
                <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-green-600">AI Assistant</Link>
                <Link to="/cart" className="block py-2 text-gray-700 hover:text-green-600">
                  Keranjang {totalItems > 0 && `(${totalItems})`}
                </Link>
              </>
            )}
            <button type="button" className="block py-2 text-gray-700 hover:text-green-600 w-full text-left">Bantuan</button>
            {user && (
              <button onClick={handleSignOut} className="block py-2 text-red-600 hover:text-red-700 w-full text-left">
                Keluar
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
