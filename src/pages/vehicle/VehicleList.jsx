import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSlidersH, FaTimes, FaTruck } from 'react-icons/fa';
import VehicleCard from './VehicleCard';
import './VehicleList.css';

// Reuse the same backgrounds from LivestockList
import chickenBg from '.././Backgrounds/chicken.jpg';
import cow1Bg from '.././Backgrounds/cow1.jpg';
import cow2Bg from '.././Backgrounds/cow2.jpg';
import cowsBg from '.././Backgrounds/cows.jpg';
import dairyBg from '.././Backgrounds/dairy.jpg';
import goatBg from '.././Backgrounds/goat.jpg';
import pigBg from '.././Backgrounds/pig.jpg';
import roosterBg from '.././Backgrounds/rooster.jpg';
import sheepBg from '.././Backgrounds/sheep.jpg';
import wildlifeBg from '.././Backgrounds/wildlife.jpg';

// Reuse existing background images
const BACKGROUND_IMAGES = [
  chickenBg,
  cow1Bg,
  cow2Bg,
  cowsBg,
  dairyBg,
  goatBg,
  pigBg,
  roosterBg,
  sheepBg,
  wildlifeBg
];

const DEFAULT_BG = "https://images.pexels.com/photos/987586/pexels-photo-987586.jpeg";
const SLIDESHOW_INTERVAL = 5000;


const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(BACKGROUND_IMAGES[0] || DEFAULT_BG);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    available: ''
  });

  // Automatic background slideshow
  useEffect(() => {
    if (BACKGROUND_IMAGES[0]) {
      setBackgroundImage(BACKGROUND_IMAGES[0]);
    }
    
    const intervalId = setInterval(() => {
      setCurrentBackgroundIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % BACKGROUND_IMAGES.length;
        if (BACKGROUND_IMAGES[nextIndex]) {
          setBackgroundImage(BACKGROUND_IMAGES[nextIndex]);
        }
        return nextIndex;
      });
    }, SLIDESHOW_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.location) params.append('location', filters.location);
      if (filters.available) params.append('available', filters.available);
      
      const response = await axios.get(`http://localhost:5000/api/vehicles?${params}`);
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      available: ''
    });
  };

  const hasActiveFilters = filters.type || filters.minPrice || filters.maxPrice || filters.location || filters.available;

  return (
    <div 
      className="vehicle-list-container"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better readability */}
      <div className="background-overlay"></div>
      
      {/* Main Content */}
      <div className="vehicle-main-content">
        {/* Page Header */}
        <div className="page-header">
          <h1>Transport Vehicles for Rent</h1>
          <p>Find reliable livestock transport vehicles from trusted owners across South Africa</p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky-filter-bar">
          <div className="sticky-filter-content">
            <div className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              <FaSlidersH />
              <span>Filters</span>
              {hasActiveFilters && <span className="filter-badge">{Object.values(filters).filter(f => f).length}</span>}
            </div>
            
            <div className="sticky-filter-group">
              <select 
                name="type" 
                value={filters.type} 
                onChange={handleFilterChange}
                className="sticky-filter-select"
              >
                <option value="">All Types</option>
                <option value="truck">🚚 Truck</option>
                <option value="trailer">🚛 Trailer</option>
                <option value="van">🚐 Van</option>
                <option value="pickup">🛻 Pickup</option>
                <option value="other">🚛 Other</option>
              </select>
            </div>
            
            <div className="sticky-filter-group">
              <select 
                name="available" 
                value={filters.available} 
                onChange={handleFilterChange}
                className="sticky-filter-select"
              >
                <option value="">All Status</option>
                <option value="true">✅ Available Only</option>
                <option value="false">⏳ On Duty Only</option>
              </select>
            </div>
            
            <div className="sticky-filter-group">
              <input 
                type="text" 
                name="location" 
                value={filters.location}
                placeholder="Location" 
                onChange={handleFilterChange}
                className="sticky-filter-input"
              />
            </div>
            
            <div className="sticky-filter-group price-group">
              <input 
                type="number" 
                name="minPrice" 
                value={filters.minPrice}
                placeholder="Min Price" 
                onChange={handleFilterChange}
                className="sticky-filter-input price-input"
              />
              <span>-</span>
              <input 
                type="number" 
                name="maxPrice" 
                value={filters.maxPrice}
                placeholder="Max Price" 
                onChange={handleFilterChange}
                className="sticky-filter-input price-input"
              />
            </div>
            
            {hasActiveFilters && (
              <button onClick={clearFilters} className="sticky-clear-btn">
                <FaTimes /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Expanded Filters Panel */}
        <div className={`expanded-filters ${showFilters ? 'visible' : ''}`}>
          <div className="expanded-filters-content">
            <div className="filter-group-expanded">
              <label>Vehicle Type</label>
              <select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="truck">🚚 Truck</option>
                <option value="trailer">🚛 Trailer</option>
                <option value="van">🚐 Van</option>
                <option value="pickup">🛻 Pickup</option>
                <option value="other">🚛 Other</option>
              </select>
            </div>
            
            <div className="filter-group-expanded">
              <label>Availability</label>
              <select name="available" value={filters.available} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="true">Available</option>
                <option value="false">On Duty / Rented</option>
              </select>
            </div>
            
            <div className="filter-group-expanded">
              <label>Min Price per Day (ZAR)</label>
              <input 
                type="number" 
                name="minPrice" 
                value={filters.minPrice}
                placeholder="e.g., 1000" 
                onChange={handleFilterChange} 
              />
            </div>
            
            <div className="filter-group-expanded">
              <label>Max Price per Day (ZAR)</label>
              <input 
                type="number" 
                name="maxPrice" 
                value={filters.maxPrice}
                placeholder="e.g., 10000" 
                onChange={handleFilterChange} 
              />
            </div>
            
            <div className="filter-group-expanded">
              <label>Location</label>
              <input 
                type="text" 
                name="location" 
                value={filters.location}
                placeholder="City or Province" 
                onChange={handleFilterChange} 
              />
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="results-count">
          Showing <strong>{vehicles.length}</strong> {vehicles.length === 1 ? 'vehicle' : 'vehicles'}
        </div>
        
        {/* Vehicles Grid - Using compact VehicleCard */}
        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="loading-card"></div>
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          <div className="vehicles-grid">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FaTruck className="empty-icon" />
            <h3>No vehicles found</h3>
            <p>Try adjusting your filters or check back later for new vehicle listings</p>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleList;