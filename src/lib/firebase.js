import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your hardcoded Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpgqwQpGjYRADXQoM5XNHd4xpDEzCjBVY",
  authDomain: "driveshare-d085e.firebaseapp.com",
  projectId: "driveshare-d085e",
  storageBucket: "driveshare-d085e.firebasestorage.app",
  messagingSenderId: "434314973818",
  appId: "1:434314973818:web:2ef3d338c81e6aa62861c3",
  measurementId: "G-VVWP4LLGQR"
};

console.log("Firebase Config:", firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Only initialize analytics on the client side
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };