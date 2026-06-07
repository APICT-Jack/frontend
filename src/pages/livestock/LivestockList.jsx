import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaFilter, FaTimes, FaSlidersH } from 'react-icons/fa';
import { GiCow } from 'react-icons/gi';
import LivestockCard from './LivestockCard';
import './LivestockList.css';

// Import all background images directly
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

// Array of background images
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

const DEFAULT_BG = "https://images.pexels.com/photos/4825704/beautiful-shot-of-cattle-grazing-on-a-lush-green-field-under-a-cloudy-sky/pexels-photo-4825704.jpeg";
const SLIDESHOW_INTERVAL = 5000;

const LivestockList = () => {
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(BACKGROUND_IMAGES[0] || DEFAULT_BG);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    location: ''
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
    fetchLivestock();
  }, [filters]);

  const fetchLivestock = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.location) params.append('location', filters.location);
      
      const response = await axios.get(`http://localhost:5000/api/livestock?${params}`);
      setLivestock(response.data.livestock);
    } catch (error) {
      console.error('Error fetching livestock:', error);
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
      location: ''
    });
  };

  const hasActiveFilters = filters.type || filters.minPrice || filters.maxPrice || filters.location;

  return (
    <div 
      className="livestock-list-container"
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
      <div className="livestock-main-content">
        {/* Page Header */}
        <div className="page-header">
          <h1>Available Livestock</h1>
          <p>Find quality livestock from trusted sellers across South Africa</p>
        </div>

        {/* Sticky Filter Bar - Only Filter Component */}
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
                <option value="cattle">🐄 Cattle</option>
                <option value="sheep">🐑 Sheep</option>
                <option value="goat">🐐 Goat</option>
                <option value="pig">🐷 Pig</option>
                <option value="chicken">🐔 Chicken</option>
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
              <label>Animal Type</label>
              <select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="cattle">🐄 Cattle</option>
                <option value="sheep">🐑 Sheep</option>
                <option value="goat">🐐 Goat</option>
                <option value="pig">🐷 Pig</option>
                <option value="chicken">🐔 Chicken</option>
                <option value="horse">🐴 Horse</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="filter-group-expanded">
              <label>Min Price (ZAR)</label>
              <input 
                type="number" 
                name="minPrice" 
                value={filters.minPrice}
                placeholder="e.g., 5000" 
                onChange={handleFilterChange} 
              />
            </div>
            
            <div className="filter-group-expanded">
              <label>Max Price (ZAR)</label>
              <input 
                type="number" 
                name="maxPrice" 
                value={filters.maxPrice}
                placeholder="e.g., 50000" 
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
          Showing <strong>{livestock.length}</strong> {livestock.length === 1 ? 'listing' : 'listings'}
        </div>
        
        {/* Livestock Grid */}
        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="loading-card"></div>
            ))}
          </div>
        ) : livestock.length > 0 ? (
          <div className="livestock-grid">
            {livestock.map((item) => (
              <LivestockCard key={item._id} livestock={item} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <GiCow className="empty-icon" />
            <h3>No livestock found</h3>
            <p>Try adjusting your filters or check back later for new listings</p>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivestockList;