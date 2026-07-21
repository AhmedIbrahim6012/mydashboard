import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDAishRviaNwf1aFeSlIGgp-25WHzoU_c0",
  authDomain: "mr-fix-62f88.firebaseapp.com",
  projectId: "mr-fix-62f88",
  storageBucket: "mr-fix-62f88.firebasestorage.app",
  messagingSenderId: "174946494029",
  appId: "1:174946494029:web:4d4dea1abcf5fa55221e04"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);