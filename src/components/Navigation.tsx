
import { useState } from "react";
import { Search, ShoppingCart, User, Bell, Menu, Leaf, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-50 border-b border-green-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">AgroMart</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Beranda</a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Kategori</a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Promo</a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Bantuan</a>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            
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
            <a href="#" className="block py-2 text-gray-700 hover:text-green-600">Beranda</a>
            <a href="#" className="block py-2 text-gray-700 hover:text-green-600">Kategori</a>
            <a href="#" className="block py-2 text-gray-700 hover:text-green-600">Promo</a>
            <a href="#" className="block py-2 text-gray-700 hover:text-green-600">Bantuan</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
