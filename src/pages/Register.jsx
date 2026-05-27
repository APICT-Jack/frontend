import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'buyer',
    businessName: '',
    businessAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(formData);
    setLoading(false);
    if (success) {
      if (formData.role === 'seller') {
        navigate('/seller/verify');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Full Name</label>
          <input type="text" name="name" required onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input type="email" name="email" required onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input type="password" name="password" required onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Phone Number</label>
          <input type="tel" name="phone" required onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">I want to register as:</label>
          <select name="role" onChange={handleChange} className="w-full border rounded p-2">
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>
        
        {formData.role === 'seller' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Business Name</label>
              <input type="text" name="businessName" onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Business Address</label>
              <textarea name="businessAddress" onChange={handleChange} className="w-full border rounded p-2" rows="3"></textarea>
            </div>
          </>
        )}
        
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <p className="text-center text-gray-600 mt-4">
        Already have an account? <Link to="/login" className="text-green-600 hover:underline">Login</Link>
      </p>
    </div>
  );
};

export default Register;