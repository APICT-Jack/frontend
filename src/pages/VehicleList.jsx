import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt } from 'react-icons/fa';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async () => {
    try {
      const params = new URLSearchParams(filters);
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

  if (loading) {
    return <div className="text-center py-12">Loading vehicles...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Available Vehicles for Rent</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <select name="type" onChange={handleFilterChange} className="border rounded p-2">
            <option value="">All Types</option>
            <option value="truck">Truck</option>
            <option value="trailer">Trailer</option>
            <option value="van">Van</option>
            <option value="pickup">Pickup</option>
            <option value="other">Other</option>
          </select>
          
          <input 
            type="number" 
            name="minPrice" 
            placeholder="Min Price/Day" 
            onChange={handleFilterChange} 
            className="border rounded p-2" 
          />
          <input 
            type="number" 
            name="maxPrice" 
            placeholder="Max Price/Day" 
            onChange={handleFilterChange} 
            className="border rounded p-2" 
          />
          <input 
            type="text" 
            name="location" 
            placeholder="Location" 
            onChange={handleFilterChange} 
            className="border rounded p-2" 
          />
        </div>
      </div>
      
      {/* Vehicles Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Link to={`/vehicles/${vehicle._id}`} key={vehicle._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            {vehicle.images && vehicle.images[0] && (
              <img src={vehicle.images[0]} alt={vehicle.model} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{vehicle.model}</h3>
              <p className="text-gray-600 mb-2 capitalize">Type: {vehicle.type}</p>
              <p className="text-gray-600 mb-2">Capacity: {vehicle.capacity}</p>
              <p className="text-2xl text-green-600 font-bold">${vehicle.pricePerDay}/day</p>
              <div className="flex items-center text-gray-500 text-sm mt-2">
                <FaMapMarkerAlt className="mr-1" />
                <span>{vehicle.location}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {vehicles.length === 0 && (
        <div className="text-center py-12 text-gray-500">No vehicles found</div>
      )}
    </div>
  );
};

export default VehicleList;