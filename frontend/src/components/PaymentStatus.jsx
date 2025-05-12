import React from 'react';

const PaymentStatus = ({ status }) => {
  if (status === 'active') {
    return <div className="payment-status active">✅ Subscription Active</div>;
  }
  if (status === 'inactive') {
    return <div className="payment-status inactive">❌ No Active Subscription</div>;
  }
  if (status === 'error') {
    return <div className="payment-status error">⚠️ Error checking status</div>;
  }
  return null;
};

export default PaymentStatus;