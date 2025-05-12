// src/App.js
import React, { useState, useEffect } from 'react';
import { auth } from '../src/components/firebase';
import Subscription from './components/Subscription';
import PaymentStatus from './components/PaymentStatus';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await checkSubscriptionStatus(currentUser.uid);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Check subscription status
  const checkSubscriptionStatus = async (userId) => {
    try {
      const response = await fetch('http://localhost:5000/api/verify-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      setSubscriptionStatus(data.subscribed ? 'active' : 'inactive');
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionStatus('error');
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async () => {
    if (user) {
      await checkSubscriptionStatus(user.uid);
    }
  };

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Lyra Subscription App</h1>
        {user ? (
          <>
            <p>Welcome, {user.email}</p>
            <PaymentStatus status={subscriptionStatus} />
            {subscriptionStatus !== 'active' && (
              <Subscription onSuccess={handlePaymentSuccess} />
            )}
            <button 
              onClick={() => auth.signOut()} 
              className="sign-out-btn"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <p>Please sign in to subscribe</p>
            <button 
              onClick={() => auth.signInWithEmailAndPassword('test@example.com', 'password')} 
              className="sign-in-btn"
            >
              Sign In (Test)
            </button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;