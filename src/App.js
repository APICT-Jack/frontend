import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LivestockList from './pages/LivestockList';
import LivestockDetail from './pages/LivestockDetail';
import VehicleList from './pages/VehicleList';
import VehicleDetail from './pages/VehicleDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import Verification from './pages/Verification';
import AddLivestock from './pages/AddLivestock';
import AddVehicle from './pages/AddVehicle';
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