import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role, requireVerified = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }
  
  if (requireVerified && (!user.isVerified || user.verificationStatus !== 'approved')) {
    return <Navigate to="/seller/verify" />;
  }
  
  return children;
};

export default ProtectedRoute;