import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaPaw, FaTruck, FaCheckCircle, FaClock } from 'react-icons/fa';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const { user, token } = useAuth();
  const [listings, setListings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      // Fetch user's livestock listings
      const livestockRes = await axios.get('http://localhost:5000/api/livestock?seller=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setListings(livestockRes.data.livestock || []);
      
      // Fetch user's vehicle listings
      const vehiclesRes = await axios.get('http://localhost:5000/api/vehicles?owner=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setVehicles(vehiclesRes.data.vehicles || []);
    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Seller Dashboard</h1>
        <div className="dashboard-actions">
          <Link to="/seller/add-livestock" className="btn-primary">
            <FaPlus /> Add Livestock
          </Link>
          <Link to="/seller/add-vehicle" className="btn-secondary">
            <FaPlus /> Add Vehicle
          </Link>
        </div>
      </div>
      
      {/* Verification Status */}
      <div className="verification-card">
        <h2 className="section-title">Verification Status</h2>
        {user?.isVerified ? (
          <div className="verification-status status-verified">
            <FaCheckCircle />
            <span>Your account is verified. You can now list items for sale.</span>
          </div>
        ) : (
          <div className="verification-status status-pending">
            <FaClock />
            <span>
              Your account is pending verification. 
              <Link to="/seller/verify" className="login-link"> Complete verification here</Link>
            </span>
          </div>
        )}
      </div>
      
      {/* Livestock Listings */}
      <div>
        <h2 className="section-title">
          <FaPaw /> My Livestock Listings ({listings.length})
        </h2>
        <div className="grid-3">
          {listings.map(item => (
            <div key={item._id} className="card">
              {item.images && item.images[0] && (
                <img src={item.images[0]} alt={item.breed} className="livestock-image" />
              )}
              <div className="livestock-info">
                <h3 className="livestock-breed">{item.breed}</h3>
                <p className="livestock-price">${item.price}</p>
                <span className={`status-badge ${item.status === 'available' ? 'status-available' : 'status-sold'}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        {listings.length === 0 && (
          <div className="empty-state">
            <p>No livestock listings yet. Click "Add Livestock" to get started.</p>
          </div>
        )}
      </div>
      
      {/* Vehicle Listings */}
      <div style={{ marginTop: '40px' }}>
        <h2 className="section-title">
          <FaTruck /> My Vehicle Listings ({vehicles.length})
        </h2>
        <div className="grid-3">
          {vehicles.map(vehicle => (
            <div key={vehicle._id} className="card">
              {vehicle.images && vehicle.images[0] && (
                <img src={vehicle.images[0]} alt={vehicle.model} className="livestock-image" />
              )}
              <div className="livestock-info">
                <h3 className="livestock-breed">{vehicle.model}</h3>
                <p className="livestock-price">${vehicle.pricePerDay}/day</p>
                <span className={`status-badge ${vehicle.available ? 'status-available' : 'status-sold'}`}>
                  {vehicle.available ? 'Available' : 'Rented'}
                </span>
              </div>
            </div>
          ))}
        </div>
        {vehicles.length === 0 && (
          <div className="empty-state">
            <p>No vehicle listings yet. Click "Add Vehicle" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;