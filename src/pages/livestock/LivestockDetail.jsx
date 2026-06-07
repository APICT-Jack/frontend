// LivestockDetail.jsx - FINAL WORKING VERSION
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaMapMarkerAlt, FaCalendar, FaWeightHanging, FaShieldAlt, 
  FaExclamationTriangle, FaCheckCircle, FaPhone, FaEnvelope, 
  FaShare, FaHeart, FaComments, FaArrowLeft, FaBuilding
} from 'react-icons/fa';
import './LivestockDetail.css';

const LivestockDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [livestock, setLivestock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

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

  const formatZARPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'white' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #4CAF50', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!livestock) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'white' }}>
        <h2 style={{ color: '#721c24', marginBottom: '10px', fontSize: '24px' }}>Livestock not found</h2>
        <p style={{ color: '#721c24', marginBottom: '20px' }}>The livestock listing you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/livestock')} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
          Back to Listings
        </button>
      </div>
    );
  }

  const isSellerVerified = livestock.seller?.isVerified;
  const showWarning = !isSellerVerified;

  return (
    <div className="zzz999_livestock_page">
      {/* Header */}
      <div className="zzz999_header">
        <button className="zzz999_back_btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <div className="zzz999_header_actions">
          <button className="zzz999_icon_btn" onClick={() => setIsSaved(!isSaved)}>
            <FaHeart color={isSaved ? '#ff4444' : '#666'} size={18} />
          </button>
          <button className="zzz999_icon_btn">
            <FaShare size={18} />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="zzz999_gallery">
        <div className="zzz999_main_img_box">
          <img 
            src={livestock.images && livestock.images[selectedImage] ? livestock.images[selectedImage] : '/api/placeholder/600/400'} 
            alt={livestock.breed}
            className="zzz999_main_img"
          />
          {livestock.images && livestock.images.length > 1 && (
            <div className="zzz999_img_counter">
              {selectedImage + 1} / {livestock.images.length}
            </div>
          )}
        </div>
        
        {livestock.images && livestock.images.length > 1 && (
          <div className="zzz999_thumbnails">
            {livestock.images.map((img, idx) => (
              <div 
                key={idx} 
                className={`zzz999_thumb ${selectedImage === idx ? 'zzz999_thumb_active' : ''}`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img} alt={`${livestock.breed} ${idx + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="zzz999_content">
        {/* Price and Status */}
        <div className="zzz999_price_row">
          <div className="zzz999_price_box">
            <span className="zzz999_price_label">Price</span>
            <span className="zzz999_price_value">{formatZARPrice(livestock.price)}</span>
          </div>
          <div className={`zzz999_status zzzz999_status_${livestock.status}`}>
            {livestock.status?.toUpperCase()}
          </div>
        </div>

        {/* Title */}
        <h1 className="zzz999_title">{livestock.breed}</h1>
        <p className="zzz999_type">{livestock.type}</p>

        {/* Key Details Grid */}
        <div className="zzz999_details_grid">
          <div className="zzz999_detail_card">
            <FaWeightHanging className="zzz999_detail_icon" />
            <div>
              <div className="zzz999_detail_label">Weight</div>
              <div className="zzz999_detail_value">{livestock.weight || 'N/A'} kg</div>
            </div>
          </div>
          
          <div className="zzz999_detail_card">
            <FaCalendar className="zzz999_detail_icon" />
            <div>
              <div className="zzz999_detail_label">Age</div>
              <div className="zzz999_detail_value">{livestock.age} {livestock.ageUnit}</div>
            </div>
          </div>
          
          <div className="zzz999_detail_card">
            <FaMapMarkerAlt className="zzz999_detail_icon" />
            <div>
              <div className="zzz999_detail_label">Location</div>
              <div className="zzz999_detail_value">{livestock.location}</div>
            </div>
          </div>
          
          <div className="zzz999_detail_card">
            <FaShieldAlt className="zzz999_detail_icon" />
            <div>
              <div className="zzz999_detail_label">Health</div>
              <div className="zzz999_detail_value" style={{ color: livestock.healthStatus === 'excellent' ? '#4CAF50' : livestock.healthStatus === 'good' ? '#8BC34A' : livestock.healthStatus === 'fair' ? '#FFC107' : '#F44336' }}>
                {livestock.healthStatus?.charAt(0).toUpperCase() + livestock.healthStatus?.slice(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="zzz999_tags">
          {livestock.vaccinated && (
            <span className="zzz999_tag zzzz999_tag_vaccinated">✓ Vaccinated</span>
          )}
          {livestock.quantity > 1 && (
            <span className="zzz999_tag zzzz999_tag_quantity">📦 {livestock.quantity} animals available</span>
          )}
        </div>

        {/* Verification Warning/Verified */}
        {showWarning && (
          <div className="zzz999_warning">
            <FaExclamationTriangle />
            <div>
              <strong>Seller Unverified</strong>
              <p>This seller has not completed verification. Please exercise caution.</p>
            </div>
          </div>
        )}
        
        {isSellerVerified && (
          <div className="zzz999_verified">
            <FaCheckCircle />
            <div>
              <strong>Verified Seller</strong>
              <p>This seller has been verified by Imfuyo.</p>
            </div>
          </div>
        )}

        {/* Description */}
        <h3 className="zzz999_section_title">Description</h3>
        <p className="zzz999_description">{livestock.description}</p>

        {/* Seller Information */}
        <h3 className="zzz999_section_title">Seller Information</h3>
        <div className="zzz999_seller_card">
          <div className="zzz999_seller_avatar">
            {livestock.seller?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <p className="zzz999_seller_name">{livestock.seller?.name}</p>
            {livestock.seller?.businessName && (
              <p className="zzz999_seller_business">
                <FaBuilding size={12} /> {livestock.seller?.businessName}
              </p>
            )}
            {livestock.seller?.businessAddress && (
              <p className="zzz999_seller_address">
                <FaMapMarkerAlt size={12} /> {livestock.seller?.businessAddress}
              </p>
            )}
            {livestock.seller?.phone && (
              <p className="zzz999_seller_phone">
                <FaPhone size={12} /> {livestock.seller?.phone}
              </p>
            )}
          </div>
        </div>

        {/* Desktop Action Buttons */}
        <div className="zzz999_desktop_btns">
          <button className="zzz999_action_btn zzzz999_btn_contact">
            <FaPhone size={16} /> Contact Seller
          </button>
          {livestock.status === 'available' && (
            <button className="zzz999_action_btn zzzz999_btn_inquire">
              <FaComments size={16} /> Make Inquiry
            </button>
          )}
        </div>

        {/* Footer Info */}
        <div className="zzz999_footer">
          <span>Listed: {new Date(livestock.createdAt).toLocaleDateString('en-ZA')}</span>
          <span>ID: {livestock._id?.slice(-6)}</span>
        </div>
      </div>

      {/* Mobile Bottom Action Buttons */}
      <div className="zzz999_mobile_btns">
        <button className="zzz999_action_btn zzzz999_btn_contact">
          <FaPhone size={16} /> Contact
        </button>
        {livestock.status === 'available' && (
          <button className="zzz999_action_btn zzzz999_btn_inquire">
            <FaComments size={16} /> Inquire
          </button>
        )}
      </div>
    </div>
  );
};

export default LivestockDetail;