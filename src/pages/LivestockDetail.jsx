import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendar, FaWeightHanging, FaShieldAlt } from 'react-icons/fa';

const LivestockDetail = () => {
  const { id } = useParams();
  const [livestock, setLivestock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLivestock();
  }, [id]);

  const fetchLivestock = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/livestock/${id}`);
      setLivestock(response.data);
    } catch (error) {
      console.error('Error fetching livestock:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!livestock) {
    return <div className="text-center py-12">Livestock not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {livestock.images && livestock.images[0] && (
              <img src={livestock.images[0]} alt={livestock.breed} className="w-full h-96 object-cover" />
            )}
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {livestock.images && livestock.images.slice(1).map((img, idx) => (
              <img key={idx} src={img} alt={`${livestock.breed} ${idx}`} className="w-full h-24 object-cover rounded" />
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{livestock.breed}</h1>
          <p className="text-gray-600 mb-4 capitalize">{livestock.type}</p>
          <p className="text-4xl text-green-600 font-bold mb-4">${livestock.price}</p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <FaWeightHanging className="text-gray-400 mr-3" />
              <span>Weight: {livestock.weight || 'N/A'} kg</span>
            </div>
            <div className="flex items-center">
              <FaCalendar className="text-gray-400 mr-3" />
              <span>Age: {livestock.age} {livestock.ageUnit}</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-gray-400 mr-3" />
              <span>Location: {livestock.location}</span>
            </div>
            <div className="flex items-center">
              <FaShieldAlt className="text-gray-400 mr-3" />
              <span>Health Status: <span className="capitalize">{livestock.healthStatus}</span></span>
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{livestock.description}</p>
          </div>

          <div className="border-t pt-4 mb-6">
            <h3 className="font-semibold mb-2">Seller Information</h3>
            <p className="text-gray-600">Name: {livestock.seller?.name}</p>
            <p className="text-gray-600">Business: {livestock.seller?.businessName}</p>
            <p className="text-gray-600">Location: {livestock.seller?.location}</p>
            {livestock.seller?.isVerified && (
              <p className="text-green-600 text-sm mt-1">✓ Verified Seller</p>
            )}
          </div>

          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
            Contact Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivestockDetail;