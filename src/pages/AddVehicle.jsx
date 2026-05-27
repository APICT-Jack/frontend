import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddVehicle = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'truck',
    model: '',
    capacity: '',
    licensePlate: '',
    pricePerDay: '',
    pricePerKm: '',
    description: '',
    location: '',
    features: ''
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    try {
      const response = await axios.post('http://localhost:5000/api/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setImages(response.data.urls);
    } catch (error) {
      alert('Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }
    
    const featuresArray = formData.features.split(',').map(f => f.trim());
    
    try {
      await axios.post('http://localhost:5000/api/vehicles', {
        ...formData,
        images,
        features: featuresArray,
        pricePerDay: Number(formData.pricePerDay),
        pricePerKm: formData.pricePerKm ? Number(formData.pricePerKm) : undefined
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      alert('Vehicle listing created successfully!');
      navigate('/seller/dashboard');
    } catch (error) {
      alert('Error creating listing: ' + error.response?.data?.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">Add Vehicle Listing</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Vehicle Type</label>
          <select name="type" onChange={handleChange} required className="w-full border rounded p-2">
            <option value="truck">Truck</option>
            <option value="trailer">Trailer</option>
            <option value="van">Van</option>
            <option value="pickup">Pickup</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Model</label>
          <input type="text" name="model" onChange={handleChange} required className="w-full border rounded p-2" />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Capacity (e.g., 2 tons, 10 livestock)</label>
          <input type="text" name="capacity" onChange={handleChange} required className="w-full border rounded p-2" />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">License Plate</label>
          <input type="text" name="licensePlate" onChange={handleChange} required className="w-full border rounded p-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Price per Day ($)</label>
            <input type="number" name="pricePerDay" onChange={handleChange} required className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Price per KM ($) - Optional</label>
            <input type="number" name="pricePerKm" onChange={handleChange} className="w-full border rounded p-2" />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Location</label>
          <input type="text" name="location" onChange={handleChange} required className="w-full border rounded p-2" />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Features (comma-separated)</label>
          <input type="text" name="features" placeholder="e.g., GPS, Air Conditioning, Hydraulic Lift" onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea name="description" rows="4" onChange={handleChange} required className="w-full border rounded p-2"></textarea>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Images (up to 10)</label>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="w-full border rounded p-2" />
          {uploading && <p className="text-sm text-blue-600 mt-1">Uploading images...</p>}
          {images.length > 0 && <p className="text-sm text-green-600 mt-1">{images.length} image(s) uploaded</p>}
        </div>
        
        <button type="submit" disabled={uploading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Create Vehicle Listing
        </button>
      </form>
    </div>
  );
};

export default AddVehicle;