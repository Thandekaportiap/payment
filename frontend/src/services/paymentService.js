// src/services/paymentService.js
import axios from 'axios';

// const PEACH_API_URL = 'https://secure.peachpayments.com/api/v2';
// const API_KEY = 'OGFjN2E0Y2E3NTljZDc4NTAxNzU5ZGQ3NThhYjAyZGR8N3JRaVVtbFVQbA==';
// const ENTITY_ID = '8ac7a4ca759cd78501759dd759ad02df';
// For testing environment
const PEACH_API_URL = 'https://testsecure.peachpayments.com/api/v2';
const API_KEY = 'OGFjN2E0Y2E3NTljZDc4NTAxNzU5ZGQ3NThhYjAyZGR8N3JRaVVtbFVQbA==';
const ENTITY_ID = '8ac7a4ca759cd78501759dd759ad02df';

export const initiateSubscription = async (userId, cardDetails) => {
  try {
    const response = await axios.post(`${PEACH_API_URL}/subscriptions`, {
      entityId: ENTITY_ID,
      amount: '100.00', // R100
      currency: 'ZAR',
      paymentType: 'DB',
      card: cardDetails,
      customer: {
        merchantCustomerId: userId,
        givenName: '...',
        surname: '...'
      },
      recurring: {
        type: 'REPEATED',
        frequency: 'MONTHLY'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};