import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LivestockList from './pages/livestock/LivestockList';
import LivestockDetail from './pages/livestock/LivestockDetail';
import VehicleList from './pages/vehicle/VehicleList';
import VehicleDetail from './pages/vehicle/VehicleDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SellerDashboard from './pages/seller_dashboard/SellerDashboard';
import Verification from './pages/verification/Verification';
import AddLivestock from './pages/seller_dashboard/AddLivestock';
import AddVehicle from './pages/seller_dashboard/AddVehicle';
import EditVehicle from './pages/seller_dashboard/EditVehicle';  // ADD THIS IMPORT
import EditLivestock from './pages/seller_dashboard/EditLivestock';  // ADD THIS IMPORT
import ProtectedRoute from './components/ProtectedRoute';
import './styles/main.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/livestock" element={<LivestockList />} />
              <Route path="/livestock/:id" element={<LivestockDetail />} />
              <Route path="/vehicles" element={<VehicleList />} />
              <Route path="/vehicles/:id" element={<VehicleDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Edit Routes */}
              <Route path="/seller/edit-vehicle/:id" element={
                <ProtectedRoute role="seller" requireVerified={false}>
                  <EditVehicle />
                </ProtectedRoute>
              } />
              <Route path="/seller/edit-livestock/:id" element={
                <ProtectedRoute role="seller" requireVerified={false}>
                  <EditLivestock />
                </ProtectedRoute>
              } />
              
              <Route path="/seller/dashboard" element={
                <ProtectedRoute role="seller">
                  <SellerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/seller/verify" element={
                <ProtectedRoute role="seller">
                  <Verification />
                </ProtectedRoute>
              } />
              
              <Route path="/seller/add-livestock" element={
                <ProtectedRoute role="seller" requireVerified={true}>
                  <AddLivestock />
                </ProtectedRoute>
              } />
              
              <Route path="/seller/add-vehicle" element={
                <ProtectedRoute role="seller" requireVerified={true}>
                  <AddVehicle />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;