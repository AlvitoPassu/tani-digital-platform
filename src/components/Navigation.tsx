import { useState } from "react";
import { Search, ShoppingCart, User, Bell, Menu, Leaf, X, LogOut, Settings, Wrench } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "./NotificationProvider";

// Helper function to format time
const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " tahun lalu";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " bulan lalu";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " hari lalu";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " jam lalu";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " menit lalu";
  return Math.floor(seconds) + " detik lalu";
};

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useNotifications();

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600';
      case 'farmer': return 'text-green-600';
      case 'buyer': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-green-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-green-800">AgroMart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Beranda
            </Link>
            <button type="button" className="text-gray-700 hover:text-green-600 transition-colors">
              Kategori
            </button>
            <button type="button" className="text-gray-700 hover:text-green-600 transition-colors">
              Promo
            </button>
            {user && (
              <Link to="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors">
                AI Assistant
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative hidden md:flex">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80 p-0">
                    <div className="p-4 border-b">
                      <h4 className="text-base font-medium">Notifikasi</h4>
                    </div>
                    <div className="mt-2 space-y-2 max-h-80 overflow-y-auto p-2">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div key={notif.id} className="p-2 hover:bg-gray-100 rounded-md">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Bell className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{notif.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {notif.body}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {timeAgo(notif.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-sm text-gray-500 py-10">
                          Tidak ada notifikasi baru.
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                
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
                      <div className={`text-xs ${getRoleColor(profile?.role || '')}`}>
                        {profile ? getRoleLabel(profile.role) : ''}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    
                    {/* Role-specific menu items */}
                    {profile?.role === 'farmer' && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/farmer-tools" className="flex items-center">
                            <Wrench className="mr-2 h-4 w-4" />
                            Alat Petani
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    {profile?.role === 'admin' && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin-panel" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
                <Link to="/auth">
                  <Button className="bg-green-600 hover:bg-green-700">
                  Masuk
                  </Button>
                </Link>
            )}
            
            {/* Mobile menu button */}
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

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-green-200">
          <div className="px-4 py-2 space-y-2">
            <Link to="/" className="block py-2 text-gray-700 hover:text-green-600">Beranda</Link>
            <button type="button" className="block py-2 text-gray-700 hover:text-green-600 w-full text-left">Kategori</button>
            <button type="button" className="block py-2 text-gray-700 hover:text-green-600 w-full text-left">Promo</button>
            {user && (
              <>
                <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-green-600">AI Assistant</Link>
                {profile?.role === 'farmer' && (
                  <Link to="/farmer-tools" className="block py-2 text-gray-700 hover:text-green-600">Alat Petani</Link>
                )}
                {profile?.role === 'admin' && (
                  <Link to="/admin-panel" className="block py-2 text-gray-700 hover:text-green-600">Admin Panel</Link>
                )}
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
