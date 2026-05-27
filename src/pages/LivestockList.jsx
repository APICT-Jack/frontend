import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LivestockList = () => {
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  });

  useEffect(() => {
    fetchLivestock();
  }, [filters]);

  const fetchLivestock = async () => {
    try {
      const params = new URLSearchParams(filters);
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

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Available Livestock</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <select name="type" onChange={handleFilterChange} className="border rounded p-2">
            <option value="">All Types</option>
            <option value="cattle">Cattle</option>
            <option value="sheep">Sheep</option>
            <option value="goat">Goat</option>
            <option value="pig">Pig</option>
            <option value="chicken">Chicken</option>
          </select>
          
          <input type="number" name="minPrice" placeholder="Min Price" onChange={handleFilterChange} className="border rounded p-2" />
          <input type="number" name="maxPrice" placeholder="Max Price" onChange={handleFilterChange} className="border rounded p-2" />
          <input type="text" name="location" placeholder="Location" onChange={handleFilterChange} className="border rounded p-2" />
        </div>
      </div>
      
      {/* Livestock Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {livestock.map((item) => (
          <Link to={`/livestock/${item._id}`} key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            {item.images[0] && (
              <img src={item.images[0]} alt={item.breed} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{item.breed}</h3>
              <p className="text-gray-600 mb-2">Type: {item.type}</p>
              <p className="text-gray-600 mb-2">Age: {item.age} {item.ageUnit}</p>
              <p className="text-2xl text-green-600 font-bold">${item.price}</p>
              <p className="text-sm text-gray-500 mt-2">{item.location}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {livestock.length === 0 && (
        <div className="text-center py-12 text-gray-500">No livestock found</div>
      )}
    </div>
  );
};

export default LivestockList;