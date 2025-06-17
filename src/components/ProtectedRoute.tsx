
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuth = true }) => {
  const { user, session, loading } = useAuth();

  console.log('ProtectedRoute check:', { 
    user: !!user, 
    session: !!session, 
    loading, 
    requireAuth,
    userEmail: user?.email 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-sm text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // For pages that require authentication
  if (requireAuth && (!user || !session)) {
    console.log('Redirecting to auth - no user or session');
    return <Navigate to="/auth" replace />;
  }

  // For pages that should redirect if user is already logged in (like /auth)
  if (!requireAuth && user && session) {
    console.log('Redirecting to home - user already logged in');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
