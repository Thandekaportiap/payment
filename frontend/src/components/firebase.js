// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-vuzqt1B9_i8vTnyP5bS2KosGtLnb1FY",
  authDomain: "payment-7834e.firebaseapp.com",
  projectId: "payment-7834e",
  storageBucket: "payment-7834e.firebasestorage.app",
  messagingSenderId: "214453413345",
  appId: "1:214453413345:web:eef903f7af38331348dea0",
  measurementId: "G-CEH5D1DRQ8"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Export the services you need
export { auth, db };