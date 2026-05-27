import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUpload, FaCheckCircle } from 'react-icons/fa';

const Verification = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState({
    faceRecognition: null,
    identityDoc: null,
    residentCert: null
  });
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState({});

  const handleFileChange = (e, type) => {
    setFiles({
      ...files,
      [type]: e.target.files[0]
    });
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post('http://localhost:5000/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const faceUrl = await uploadToCloudinary(files.faceRecognition);
      const identityUrl = await uploadToCloudinary(files.identityDoc);
      const residentUrl = await uploadToCloudinary(files.residentCert);
      
      await axios.post('http://localhost:5000/api/auth/verify', {
        faceRecognitionImage: faceUrl,
        identityDocument: identityUrl,
        residentCertificate: residentUrl
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      alert('Verification documents submitted successfully!');
      navigate('/seller/dashboard');
    } catch (error) {
      alert('Error submitting verification: ' + error.response?.data?.message);
    } finally {
      setUploading(false);
    }
  };

  if (user?.isVerified) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Account Verified!</h2>
        <p className="text-gray-600 mb-4">Your account has been verified. You can now list items for sale.</p>
        <button onClick={() => navigate('/seller/dashboard')} className="bg-green-600 text-white px-6 py-2 rounded">
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Seller Verification</h2>
      <p className="text-gray-600 mb-6 text-center">Please submit the following documents to verify your identity</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Face Recognition Photo</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'faceRecognition')} required className="w-full border rounded p-2" />
          <p className="text-sm text-gray-500 mt-1">Upload a clear photo of your face</p>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Identity Document (ID/Passport)</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'identityDoc')} required className="w-full border rounded p-2" />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Resident Certificate</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'residentCert')} required className="w-full border rounded p-2" />
        </div>
        
        <button type="submit" disabled={uploading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          {uploading ? 'Uploading...' : 'Submit Verification'}
        </button>
      </form>
    </div>
  );
};

export default Verification;