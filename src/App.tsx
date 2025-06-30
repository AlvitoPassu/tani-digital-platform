import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import { NotificationProvider } from "./components/NotificationProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <NotificationProvider>
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
                path="/farmer-tools" 
                element={
                  <ProtectedRoute requireAuth={true} requiredRole="farmer">
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-panel" 
                element={
                  <ProtectedRoute requireAuth={true} requiredRole="admin">
                    <Dashboard />
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
                path="/checkout" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Checkout />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
