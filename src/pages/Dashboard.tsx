import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, ShoppingCart, Shield } from "lucide-react";

const Dashboard = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && profile) {
      // Redirect to specific dashboard based on role
      switch (profile.role) {
        case 'farmer':
          navigate('/farmer-dashboard');
          break;
        case 'buyer':
          navigate('/buyer-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          // Stay on this page for unknown roles
          break;
      }
    }
  }, [profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access your dashboard</p>
          <Button onClick={() => navigate('/auth')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to Tani Digital Platform! 🌾
            </h1>
            <p className="text-gray-600">
              Choose your dashboard or access AI Assistant
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Role-based Dashboard */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {profile.role === 'farmer' && <Users className="h-5 w-5 text-green-600" />}
                  {profile.role === 'buyer' && <ShoppingCart className="h-5 w-5 text-blue-600" />}
                  {profile.role === 'admin' && <Shield className="h-5 w-5 text-purple-600" />}
                  {profile.role} Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Access your personalized dashboard with features tailored for your role.
                </p>
                <Button 
                  className="w-full"
                  onClick={() => {
                    switch (profile.role) {
                      case 'farmer':
                        navigate('/farmer-dashboard');
                        break;
                      case 'buyer':
                        navigate('/buyer-dashboard');
                        break;
                      case 'admin':
                        navigate('/admin-dashboard');
                        break;
                      default:
                        // fallback
                        break;
                    }
                  }}
                >
                  Go to {profile.role} Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* AI Assistant Dashboard */}
            <Card className="hover:shadow-lg transition-all duration-300 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  AI Assistant Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Access all AI features including Chat Assistant, Vision AI, Crop Planner, and Gemini Assistant.
                </p>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => navigate('/ai-assistant')}
                >
                  Open AI Assistant
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => navigate('/')}
                >
                  <span>🏠</span>
                  <span className="text-sm">Home</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => navigate('/cart')}
                >
                  <span>🛒</span>
                  <span className="text-sm">Shopping Cart</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => navigate('/search')}
                >
                  <span>🔍</span>
                  <span className="text-sm">Search Products</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 