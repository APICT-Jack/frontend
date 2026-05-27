import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Login to Imfuyo</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded p-2" />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border rounded p-2" />
        </div>
        
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p className="text-center text-gray-600 mt-4">
        Don't have an account? <Link to="/register" className="text-green-600 hover:underline">Register</Link>
      </p>
    </div>
  );
};

export default Login;