import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AIAssistantDashboard from "./pages/AIAssistantDashboard";
import FarmerTools from "./pages/FarmerTools";
import AdminPanel from "./pages/AdminPanel";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import SearchResults from "./pages/SearchResults";
import Checkout from "./pages/Checkout";
import CategoryDashboard from "./pages/CategoryDashboard";
import Products from "./pages/Products";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/farmer-dashboard" 
              element={
                <ProtectedRoute requireAuth={true} requiredRole="farmer">
                  <FarmerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/buyer-dashboard" 
              element={
                <ProtectedRoute requireAuth={true} requiredRole="buyer">
                  <BuyerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute requireAuth={true} requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai-assistant" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <AIAssistantDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/farmer-tools" 
              element={
                <ProtectedRoute requireAuth={true} requiredRole="farmer">
                  <FarmerTools />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-panel" 
              element={
                <ProtectedRoute requireAuth={true} requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Cart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Auth />
                </ProtectedRoute>
              } 
            />
            <Route path="/search" element={<SearchResults />} />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/kategori" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <CategoryDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/products" element={<Products />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
