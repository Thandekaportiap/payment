const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Subscription verification endpoint
app.post('/api/verify-subscription', async (req, res) => {
  const { userId } = req.body;
  
  try {
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = doc.data();
    const isSubscribed = userData.subscriptionStatus === 'active';
    
    res.json({ subscribed: isSubscribed });
  } catch (error) {
    console.error('Error verifying subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Webhook for Peach Payments
app.post('/api/payment-webhook', async (req, res) => {
  const { userId, paymentId, status } = req.body;
  
  if (status === 'success') {
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      subscriptionStatus: 'active',
      lastPaymentDate: new Date(),
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
  }
  
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});