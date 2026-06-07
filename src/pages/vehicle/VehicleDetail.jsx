import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaArrowLeft, 
  FaShareAlt, 
  FaHeart, 
  FaTachometerAlt, 
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUserCheck,
  FaPhoneAlt,
  FaEnvelope,
  FaBuilding,
  FaIdCard,
  FaCalendarAlt
} from 'react-icons/fa';
import { formatZAR } from '../../utils/currency';
import './VehicleDetail.css';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [booking, setBooking] = useState({
    startDate: '',
    endDate: '',
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/vehicles/${id}`);
      setVehicle(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      setError('Vehicle not found or failed to load');
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
    
    if (!vehicle.available) {
      alert('This vehicle is currently on duty/rented and not available for booking.');
      return;
    }
    
    setBookingLoading(true);
    try {
      await axios.post('http://localhost:5000/api/vehicles/book', {
        vehicleId: id,
        ...booking
      });
      alert('Booking request submitted successfully! The owner will contact you shortly.');
      setBooking({ 
        startDate: '', 
        endDate: '', 
        customerName: '', 
        customerEmail: '', 
        customerPhone: '' 
      });
      setShowBookingModal(false);
      fetchVehicle();
    } catch (error) {
      alert('Error booking vehicle: ' + (error.response?.data?.message || 'Please try again'));
    } finally {
      setBookingLoading(false);
    }
  };

  const getStatusInfo = (available) => {
    if (available) {
      return {
        text: 'Available',
        class: 'zzz999_status_available',
        icon: <FaCheckCircle />
      };
    } else {
      return {
        text: 'On Duty',
        class: 'zzz999_status_sold',
        icon: <FaClock />
      };
    }
  };

  const handleContactOwner = () => {
    if (vehicle?.owner?.phone) {
      window.location.href = `tel:${vehicle.owner.phone}`;
    } else {
      alert('Contact information not available');
    }
  };

  const handleEmailOwner = () => {
    if (vehicle?.owner?.email) {
      window.location.href = `mailto:${vehicle.owner.email}?subject=Inquiry about ${vehicle.model}`;
    } else {
      alert('Email information not available');
    }
  };

  if (loading) {
    return (
      <div className="zzz999_livestock_page">
        <div className="zzz999_header">
          <button className="zzz999_back_btn" onClick={() => navigate('/vehicles')}>
            <FaArrowLeft />
          </button>
          <div className="zzz999_header_actions">
            <button className="zzz999_icon_btn">
              <FaHeart />
            </button>
            <button className="zzz999_icon_btn">
              <FaShareAlt />
            </button>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading vehicle details...</div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="zzz999_livestock_page">
        <div className="zzz999_header">
          <button className="zzz999_back_btn" onClick={() => navigate('/vehicles')}>
            <FaArrowLeft />
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>{error || 'Vehicle not found'}</p>
          <button onClick={() => navigate('/vehicles')} style={{ marginTop: '20px', padding: '10px 20px' }}>
            Browse Vehicles
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(vehicle.available);
  const images = vehicle.images || [];

  return (
    <div className="zzz999_livestock_page">
      {/* Header */}
      <div className="zzz999_header">
        <button className="zzz999_back_btn" onClick={() => navigate('/vehicles')}>
          <FaArrowLeft />
        </button>
        <div className="zzz999_header_actions">
          <button className="zzz999_icon_btn">
            <FaHeart />
          </button>
          <button className="zzz999_icon_btn">
            <FaShareAlt />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="zzz999_gallery">
        <div className="zzz999_main_img_box">
          {images.length > 0 ? (
            <img src={images[selectedImage]} alt={vehicle.model} className="zzz999_main_img" />
          ) : (
            <div className="zzz999_main_img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
              No Image Available
            </div>
          )}
          {images.length > 0 && (
            <div className="zzz999_img_counter">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>
        
        {images.length > 1 && (
          <div className="zzz999_thumbnails">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`zzz999_thumb ${selectedImage === idx ? 'zzz999_thumb_active' : ''}`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img} alt={`View ${idx + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="zzz999_content">
        {/* Price and Status Row */}
        <div className="zzz999_price_row">
          <div className="zzz999_price_box">
            <span className="zzz999_price_label">Price per Day</span>
            <span className="zzz999_price_value">{formatZAR(vehicle.pricePerDay)}</span>
            {vehicle.pricePerKm && (
              <span style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                +{formatZAR(vehicle.pricePerKm)}/km
              </span>
            )}
          </div>
          <div className={`zzz999_status ${statusInfo.class}`}>
            {statusInfo.icon} {statusInfo.text}
          </div>
        </div>

        {/* Title */}
        <h1 className="zzz999_title">{vehicle.model}</h1>
        <p className="zzz999_type">{vehicle.type}</p>

        {/* Details Grid */}
        <div className="zzz999_details_grid">
          <div className="zzz999_detail_card">
            <FaTachometerAlt className="zzz999_detail_icon" />
            <div>
              <div className="zzz999_detail_label">Capacity</div>
              <div className="zzz999_detail_value">{vehicle.capacity}</div>
            </div>
          </div>
          <div className="zzz999_detail_card">
            <FaMapMarkerAlt className="zzz999_detail_icon" />
            <div>
              <div className="zzz999_detail_label">Location</div>
              <div className="zzz999_detail_value">{vehicle.location}</div>
            </div>
          </div>
          <div className="zzz999_detail_card">
            <FaIdCard className="zzz999_detail_icon" />
            <div>
              <div className="zzz999_detail_label">License Plate</div>
              <div className="zzz999_detail_value">{vehicle.licensePlate}</div>
            </div>
          </div>
          <div className="zzz999_detail_card">
            <FaCalendarAlt className="zzz999_detail_icon" />
            <div>
              <div className="zzz999_detail_label">Listed Date</div>
              <div className="zzz999_detail_value">
                {new Date(vehicle.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Features Tags */}
        {vehicle.features && vehicle.features.length > 0 && (
          <div className="zzz999_tags">
            {vehicle.features.map((feature, idx) => (
              <span key={idx} className="zzz999_tag zzz999_tag_vaccinated">
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Owner Verification Warning */}
        {vehicle.owner && !vehicle.ownerVerified && (
          <div className="zzz999_warning">
            <FaExclamationTriangle />
            <div>
              <strong>Unverified Owner</strong>
              <p>This owner has not completed verification. Please exercise caution when booking.</p>
            </div>
          </div>
        )}

        {/* Verified Owner Badge */}
        {vehicle.owner && vehicle.ownerVerified && (
          <div className="zzz999_verified">
            <FaUserCheck />
            <div>
              <strong>Verified Owner</strong>
              <p>This owner is verified. Book with confidence!</p>
            </div>
          </div>
        )}

        {/* Description */}
        <h3 className="zzz999_section_title">Description</h3>
        <p className="zzz999_description">{vehicle.description}</p>

        {/* Seller Information */}
        {vehicle.owner && (
          <>
            <h3 className="zzz999_section_title">Owner Information</h3>
            <div className="zzz999_seller_card">
              <div className="zzz999_seller_avatar">
                {vehicle.owner.name?.charAt(0) || 'O'}
              </div>
              <div>
                <div className="zzz999_seller_name">{vehicle.owner.name || 'Vehicle Owner'}</div>
                {vehicle.owner.businessName && (
                  <div className="zzz999_seller_business">
                    <FaBuilding size={12} /> {vehicle.owner.businessName}
                  </div>
                )}
                {vehicle.owner.phone && (
                  <div className="zzz999_seller_phone">
                    <FaPhoneAlt size={12} /> {vehicle.owner.phone}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* DESKTOP BUTTONS */}
        <div className="zzz999_desktop_btns">
          <button className="zzz999_action_btn zzz999_btn_contact" onClick={handleContactOwner}>
            <FaPhoneAlt /> Contact Owner
          </button>
          {vehicle.available && (
            <button className="zzz999_action_btn zzz999_btn_inquire" onClick={() => setShowBookingModal(true)}>
              <FaCalendarAlt /> Book Now
            </button>
          )}
        </div>

        <div className="zzz999_footer">
          <span>Report Listing</span>
          <span>ID: {vehicle._id?.slice(-6)}</span>
        </div>
      </div>

      {/* MOBILE BUTTONS - Fixed at bottom */}
      <div className="zzz999_mobile_btns">
        <button className="zzz999_action_btn zzz999_btn_contact" onClick={handleContactOwner}>
          <FaPhoneAlt /> Contact Owner
        </button>
        {vehicle.available && (
          <button className="zzz999_action_btn zzz999_btn_inquire" onClick={() => setShowBookingModal(true)}>
            <FaCalendarAlt /> Book Now
          </button>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="zzz999_modal_overlay" onClick={() => setShowBookingModal(false)}>
          <div className="zzz999_modal" onClick={(e) => e.stopPropagation()}>
            <div className="zzz999_modal_header">
              <h3>Book {vehicle.model}</h3>
              <button onClick={() => setShowBookingModal(false)} className="zzz999_modal_close">&times;</button>
            </div>
            <form onSubmit={handleBooking} className="zzz999_booking_form">
              <input 
                type="text" 
                name="customerName" 
                placeholder="Your Full Name" 
                value={booking.customerName}
                required 
                onChange={handleBookingChange} 
              />
              <input 
                type="email" 
                name="customerEmail" 
                placeholder="Your Email" 
                value={booking.customerEmail}
                required 
                onChange={handleBookingChange} 
              />
              <input 
                type="tel" 
                name="customerPhone" 
                placeholder="Your Phone Number" 
                value={booking.customerPhone}
                required 
                onChange={handleBookingChange} 
              />
              <div className="zzz999_date_range">
                <input 
                  type="date" 
                  name="startDate" 
                  placeholder="Start Date"
                  value={booking.startDate}
                  required 
                  onChange={handleBookingChange} 
                  min={new Date().toISOString().split('T')[0]}
                />
                <input 
                  type="date" 
                  name="endDate" 
                  placeholder="End Date"
                  value={booking.endDate}
                  required 
                  onChange={handleBookingChange} 
                  min={booking.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <button type="submit" disabled={bookingLoading} className="zzz999_modal_submit">
                {bookingLoading ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetail;