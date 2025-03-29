import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_wn6HBNcIDnQJzz-S1j_Fm20tUtgc_OY",
  authDomain: "sat-hackpsu-2025.firebaseapp.com",
  projectId: "sat-hackpsu-2025",
  storageBucket: "sat-hackpsu-2025.firebasestorage.app",
  messagingSenderId: "41582977382",
  appId: "1:41582977382:web:1f811a79d99ce0595fa8a7",
  measurementId: "G-B3ZK0MSF09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
