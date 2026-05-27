import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaTachometerAlt } from 'react-icons/fa';

const VehicleDetail = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    startDate: '',
    endDate: '',
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/vehicles/${id}`);
      setVehicle(response.data);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/vehicles/book', {
        vehicleId: id,
        ...booking
      });
      alert('Booking request submitted successfully!');
      setBooking({ startDate: '', endDate: '', customerName: '', customerEmail: '', customerPhone: '' });
    } catch (error) {
      alert('Error booking vehicle: ' + error.response?.data?.message);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!vehicle) {
    return <div className="text-center py-12">Vehicle not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {vehicle.images && vehicle.images[0] && (
              <img src={vehicle.images[0]} alt={vehicle.model} className="w-full h-96 object-cover" />
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{vehicle.model}</h1>
          <p className="text-gray-600 mb-4 capitalize">{vehicle.type}</p>
          <p className="text-4xl text-green-600 font-bold mb-4">${vehicle.pricePerDay}/day</p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <FaTachometerAlt className="text-gray-400 mr-3" />
              <span>Capacity: {vehicle.capacity}</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-gray-400 mr-3" />
              <span>Location: {vehicle.location}</span>
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{vehicle.description}</p>
          </div>

          <div className="border-t pt-4 mb-6">
            <h3 className="font-semibold mb-2">Features</h3>
            <ul className="list-disc list-inside">
              {vehicle.features && vehicle.features.map((feature, idx) => (
                <li key={idx} className="text-gray-600">{feature}</li>
              ))}
            </ul>
          </div>

          {/* Booking Form */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Book This Vehicle</h3>
            <form onSubmit={handleBooking} className="space-y-3">
              <input type="text" name="customerName" placeholder="Your Name" required onChange={handleBookingChange} className="w-full border rounded p-2" />
              <input type="email" name="customerEmail" placeholder="Your Email" required onChange={handleBookingChange} className="w-full border rounded p-2" />
              <input type="tel" name="customerPhone" placeholder="Your Phone" required onChange={handleBookingChange} className="w-full border rounded p-2" />
              <input type="date" name="startDate" required onChange={handleBookingChange} className="w-full border rounded p-2" />
              <input type="date" name="endDate" required onChange={handleBookingChange} className="w-full border rounded p-2" />
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition">
                Request Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;