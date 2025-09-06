// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhCf5QTv6P2sSERH3IwposPI4hGcBgRL0",
  authDomain: "mailpilot-ai-s9c35.firebaseapp.com",
  projectId: "mailpilot-ai-s9c35",
  storageBucket: "mailpilot-ai-s9c35.firebasestorage.app",
  messagingSenderId: "296206359025",
  appId: "1:296206359025:web:941e94a0dd6892e8570c50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
