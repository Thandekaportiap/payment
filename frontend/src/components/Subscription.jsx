// src/components/Subscription.js
import React, { useState } from 'react';
import { initiateSubscription } from '../services/paymentService';
import { auth } from '../components/firebase';
import './Subscription.css'; // Create this CSS file for styling

export default function Subscription({ onSubscriptionSuccess }) {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateCard = () => {
    const newErrors = {};
    
    // Card number validation (basic check)
    if (!/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ''))) {
      newErrors.number = 'Enter a valid 16-digit card number';
    }
    
    // Expiry date validation
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      newErrors.expiry = 'Enter expiry in MM/YY format';
    } else {
      const [month, year] = cardDetails.expiry.split('/');
      const expiryDate = new Date(`20${year}`, month - 1);
      if (expiryDate < new Date()) {
        newErrors.expiry = 'Card has expired';
      }
    }
    
    // CVV validation
    if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = 'Enter a valid CVV (3-4 digits)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'number') {
      const formattedValue = formatCardNumber(value.replace(/\D/g, ''));
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    } 
    else if (name === 'expiry') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substring(0, 5);
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    }
    else if (name === 'cvv') {
      setCardDetails(prev => ({ ...prev, [name]: value.replace(/\D/g, '') }));
    }
  };

  const handleSubscribe = async () => {
    if (!validateCard()) return;
    
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');
      
      // Format card number without spaces for API
      const apiCardDetails = {
        ...cardDetails,
        number: cardDetails.number.replace(/\s/g, '')
      };
      
      await initiateSubscription(user.uid, apiCardDetails);
      setSuccess(true);
      if (onSubscriptionSuccess) onSubscriptionSuccess();
    } catch (error) {
      alert(`Subscription failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="subscription-success">
        <h2>Subscription Successful!</h2>
        <p>Your R100/month subscription is now active.</p>
        <button onClick={() => setSuccess(false)}>Back to form</button>
      </div>
    );
  }

  return (
    <div className="subscription-container">
      <h2>Subscribe for R100/month</h2>
      <div className="card-form">
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            name="number"
            placeholder="4242 4242 4242 4242"
            value={cardDetails.number}
            onChange={handleInputChange}
            maxLength={19}
            className={errors.number ? 'error' : ''}
          />
          {errors.number && <span className="error-message">{errors.number}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChange={handleInputChange}
              maxLength={5}
              className={errors.expiry ? 'error' : ''}
            />
            {errors.expiry && <span className="error-message">{errors.expiry}</span>}
          </div>
          
          <div className="form-group">
            <label>CVV</label>
            <input
              type="text"
              name="cvv"
              placeholder="123"
              value={cardDetails.cvv}
              onChange={handleInputChange}
              maxLength={4}
              className={errors.cvv ? 'error' : ''}
            />
            {errors.cvv && <span className="error-message">{errors.cvv}</span>}
          </div>
        </div>
        
        <button 
          onClick={handleSubscribe} 
          disabled={loading}
          className="subscribe-button"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            'Subscribe Now'
          )}
        </button>
        
        <div className="test-note">
          <p>Test Card: 4242 4242 4242 4242</p>
          <p>Any future expiry date and 3-digit CVV</p>
        </div>
      </div>
    </div>
  );
}