// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBJI861CPvvokYxiZdOQUpgsBUya2kBBSE",
  authDomain: "smart-box-e1cd8.firebaseapp.com",
  projectId: "smart-box-e1cd8",
  storageBucket: "smart-box-e1cd8.firebasestorage.app",
  messagingSenderId: "40791071305",
  appId: "1:40791071305:web:e61d2fdc8c99400ce07d98",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
