import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import FarmerDashboard from './FarmerDashboard';
import BuyerDashboard from './BuyerDashboard';
import AdminPanel from './AdminPanel';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Akses Ditolak</h1>
          <p className="text-gray-600">Silakan login terlebih dahulu</p>
        </div>
      </div>
    );
  }

  // Render dashboard berdasarkan role
  switch (user.role) {
    case 'farmer':
      return <FarmerDashboard />;
    case 'buyer':
      return <BuyerDashboard />;
    case 'admin':
      return <AdminPanel />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Role Tidak Dikenal</h1>
            <p className="text-gray-600">Role user tidak valid</p>
          </div>
        </div>
      );
  }
};

export default Dashboard; 