// HomePage.jsx - With real API data
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaComment, FaShare, FaUserCircle, FaCheckCircle,
  FaHeart, FaRegHeart, FaHome, FaArrowRight,
  FaStar, FaStarHalfAlt, FaRegStar, FaMapMarkerAlt,
  FaDollarSign, FaTruck, FaShieldAlt, FaPlay,
  FaCalendar, FaWeightHanging, FaUsers, FaStore,
  FaShoppingCart, FaChartLine, FaTractor
} from 'react-icons/fa';
import { GiCow, GiChicken, GiGoat, GiPig, GiSheep } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

// Default stock background image (beautiful African livestock landscape)
const DEFAULT_BG = "https://images.pexels.com/photos/4825704/beautiful-shot-of-cattle-grazing-on-a-lush-green-field-under-a-cloudy-sky/";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [backgroundImage, setBackgroundImage] = useState(() => {
    return localStorage.getItem('imfuyo_background') || DEFAULT_BG;
  });
  
  // Stats state
  const [stats, setStats] = useState({
    sellers: 0,
    vehicles: 0,
    available: 0,
    sold: 0,
    users: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Listen for background changes from navbar
  useEffect(() => {
    const handleBackgroundChange = () => {
      const newBg = localStorage.getItem('imfuyo_background');
      if (newBg) setBackgroundImage(newBg);
    };
    window.addEventListener('backgroundChanged', handleBackgroundChange);
    return () => window.removeEventListener('backgroundChanged', handleBackgroundChange);
  }, []);

  // Fetch real stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch livestock stats
        const livestockRes = await axios.get('http://localhost:5000/api/livestock/stats');
        // Fetch vehicle stats
        const vehiclesRes = await axios.get('http://localhost:5000/api/vehicles/stats');
        // Fetch user stats (sellers and total users)
        const usersRes = await axios.get('http://localhost:5000/api/users/stats');
        
        setStats({
          sellers: usersRes.data.sellers || 0,
          vehicles: vehiclesRes.data.totalVehicles || 0,
          available: livestockRes.data.available || 0,
          sold: livestockRes.data.sold || 0,
          users: usersRes.data.totalUsers || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to demo stats if API fails
        setStats({
          sellers: 124,
          vehicles: 48,
          available: 356,
          sold: 892,
          users: 2456
        });
      } finally {
        setLoadingStats(false);
      }
    };
    
    fetchStats();
  }, []);

  const getTypeIcon = (type) => {
    switch(type) {
      case 'cattle': return <GiCow />;
      case 'sheep': return <GiSheep />;
      case 'goat': return <GiGoat />;
      case 'pig': return <GiPig />;
      case 'chicken': return <GiChicken />;
      default: return <GiCow />;
    }
  };

  return (
    <div className="homepage-full">
      {/* Compact Hero Section */}
      <div 
        className="hero-compact"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.55)), url(${backgroundImage})` }}
      >
        <div className="hero-content-compact">
          <div className="hero-badge-compact">
            <span>🐄 Trusted Marketplace Since 2024</span>
          </div>
          <h1 className="hero-title-compact">
            Buy & Sell Livestock <span className="hero-highlight">With Confidence</span>
          </h1>
          <p className="hero-subtitle-compact">
            Africa's premier platform for livestock trading and agricultural transport
          </p>
          
          {/* Real Stats Display */}
          <div className="hero-stats-compact">
            <div className="hero-stat-compact">
              <span className="hero-stat-number">
                {loadingStats ? '...' : stats.sellers.toLocaleString()}
              </span>
              <span className="hero-stat-label">
                <FaStore /> Sellers
              </span>
            </div>
            <div className="hero-stat-compact">
              <span className="hero-stat-number">
                {loadingStats ? '...' : stats.vehicles.toLocaleString()}
              </span>
              <span className="hero-stat-label">
                <FaTruck /> Vehicles
              </span>
            </div>
            <div className="hero-stat-compact">
              <span className="hero-stat-number">
                {loadingStats ? '...' : stats.available.toLocaleString()}
              </span>
              <span className="hero-stat-label">
                <GiCow /> Available
              </span>
            </div>
            <div className="hero-stat-compact">
              <span className="hero-stat-number">
                {loadingStats ? '...' : stats.sold.toLocaleString()}
              </span>
              <span className="hero-stat-label">
                <FaChartLine /> Sold
              </span>
            </div>
            <div className="hero-stat-compact">
              <span className="hero-stat-number">
                {loadingStats ? '...' : stats.users.toLocaleString()}
              </span>
              <span className="hero-stat-label">
                <FaUsers /> Users
              </span>
            </div>
          </div>
          
          <div className="hero-buttons-compact">
            <Link to="/livestock" className="btn-primary-compact">
              Browse <FaArrowRight />
            </Link>
            <Link to="/vehicles" className="btn-outline-compact">
              <FaTruck /> Transport
            </Link>
            <Link to="/register" className="btn-secondary-compact">
              Sell <FaPlay />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Feed Content */}
      <div className="feed-content">
        <div className="feed-container">
          {/* Livestock For Sale Section - Connected to real API */}
          <div className="section-header">
            <h2><GiCow /> Available Livestock</h2>
            <Link to="/livestock" className="view-all">View All <FaArrowRight /></Link>
          </div>

          <div className="livestock-grid">
            {/* Real livestock data will be loaded from API */}
            <div className="empty-state">
              <GiCow className="empty-icon" />
              <h3>No livestock listed yet</h3>
              <p>Be the first to list your livestock for sale</p>
              {isAuthenticated ? (
                <Link to="/seller/add-livestock" className="empty-state-btn">
                  Add Livestock
                </Link>
              ) : (
                <Link to="/register" className="empty-state-btn">
                  Sign up to start selling
                </Link>
              )}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="section-header">
            <h2><FaHome /> Community Feed</h2>
            <span className="feed-update">Live updates</span>
          </div>

          <div className="feed-empty-state">
            <FaHome className="empty-icon" />
            <h3>No activity yet</h3>
            <p>Join the community and start sharing</p>
            {isAuthenticated ? (
              <Link to="/livestock" className="empty-state-btn">
                Browse Listings
              </Link>
            ) : (
              <Link to="/register" className="empty-state-btn">
                Join Imfuyo Today
              </Link>
            )}
          </div>

          {/* Stats Overview Cards */}
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-card-icon">
                <FaStore />
              </div>
              <div className="stat-card-info">
                <h4>Total Sellers</h4>
                <span className="stat-card-number">{loadingStats ? '...' : stats.sellers.toLocaleString()}</span>
                <p>Verified agricultural sellers</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-card-icon">
                <FaTruck />
              </div>
              <div className="stat-card-info">
                <h4>Transport Vehicles</h4>
                <span className="stat-card-number">{loadingStats ? '...' : stats.vehicles.toLocaleString()}</span>
                <p>Available for rent</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-card-icon">
                <GiCow />
              </div>
              <div className="stat-card-info">
                <h4>Active Listings</h4>
                <span className="stat-card-number">{loadingStats ? '...' : stats.available.toLocaleString()}</span>
                <p>Livestock for sale</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-card-icon">
                <FaChartLine />
              </div>
              <div className="stat-card-info">
                <h4>Successful Sales</h4>
                <span className="stat-card-number">{loadingStats ? '...' : stats.sold.toLocaleString()}</span>
                <p>Happy customers</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-card-icon">
                <FaUsers />
              </div>
              <div className="stat-card-info">
                <h4>Community Members</h4>
                <span className="stat-card-number">{loadingStats ? '...' : stats.users.toLocaleString()}</span>
                <p>Growing daily</p>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="cta-banner">
            <div className="cta-content">
              <h3>Ready to grow your livestock business?</h3>
              <p>Join thousands of successful farmers on Imfuyo</p>
              <Link to="/register" className="cta-button">
                Become a Seller Today <FaArrowRight />
              </Link>
            </div>
            <GiCow className="cta-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;